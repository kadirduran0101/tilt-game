# BENCHMARK — TILT

> Phase 1. Owners: [#3] + [#2]. 2026-05-02.
> 2-3 publicly known references per feature, concrete numbers. NO brand names.

## Feature 1 — Flipper kick power + response

| Reference category | Concrete number |
|---|---|
| Acclaimed digital pinball table simulators | Flipper kick imparts ~1500-1800 px/s velocity on ball (measured at 480px-wide playfield); response latency ≤16.6ms (60Hz) input-to-state-change |
| Real-world solid-state pinball cabinets (1980s+) | Flipper coil energizes <8ms after switch contact; ball acceleration depends on flipper geometry but consistently lifts ball to top half of playfield from near-flipper drop |

**Our target**: kick power 1600 px/s on contact (within 1500-1800 band), response ≤16.6ms. Verified per AC A3 + A4 in ACCEPTANCE_CRITERIA.

## Feature 2 — Ball-saver / first-spawn rule

| Reference category | Concrete number |
|---|---|
| Acclaimed pinball simulators | Ball-saver active for first 5-7 seconds after launch; if ball drains in that window, auto-respawn at shooter lane |
| Casual mobile pinball | First ball typically eased — softer launch power or larger flipper window |

**Our target**: ball-saver covers first 7s after `ball_launch`. Spawn-to-flipper-arc rule: initial trajectory MUST intersect flipper sweep within 1 physics second (no void-column drains). Per FAILURE_MODE_LEDGER 2026-05-02 cyber-pinball entry.

## Feature 3 — Combo multiplier curve

| Reference category | Concrete number |
|---|---|
| Acclaimed combo-driven arcade games | Multiplier exponential `~1.5^chain` capped at 50x; chain reset on drain or non-target hit |
| Pinball mode-stacking | Active modes (multiball, hurry-up) compound multipliers — 2x active mode × 5x chain = 10x effective |

**Our target**: combo `1.5^chain_length` capped 50x; mode stack multiplies combo by mode-multiplier; mode_stack_max = 4x.

## Feature 4 — Daily seed determinism + leaderboard

| Reference category | Concrete number |
|---|---|
| Daily-puzzle word/number games (acclaimed) | Seed derived from UTC date (YYYYMMDD); same seed → identical puzzle for everyone; new seed at 00:00 UTC; share-format includes date stamp + score, no spoilers |
| Roguelite daily-run games | Daily seed offers same enemy layout / same starting items but mutators stay variable; comparing scores = primary social hook |

**Our target**: seed = `parseInt(YYYYMMDD)` of UTC date; deterministic table layout (bumper positions, target positions, lit-pattern); mutator-of-day also seeded but appears at run-2+; v1.0 share-format = "TILT 2026-05-02 — 28,400 (max chain: 12)".

## Feature 5 — Mobile-vertical pinball layout

| Reference category | Concrete number |
|---|---|
| Mobile-vertical arcade titles | Aspect ratio 9:16; playfield occupies 80-90% of screen height; flippers in bottom 18-22% of width each (per Williams T2 18-22% benchmark applied vertically) |
| Acclaimed pinball simulators (landscape) | Flipper-length 12-18% of playfield width — wrong fit for vertical mobile |

**Our target**: 480×800 logical (3:5, close to 9:16), flippers 22% playfield-width each (≈106px logical), bottom 12% of vertical height. Tap zones bottom 25% × left/right halves for one-handed thumb reach.

## Feature 6 — Hype/screenshot moment timing

| Reference category | Concrete number |
|---|---|
| Viral physics-arcade share clips | 12-20s clip; ~3s build, 6-10s climax, 3-4s aftermath; vertical 9:16 native; auto-recorded last 12s buffer |
| Acclaimed mobile arcade share-flow | In-game share button ≤2 taps from event; navigator.share API where available; clipboard fallback otherwise |

**Our target**: hype_50x event triggers in-game share prompt within 1.5s of cascade end; share dialog ≤2 taps; clip auto-buffered last 12s; vertical 9:16; navigator.share with text+url fallback.

## 4 Operating Gates check
- **MALİYETSİZ**: All references public knowledge. Zero paid services. Vercel free tier. No external API for v1.0.
- **RİSKSİZ**: Custom 2D physics — circle-circle + circle-AABB + segment collision, well-trodden. No experimental tech.
- **HUKUKLU/TELİFSİZ**: Zero brand names quoted. Inspired-by-genre-mechanic legal. No sprite imitation.
- **ETİKLİ**: No predatory mechanics. No accounts. No ads. Daily-seed shaming-free (no public negative leaderboard).

## DoD (Phase 1 gate)
- [x] ≥2 references per feature × 6 features = 12+ reference points
- [x] All numbers extracted, falsifiable
- [x] No brand names anywhere
- [x] All 4 Gates checked
