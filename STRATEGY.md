---
type: game
monetization: F2P-cosmetic
scale: solo
generated: 2026-05-02
strategist_version: v1.0
---

# STRATEGY — TILT

> Generated: 2026-05-02 · Type: game · Strategist v1.0

## 1. Why-download thesis (1 sentence)

A 90-second mobile-vertical pinball where every day's table is procedurally mutated and shared by everyone playing today, so beating your friend's score becomes the texted-screenshot moment.

## 2. Target audience (psychographic, not demographic)

- **Who**: People who already play 3+ short mobile arcade sessions per day (commute/break), grew up with arcade physics games, and recognize the pinball silhouette instantly. Age range secondary; behavior-driven: anti-tutorial, anti-account, pro-leaderboard, frequent screenshot-sharers in group chats.
- **Pain they're scratching**: Faithful pinball table simulators are heavy (200MB+), landscape-only, and require 5-min setup per session — wrong fit for one-handed mobile. Casual "mobile pinball" titles strip the soul (no real flipper-skill), use cookie-cutter themes, and have no replayability beyond table N+1.
- **Their existing alternatives**: (a) "faithful digital pinball table simulators" (premium feel, mobile-hostile), (b) "casual mobile pinball clones" (skinned, shallow), (c) "roguelite mobile arcade games" (deep loop but rarely physics-driven).
- **Why our thing wins for THEM specifically**: Pure pinball-skill core (flippers, ball, targets — instant 5-sec read) + roguelite per-run table mutation (3-5 short tables per session, each different) + a SHARED daily seed everyone in the world is playing today (group-chat trash-talk distribution). Vertical-mobile native; one-handed playable; zero account.

## 3. Hype angle — the screenshottable / shareable moment

- **Visual**: A 4-second clip of a 50x combo on TODAY'S DAILY SEED TABLE — the signature top-of-screen "DAILY: 2026-05-02" stamp + the mutator-of-the-day glowing in corner (e.g., "FROZEN FLIPPERS" or "REVERSE GRAVITY") + the player's score climbing past their friend's pinned PB. Screen warps, neon overlay flashes, ball does an absurd 8-bumper-chain ricochet.
- **Verbal**: "lan bugünkü daily'i geç, yapamazsın" / "you're not beating today's seed, ever"
- **Mechanic**: Within first 30 seconds, the player sees the day-stamp + the mutator name + the running leaderboard ticker — they understand they're in a global shared-day competition, not a solo grind. That awareness is the dopamine.

## 4. Differentiation — vs 3 generic competitor categories

- **Category 1 — "faithful digital pinball table simulators"**: They nail physics + table fidelity. Weak: heavy install, landscape-only, sluggish on weak phones, no daily-loop hook. **Our edge**: ≤300KB initial bundle, mobile-vertical-native, 90-second runs, daily seed everyone shares. Falsifiable: bundle size <300KB gzip + portrait-only build + first-table-loaded ≤2s on 4G throttled.
- **Category 2 — "casual mobile pinball clones"**: They have low friction onboarding. Weak: skinned templates, no skill ceiling, predictable tables, ad-spam. **Our edge**: real flipper physics with frame-perfect timing (16.6ms input-to-feedback target) + procedural table mutation each run + zero ads/IAP-walls. Falsifiable: frame-perfect input verified by harness; ≥40% of sessions reach run-3+ (mutator stacking).
- **Category 3 — "roguelite mobile arcades (non-pinball)"**: They have the deep meta loop. Weak: novel mechanics need tutorial; not visually obvious. **Our edge**: pinball is universally legible — the silhouette IS the tutorial. Plus daily-seed shared leaderboard, which roguelite arcades almost never have. Falsifiable: 5-second test passes WITHOUT tutorial overlay (player drops first ball <5s from cold-load, verified by harness time-to-first-input).

## 5. First-impression budget — the 5-second test

- **Second 0-1**: Logo "TILT" dissolves into a vertical playfield. Player already sees: 2 flippers at the bottom, 1 ball mid-fall, 8 colored bumpers, target zones lit. The visual silhouette IS the tutorial. No words needed.
- **Second 1-3**: Demo ball auto-launched mid-fall hits the first bumper, screen flashes neon, particle burst. Bumper number ticks up. The combo counter at top-left animates "+250 → +500 → +1200". Player understands: hit things = score.
- **Second 3-5**: Demo ball nears the bottom. The two flippers wiggle once (auto-demo flick), showing they're tappable. Player taps either flipper. Ball gets flipped back up. They are now playing. No text shown. Score visible. Daily seed stamp visible top.

If by 5s no successful flipper-tap, the funnel leaks. NO tutorial overlay; if needed, fix the auto-demo wiggle to be more obvious. If THAT doesn't work, the visual layout itself failed — re-do, do not patch with text.

## 6. Trojan-horse hook — what gets them past minute 1

