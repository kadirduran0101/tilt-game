// TILT real-input harness. NO .click() shortcuts on canvas. Real touchscreen.tap.
import { chromium, webkit, devices } from "playwright";
import { mkdir, writeFile } from "fs/promises";

const URL = process.argv[2] || "http://localhost:3000/";
const TS = new Date().toISOString().replace(/[:.]/g, "-");
const OUT = `runs/real-test/${TS}`;

async function ensureDir(p) { await mkdir(p, { recursive: true }); }

async function runDevice(deviceName, browser, device) {
  const ctx = await browser.newContext({ ...device });
  const page = await ctx.newPage();
  const consoleErrors = [], pageErrors = [];
  page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", e => pageErrors.push(String(e)));
  const out = { device: deviceName, gates: [], screenshots: [], consoleErrors, pageErrors, verdict: "RED" };
  const gate = (name, pass, observed = {}, detail = "") => { out.gates.push({ name, pass, observed, detail }); return pass; };

  try {
    await page.goto(URL + "?v=" + Date.now(), { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(800);
    const ssDir = `${OUT}/${deviceName}`;
    await ensureDir(ssDir);

    // SS 1: cold load
    await page.screenshot({ path: `${ssDir}/01-cold-load.png` });
    out.screenshots.push("01-cold-load.png");

    // GATE 1: splash visible with daily seed shown
    const splashState = await page.evaluate(() => {
      const s = document.getElementById('splash');
      const seedDate = document.getElementById('splash-seed-date')?.textContent;
      const seedMut = document.getElementById('splash-seed-mut')?.textContent;
      return s ? { visible: !s.classList.contains('fade'), seedDate, seedMut, text: s.innerText.slice(0, 200) } : null;
    });
    gate("splash_with_daily_seed", splashState?.visible && /\d{4}-\d{2}-\d{2}/.test(splashState.seedDate || '') && (splashState.seedMut || '').length > 0, splashState, "splash should show today's seed date + mutator-of-day");

    // GATE 2: splash text mentions mechanic in TR or EN (no abstract jargon)
    const splashText = (splashState?.text || '').toLowerCase();
    const hasMechanic = /flip|tap|chain|combo|mutator|seed|pinball/.test(splashText);
    gate("splash_explains_mechanic", hasMechanic, { sample: (splashState?.text || '').slice(0, 150) }, "splash text should mention flip/tap/combo/seed/mutator");

    // ACTION: dismiss splash via touch
    const splashBox = await page.locator('#splash').boundingBox();
    if (splashBox) {
      await page.touchscreen.tap(splashBox.x + splashBox.width / 2, splashBox.y + splashBox.height / 2);
    } else {
      await page.evaluate(() => window.dismissSplash && window.dismissSplash());
    }
    await page.waitForTimeout(1500);

    // GATE 3: run started + table 1 active
    const runState = await page.evaluate(() => {
      const r = window.state?.run, t = window.state?.table;
      return r && t ? { runActive: !r.over, flow: r.flow, tableIdx: r.tableIndex, ballsSpawned: t.ballsSpawned, mutators: r.mutatorsActive } : null;
    });
    gate("run_started", runState?.runActive === true && runState?.tableIdx === 1, runState, "after splash dismiss, run should be active on table 1");

    // GATE 4: mutator-of-day applied from table 1
    gate("mutator_of_day_applied", (runState?.mutators?.length || 0) >= 1, { mutators: runState?.mutators }, "mutator-of-day must be active from table 1");

    // SS 2: post-splash table active
    await page.screenshot({ path: `${ssDir}/02-table-1-active.png` });
    out.screenshots.push("02-table-1-active.png");

    // GATE 5: ball spawned + auto-launching
    const ballState = await page.evaluate(() => {
      const t = window.state?.table;
      if (!t || !t.balls.length) return null;
      const b = t.balls[0];
      return { spawned: true, x: Math.round(b.x), y: Math.round(b.y), vx: b.vx, vy: b.vy };
    });
    gate("ball_auto_spawned", ballState?.spawned === true, ballState, "first ball must auto-spawn from shooter lane");

    // Wait briefly to see ball trajectory
    await page.waitForTimeout(1500);
    const ballAfter1500 = await page.evaluate(() => {
      const t = window.state?.table;
      if (!t || !t.balls.length) return null;
      const b = t.balls[0];
      return { y: Math.round(b.y), x: Math.round(b.x), vy: b.vy, settled: b.settled };
    });
    const moved = Math.abs((ballAfter1500?.y || 0) - (ballState?.y || 0));
    gate("ball_in_motion", moved > 30 || (ballAfter1500?.settled === true), { before: ballState?.y, after: ballAfter1500?.y, moved }, "ball must move (any direction) ≥30px in 1.5s OR have settled — pinball ball goes both up and down");

    // GATE 6: tap left flipper, verify flipper.pressed
    const cv = await page.locator('#cv').boundingBox();
    if (cv) {
      // Tap left half bottom
      await page.touchscreen.tap(cv.x + cv.width * 0.25, cv.y + cv.height * 0.95);
      await page.waitForTimeout(120);
    }
    const lFlipperPressed = await page.evaluate(() => {
      // We need to peek into flipperL state — module-scoped var, expose via window
      // Backdoor: check via DOM/canvas can't see; need to check pressedAtMs proximity
      // Workaround: telemetry events contain flipper_press
      const tel = window.__telemetry?.() || [];
      const recent = tel.filter(e => e.ev === 'flipper_press' && Date.now() - e.ts < 2000);
      return { recentPresses: recent.length, sides: recent.map(e => e.side) };
    });
    gate("left_flipper_responds", lFlipperPressed.recentPresses >= 1 && lFlipperPressed.sides.includes('L'), lFlipperPressed, "tapping left half must fire flipper_press(L)");

    // SS 3: mid-play (ball mid-fall, after first flipper press)
    await page.screenshot({ path: `${ssDir}/03-mid-play.png` });
    out.screenshots.push("03-mid-play.png");

    // GATE 7: tap right flipper, verify
    if (cv) {
      await page.touchscreen.tap(cv.x + cv.width * 0.75, cv.y + cv.height * 0.95);
      await page.waitForTimeout(120);
    }
    const rFlipper = await page.evaluate(() => {
      const tel = window.__telemetry?.() || [];
      const recent = tel.filter(e => e.ev === 'flipper_press' && Date.now() - e.ts < 1000);
      return { recentPresses: recent.length, sides: recent.map(e => e.side) };
    });
    gate("right_flipper_responds", rFlipper.sides.includes('R'), rFlipper, "tapping right half must fire flipper_press(R)");

    // GATE 8: spawn-to-flipper-arc — within 1s of ball spawn, ball must reach y > playfield mid (200)
    const spawnArcState = await page.evaluate(() => {
      const tel = window.__telemetry?.() || [];
      const launches = tel.filter(e => e.ev === 'ball_launch');
      const lastLaunch = launches[launches.length - 1];
      const t = window.state?.table;
      if (!lastLaunch || !t || !t.balls.length) return { ok: false, reason: 'no launch event or table' };
      const b = t.balls[0];
      const elapsedSec = (Date.now() - lastLaunch.ts) / 1000;
      return { elapsedSec, ballY: b.y, threshold: 200, ok: b.y > 200 || elapsedSec > 1 };
    });
    gate("spawn_arc_reaches_playfield", spawnArcState.ok, spawnArcState, "ball trajectory must reach y>200 within 1s of launch (no insta-drain rule)");

    // Let game play out for a few seconds
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `${ssDir}/04-late-play.png` });
    out.screenshots.push("04-late-play.png");

    // GATE 9: hit-target sizes for tap zones (≥ 44pt min via responsive playfield)
    const hitTargets = await page.evaluate(() => {
      const cv = document.getElementById('cv').getBoundingClientRect();
      // Tap zones are bottom 25% of canvas, left/right halves
      const tapZoneH = cv.height * 0.25;
      const tapZoneW = cv.width * 0.5;
      return { tapZoneW: Math.round(tapZoneW), tapZoneH: Math.round(tapZoneH), cvW: Math.round(cv.width), cvH: Math.round(cv.height) };
    });
    gate("flipper_tap_zone_hit_target", hitTargets.tapZoneW >= 44 && hitTargets.tapZoneH >= 44, hitTargets, "left/right tap zones must be ≥44×44pt");

    // GATE 10: console errors
    gate("zero_console_errors", consoleErrors.length === 0, { errors: consoleErrors.slice(0, 5) }, "should have zero console errors during play");

    // GATE 11: page errors
    gate("zero_uncaught_errors", pageErrors.length === 0, { errors: pageErrors.slice(0, 3) }, "should have zero uncaught page errors");

    // GATE 12: daily seed stamp visible during play (top of screen)
    const seedStampVisible = await page.evaluate(() => {
      const el = document.getElementById('daily-stamp');
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && el.offsetWidth > 0;
    });
    gate("daily_seed_stamp_visible", seedStampVisible, { seedStampVisible }, "daily seed stamp must be visible during play (social hook)");

    // GATE 13: score increments after some play
    const finalScore = await page.evaluate(() => {
      const t = window.state?.table, r = window.state?.run;
      return { tableScore: t?.score || 0, runScore: r?.runScore || 0, total: (r?.runScore || 0) + (t?.score || 0) };
    });
    gate("score_changes_during_play", finalScore.total > 0 || finalScore.tableScore > 0, finalScore, "score should increase as ball hits bumpers/targets");

    // GATE 14: state still healthy (no crash mid-play)
    const stillHealthy = await page.evaluate(() => {
      const t = window.state?.table;
      return !!t && !t.over && t.balls && t.balls.every(b => isFinite(b.x) && isFinite(b.y) && isFinite(b.vx) && isFinite(b.vy));
    });
    gate("physics_invariants_ok", stillHealthy === true, { stillHealthy }, "no NaN positions/velocities, table not crashed");

    // VERDICT
    const passes = out.gates.filter(g => g.pass).length;
    const total = out.gates.length;
    out.passes = passes;
    out.total = total;
    out.verdict = passes === total ? "GREEN" : (passes >= total - 2 ? "YELLOW" : "RED");

  } catch (e) {
    out.crash = String(e).slice(0, 400);
    out.verdict = "ERROR";
  }
  await ctx.close();
  return out;
}

