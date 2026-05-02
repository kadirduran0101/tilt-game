# ARCHITECTURE — TILT

> Phase 6 prereq. Owner: [#2]. 2026-05-02.

## Stack pick

| Layer | Choice | Why |
|---|---|---|
| Runtime | Browser (vanilla JS, ES2022) | Zero install, instant load, $0 hosting |
| Render | HTML Canvas 2D | Full juice control; <100KB bundle |
| Physics | Hand-rolled 2D — circle-circle, circle-AABB, segment | Matter.js 100KB+ overkill for ~5-15 simultaneous bodies; custom = ~10KB; deterministic for daily-seed replay |
| Audio | WebAudio API | All synthesized; zero asset weight |
| Persistence | localStorage | PB, streak, mutator collection, settings |
| Telemetry | IndexedDB ringbuffer (last 200 events) | Local-only v1; no PII; no network |
| Build | Single HTML file | No bundler step v1.0; rollup v1.1 for size optimization |
| Deploy | Vercel free tier (or GitHub Pages) | Static, $0, instant CDN |
| Mobile wrapper | Capacitor (v1.2 if D7 ≥15%) | Re-uses web build for stores |

## File structure

```
pinball-v1/
├── www/
│   ├── index.html             # Single-file game v1.0
│   ├── privacy.html
│   └── terms.html
├── src/                        # (v1.1+ when bundler added)
│   └── ...
├── automation/scripts/
│   ├── real-game-test.mjs     # Real-input harness (NO .click() shortcuts)
│   ├── role-driven-qa.mjs     # 7-role harness
│   └── visual-ux-testing.mjs
├── tests/                      # Unit (vitest or node test runner)
├── package.json
├── .gitignore
├── README.md
├── CLAUDE.md
├── LICENSE
├── vercel.json
├── STRATEGY.md ✓
├── RoleActivation.json ✓
├── CONCEPT.md ✓
├── TELEMETRY_SCHEMA.md ✓
├── ACCEPTANCE_CRITERIA.md ✓
├── BENCHMARK.md ✓
├── GDD.md ✓
├── STYLE_GUIDE.md ✓
├── ASSET_MATRIX.md ✓
├── ANIMATIONS.md ✓
├── AUDIO_LIST.md ✓
├── ARCHITECTURE.md (this) ✓
└── ADRs/
    ├── 0001-vanilla-js.md
    ├── 0002-canvas-2d.md
    ├── 0003-custom-physics.md
    ├── 0004-vercel-static.md
    └── 0005-daily-seed-deterministic.md
```

## Game-loop architecture

```
init()
  → load persist
  → audio-unlock-on-first-gesture
  → compute today's daily-seed (UTC date)
  → reveal seed stamp + mutator-of-day

RAF loop:
  1. accumulator += dt
  2. while accumulator >= 16.67ms:
       tick(16.67ms)         // fixed-timestep physics
       accumulator -= 16.67
  3. render(alpha)            // interpolated render
  4. requestAnimationFrame(loop)

tick(dt):
  for each ball:
    update vel + pos (gravity, drag, mutator-modified gravity)
    check flipper collisions → emit flipper-kick events
    check bumper/target collisions → emit hit events
    check drain → if ball-saver active, respawn; else lose ball
    apply mutator effects (gravity well, magnetic, etc)
  update particles, decay
  detect chain ends → emit chain_complete
  detect mode triggers → emit mode_enter
  detect hype thresholds → emit hype_*

render(alpha):
  clear canvas
  draw playfield bg + grid (mutator-tinted if active)
  draw shooter lane lit channel
  draw bumpers, targets (lit-state pulse)
  draw flippers (rotated per state)
  draw balls (with bloom)
  draw particles
  draw trail segments (if ball velocity ≥400)
  apply post-fx (scanlines always, chromatic aberration on hype)
  draw HUD (score, daily-stamp, mutator-stack, ball-count, ball-saver)
```

## Daily seed implementation

```js
function getDailySeed(date = new Date()) {
  const y = date.getUTCFullYear(), m = date.getUTCMonth() + 1, d = date.getUTCDate();
  return y * 10000 + m * 100 + d; // e.g. 20260502
}
function generateTable(seed, run_index) {
  // run_index 1-5 within a run; same seed but slightly different layout per run-table
  const rng = mulberry32(seed * 1000 + run_index);
  return {
    bumpers: placeBumpers(rng, count: 5 + Math.floor(rng() * 3)),
    targets: placeTargets(rng, count: 3 + Math.floor(rng() * 3)),
    initialLitPattern: pickLitPattern(rng)
  };
}
function getMutatorOfDay(seed) {
  const rng = mulberry32(seed);
  const pool = ['frozen', 'multiball', 'hurry-up', 'double-bumpers', 'extra-target'];
  return pool[Math.floor(rng() * pool.length)];
}
function getMutatorPickOptions(seed, run_index, taken) {
  const rng = mulberry32(seed + run_index * 7);
  const pool = ['frozen', 'multiball', 'hurry-up', 'double-bumpers', 'extra-target']
    .filter(m => !taken.includes(m));
  // shuffle, take 3
  return shuffle(pool, rng).slice(0, 3);
}
```

## Mutator system

```js
const MUTATORS = {
  'frozen': { name: 'FROZEN FLIPPERS', icon: 'snowflake', apply: (state) => { state.flipperReturnMs = 400; } },
  'multiball': { name: 'MULTIBALL', icon: 'two-balls', apply: (state) => { state.startBalls = 2; } },
  'hurry-up': { name: 'HURRY UP', icon: 'clock', apply: (state) => { state.tableTimerMs = 60000; } },
  'double-bumpers': { name: 'DOUBLE BUMPERS', icon: 'two-bumpers', apply: (state) => { state.bumperMultiplier = 2; } },
  'extra-target': { name: 'EXTRA TARGET', icon: 'target-plus', apply: (state) => { state.extraTargetWorth = 5; } }
};
```

## Ball physics (custom)

- **Integrator**: semi-implicit Euler at fixed 60Hz
- **Gravity**: 0.45 px/tick² downward (mutator-modified)
- **Drag**: 0.998 multiplier per tick on velocity
- **Wall collision**: AABB with energy loss 0.7 on bounce
- **Bumper collision**: circle-circle. Reflect velocity along normal, 0.78 retention. Bumper imparts +120 px/s if nuts (mutator: double = 2x)
- **Flipper collision**: segment vs circle. Compute relative velocity at contact point including flipper rotation; impart kick force based on flipper angular velocity at contact (pinball-correct)
- **Target collision**: AABB. Inelastic (ball stops, target lit, ball reflects backward 0.5)
- **Drain detection**: ball.y > drain_y AND between flippers → ball lost; if ball-saver active in first 7s, auto-respawn at shooter lane
- **Mutator-affected**:
  - "frozen" → flipperReturnMs 400 (default 200)
  - "gravity well" (v1.1) → +radial pull toward center
  - "magnetic" (v1.1) → ball curves toward nearest lit target

## Save versioning

```js
const SAVE_VERSION = 1;
function save(state) { localStorage.setItem('tilt:save', JSON.stringify({ v: SAVE_VERSION, ts: Date.now(), data: state })); }
function load() {
  try {
    const raw = localStorage.getItem('tilt:save'); if (!raw) return defaults();
    const blob = JSON.parse(raw);
    if (blob.v !== SAVE_VERSION) return migrate(blob);
    return blob.data;
  } catch { return defaults(); }
}
function defaults() { return { pb: 0, alltime_pb: 0, streak: 0, last_seed_played: 0, mutators_unlocked: [], plays: 0, mute: false }; }
```

## Crash reporter
```js
window.onerror = (msg, src, line, col, err) => {
  emit('js_error', { msg: String(msg).slice(0, 120), stack: (err?.stack || '').split('\n').slice(0, 5).join('\n') });
};
window.addEventListener('unhandledrejection', (e) => {
  emit('js_error', { msg: 'unhandled: ' + String(e.reason).slice(0, 120) });
});
```

## ADRs (one-liner stubs)
- **ADR-0001**: Vanilla JS, no framework. Reason: bundle size critical (≤300KB gzip), instant load. Trade-off: no reactive UI.
- **ADR-0002**: Canvas 2D, not WebGL. Reason: 60fps OK for ~10 bodies + particles; WebGL adds shader complexity without visual gain at this scale.
- **ADR-0003**: Custom 2D physics, not Matter.js. Reason: 100KB+ overkill; need only circle-circle + circle-AABB + segment; custom = 10KB; deterministic-seedable for daily-seed replay.
- **ADR-0004**: Vercel/GitHub Pages static deploy. Reason: $0, instant CDN, zero ops.
- **ADR-0005**: Daily seed deterministic from UTC date. Reason: same global table per day = social hook (group-chat trash-talk); midnight-UTC reset = fresh daily content driver.

## Stop-criteria reachability
D7 retention (STRATEGY §9 hard kill) measurable via `app_open` event sid persistence in IndexedDB. Daily seed-engagement KPI measurable via `daily_seed_revealed` event count per UTC date. Both instrumented per TELEMETRY_SCHEMA.

## Privacy + License
- ✓ NO PII in any event (TELEMETRY_SCHEMA enforced)
- ✓ NO AI gen for v1 (avoids 2026-05-02 FLUX-dev license issue)
- ✓ All deps MIT-compatible
- ✓ "Press Start 2P" font OFL 1.1 — commercial OK
- ✓ Audio synthesized at runtime — no sample license

## DoD (Phase 6 prereq gate)
- [x] Stack pick + rationale per layer
- [x] File structure
- [x] Game loop (fixed-timestep + interpolated render)
- [x] Daily-seed deterministic implementation
- [x] Mutator system spec'd
- [x] Ball physics spec'd (custom)
- [x] Save versioning envelope
- [x] Crash reporter wired
- [x] 5 ADRs stubbed
- [x] Stop-criteria instrumentation reachable
- [x] Privacy + License gates verified