- **Surface promise**: "play a quick pinball round."
- **Hidden hook**: (a) Variable reward — every 60-90s table is procedurally mutated by today's seed + 1 rotating mutator (frozen flippers / reverse gravity / multi-ball / shrunk paddle / hurry-up timer / etc); chain length unpredictable per ball trajectory. (b) Collection completion — meta-XP unlocks new mutator types, new bumper-skin variants, new flipper aesthetics (cosmetic only). (c) Social comparison — daily seed leaderboard shows top 100 globally + your friends (if linked), refreshed at midnight UTC. (d) Streak anxiety — playing every day extends a streak counter; missing a day resets it (no progress loss, just streak).
- **Reveal moment**: Around minute 4-6, the player has played 3-4 mutated tables and seen 2 different mutators applied to a familiar physics base. The "wait, every run is different" recognition kicks in. Combined with the ticker showing "your friend played today's seed: 22,800 pts" — the loop becomes: open tomorrow → see new seed → play → compare.

NO predatory mechanics. NO energy gates. NO mid-task ads. Daily seed and streak are NOT punitive — they're conversational hooks, not loss-aversion gates.

## 7. Velocity check — ship-in-N-weeks reality

- **Target time-to-launch**: 4 weeks
- **Solo dev hours/week**: 30-40 (per recent cadence)
- **Scope risk score**: MEDIUM. Pinball physics > plinko (multiple bumper shapes, flipper kick force, ball-saver, hurry-up); table-mutation system is novel work; daily-seed leaderboard requires either local-only-fake (week 1 ship) or tiny serverless backend (week 2-3 ship).
- **Cuts to bless the timeline**:
  - v1.0: local-only daily seed (deterministic per UTC date), local PB tracking, NO server leaderboard. Friend-comparison via screenshot share only.
  - v1.1: serverless leaderboard (Vercel function + KV or similar) — only if D7 ≥15%.
  - v1.0 mutators: 5 baseline (frozen flippers, reverse gravity, multi-ball, shrunk paddle, hurry-up). v1.1+: 10 additional unlock pool.
  - v1.0: 1 base table layout that the seed mutates. v1.2+: 3 base layouts.
- **Strategist refuses** the high-scope+high-risk version. The cuts above lock LOW-risk MEDIUM-scope.

## 8. Monetization plan — pick ONE primary model

- [x] **Free + optional cosmetics** (no gameplay paywall, no ads, no accounts).
- v1.0: ZERO monetization. Free, no ads, no IAP, no accounts. Built to validate hook + retention.
- v1.1+ (gated by D7 ≥15%): cosmetic packs (flipper styles, bumper-skin themes, ball trail variants, scanline filter variants). One-time purchase, no currency abstraction.
- **Never**: energy gates, mid-task ads, account walls, dark-pattern auto-renew, real-money loot boxes, IAP-skill-shortcut.

## 9. Stop criteria — explicit kill conditions

- **Hard kill**: D7 retention < 8% by week 4 post-launch (week ending 2026-06-06 if launch 2026-05-30) → archive (not pivot — kill).
- **Pivot trigger**: 2 consecutive weeks of <50 organic installs/week + harsh feedback specifically on either (a) "feels like every other pinball" — hype-angle failed, OR (b) "mutators feel random not interesting" — mutator design failed → pivot ONE element (either the daily-seed framing OR the mutator system, not both).
- **"We won"**: 1000+ organic installs OR D7 ≥ 25% by week 6 → ramp launch surface (paid Reddit experiment + niche-streamer outreach).

## 10. Launch surface — where the first 100 users come from

- **Channel 1**: r/Pinball + r/IncrementalGames + r/AndroidGaming + r/iOSGaming subreddits — soft-launch post pattern: 20-second vertical clip showing today's daily-seed mutator + a chain → friend's score in the corner. Link in comments.
- **Channel 2**: TikTok hashtags #pinball #physicsgames #dailychallenge — 10-15s vertical clips, link in bio. Plus the niche pinball-enthusiast Discord servers (publicly listed; respect server rules, soft-share only).
- **Channel 3**: Paid experiment, ≤€40 on Reddit ads targeting r/AndroidGaming subscribers; creative = the daily-seed reveal moment. ROAS not required at this scale; this is message-channel-fit validation.

## STRATEGIST VERDICT

✅ **GREEN** — All 10 sections filled with falsifiable claims. No predatory monetization. Velocity MEDIUM-risk + MEDIUM-scope (4-week solo, with explicit cuts to v1.1+). Hype angle clear and unique vs 3 competitor categories (mobile-vertical + daily seed + roguelite mutators). Stop criteria explicit (D7 <8% by week 4 = kill). Zero brand-name borrowing (cyber-pinball not referenced; no commercial pinball IP touched). Cost: $0 v1.0 (local-only daily seed). Phase -0.5 activation matrix unlocked → /game-build can run.

**Open recommendation to user (not blocking)**: at end of Phase 1 BENCHMARK, decide between (a) ship v1.0 with local-only fake leaderboard (safer 4-week timeline) or (b) ship v1.1 with serverless leaderboard immediately (extends to 6 weeks). Strategist recommends (a) for fastest signal on D7.