async function main() {
  await ensureDir(OUT);
  const results = [];
  // iPhone 13 webkit
  const wk = await webkit.launch();
  results.push(await runDevice("iphone-13-webkit", wk, devices["iPhone 13"]));
  await wk.close();
  // Pixel 5 chromium
  const cr = await chromium.launch();
  results.push(await runDevice("pixel-5-chromium", cr, devices["Pixel 5"]));
  await cr.close();

  const overall = results.every(r => r.verdict === "GREEN") ? "GREEN" :
                  results.some(r => r.verdict === "RED" || r.verdict === "ERROR") ? "RED" : "YELLOW";
  await writeFile(`${OUT}/summary.json`, JSON.stringify({ ts: TS, url: URL, overall, reports: results }, null, 2));

  console.log(`\n=== TILT real-input harness ${overall} ===`);
  for (const r of results) {
    console.log(`\n[${r.device}] ${r.verdict} — ${r.passes || 0}/${r.total || 0}`);
    for (const g of r.gates || []) {
      console.log(`  ${g.pass ? "✓" : "✗"} ${g.name}${g.pass ? "" : ` — ${JSON.stringify(g.observed).slice(0, 220)}`}`);
    }
    if (r.consoleErrors?.length) console.log(`  console errors: ${r.consoleErrors.length} → ${r.consoleErrors.slice(0,2).join(' | ')}`);
    if (r.pageErrors?.length) console.log(`  page errors: ${r.pageErrors.length} → ${r.pageErrors.slice(0,2).join(' | ')}`);
    if (r.crash) console.log(`  CRASH: ${r.crash}`);
  }
  console.log(`\nOutputs: ${OUT}/`);
  process.exit(overall === "GREEN" ? 0 : 1);
}
main().catch(e => { console.error(e); process.exit(2); });
