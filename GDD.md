# GDD — TILT

> Phase 2. Owners: [#G1] + [#G2]. 2026-05-02.

## Core loop (60-90s per table)

```
[TABLE START — daily seed determines layout + lit targets]
   ↓
[BALL spawns at shooter lane (top-right), auto-launches with arc that intersects flipper sweep ≤1s]
   ↓
[Player taps L flipper / R flipper / both — physics deflects ball]
   ↓
[Ball hits bumpers/targets/ramps]
    ├─ Same-color sequence → chain ↑
    ├─ Lit target → score + light next target
    ├─ All targets lit → mode trigger (multiball / hurry-up)
    └─ Drain (between flippers) → ball lost
   ↓
[Ball drained OR table_score reaches threshold → TABLE END]
   ↓
[After table 1: MUTATOR PICK — choose 1 of 3 random mutators that apply to NEXT table]
   ↓
[Repeat for tables 2-5; each carries previous mutators + adds new one]
   ↓
[RUN END after table 5 OR after total_drains ≥3]
   ↓
[Run summary: total_score, max_chain, mutators_collected, daily_PB delta]
   ↓
[Player choice: NEW RUN (same daily seed re-rolls fresh layout) or VIEW DAILY SCOREBOARD]
```

**Loop duration**: 90s/table × 3-5 tables = 4-8 min/run. Decision-every-30s satisfied (each flipper-press is a decision; mutator pick is a meta-decision every table).

## Daily seed mechanics

- Seed = `parseInt(UTC_YYYYMMDD)` (e.g. 20260502)
- Seed determines: bumper positions (5-7 bumpers), target positions (3-5 targets), lit-pattern (which targets start lit), starting mutator-of-day (visible from table 1)
- Mutator-of-day examples: "FROZEN FLIPPERS" (slow flipper return), "REVERSE GRAVITY" (ball decelerates downward), "HURRY UP" (60s timer), "SHRUNK PADDLE" (smaller flippers)
- Seed re-rolls at 00:00 UTC; v1.0 stores last seen seed locally, prompts "today's seed is fresh" toast

## Mutator system (10 baseline pool, 5 in v1.0)

After each table, player picks 1 of 3 random mutators. Picked mutator applies to ALL subsequent tables in that run.

v1.0 baseline (5):
1. **FROZEN FLIPPERS** — flipper return time 2x slower (more skill window)
2. **MULTIBALL** — next table starts with 2 balls
3. **HURRY UP** — 60s table timer (instead of unlimited)
4. **DOUBLE BUMPERS** — 2x bumper count, more ricochet potential
5. **EXTRA TARGET** — add 1 lit target worth 5x score

v1.1+ pool (5 more):
6. **GRAVITY WELL** — center of playfield pulls ball
7. **CHAIN LOCK** — chain doesn't break on non-target hit
8. **MIRROR FLIPPERS** — left tap = right flipper, right tap = left
9. **MAGNETIC BALL** — ball curves toward nearest target
10. **GLASS SHOCK** — every 10s, screen flashes + bumpers redirect

Mutator stacking: visual indicator at top showing all active mutators with icons. Player sees their build evolving.

## Ball-saver / first-spawn (mandatory per FAILURE_MODE_LEDGER)

- First ball of every TABLE auto-launches from shooter lane (not awaiting tap)
- Auto-launch trajectory: angle 65° from horizontal, velocity vector pre-computed to intersect ANY flipper sweep arc within 1 physics second
- Ball-saver active for first 7 seconds — drained ball auto-respawns at shooter lane; ball-saver indicator visible (lit "SAVED" text in HUD)
- After table-1, balls 2 and 3 are also auto-launched but ball-saver only first ball

## Schell top-20 lenses (quick-pass)

1. **Essential Experience**: physics satisfaction + flipper-skill + chain dopamine + daily competition. ✓
2. **Surprise**: mutator pick reveals; daily seed reveals; ball ricochet emergence. ✓
3. **Fun**: tap, react, score. Pure tactile. ✓
4. **Curiosity**: "what's today's seed? what mutators will I draw?" ✓
5. **Endogenous Value**: score + daily PB + mutator collection. ✓
6. **Problem Solving**: optimal flipper timing + mutator pick strategy. ✓
7. **Elegance**: 2 input controls (L flipper, R flipper), N emergent outcomes. ✓
8. **Character**: bumpers/targets are visual characters via color personality. ✓ (light)
9. **Indirect Control**: input → flipper kick → physics emergent. Felt-agency without total-determinism. ✓
10. **Atmosphere**: synthwave + 8-bit fusion, neon glow, CRT scanlines. ✓
11. **Visible Progress**: chain counter live, score popup, mutator-stack growing. ✓
12. **Reward**: variable (combo + mutator pool) + fixed (daily streak). ✓
13. **Punishment**: drain = ball lost. NOT punishing — instant restart, no progress lost. ✓
14. **Simplicity/Complexity**: simple input, complex emergent. ✓
15. **Imagination**: minimal narrative — pure mechanic.
16. **Control**: 2-tap, no aim. Cannot be simpler. ✓
17. **Goals**: table score → run score → daily PB → all-time PB → cosmetic unlock (v1.1). ✓
18. **Failure**: drain visible, instant retry. ✓
19. **Skill vs Chance**: ~60% skill (flipper timing) + ~40% emergent physics. ✓
20. **Toy**: even without scoring, watching ball bounce = satisfying. ✓

## MDA cross-check
- **Mechanics**: flipper press, ball physics, bumper hit, target lit, chain detection, mode trigger, mutator application
- **Dynamics**: chain-chasing, mode-extending, mutator-stacking, daily-seed-comparing
- **Aesthetics**: sensation (juice), challenge (skill), discovery (mutators), competition (leaderboard), submission (commute escapism)

## Costikyan uncertainty
- ✓ Performative: flipper timing skill
- ✓ Solver: optimal mutator picks for build
- ✓ Player unpredictability: own intuition mistakes
- ✗ Randomness: bounded — daily seed deterministic; mutator pool seeded but pick is player choice
- ✗ Hidden information: none

## Hooked loop
- **Trigger**: external — push notification ("today's seed is fresh") OR home-screen-icon urge
- **Action**: open app → see today's seed stamp → tap to start (single low-effort)
- **Variable Reward**: chain length unpredictable; mutator pool draw unpredictable
- **Investment**: daily streak + mutator collection + daily PB

## Octalysis (4+ drives)
- **Driver 4 — Ownership**: PB + mutator collection + daily streak
- **Driver 6 — Scarcity**: today's seed = limited window (until midnight UTC); 1 mutator per table only
- **Driver 7 — Curiosity**: what's today's mutator-of-day? what mutators will I draw?
- **Driver 5 — Avoidance/Loss**: streak resets if you miss a day; near-miss chain breaks
- **Driver 2 — Accomplishment**: daily-seed personal best; mutator collection completeness

## Variable reward schedule
- Ratio: chain 3-9 common (~70%), 10-25 occasional (~22%), 25-50 rare (~7%), 50+ extremely rare (~1%)
- Magnitude: combo `1.5^chain` capped 50x; mode-stack 2x-4x compound

## Long-arc goal
- Local: beat daily PB → beat all-time PB → complete mutator collection (10 in v1.0+v1.1)
- Social: beat friend's daily score (via screenshot share or v1.1 leaderboard)
- Mastery: unlock all 10 mutators

## Sid Meier 30s test
Each flipper-press = decision. Each bumper hit = decision (was timing right?). Each mutator pick = meta-decision. >>> Sid Meier minimum.

## DoD (Phase 2 gate)
- [x] All 20 lenses applied
- [x] ≥4 Octalysis drives mapped
- [x] Uncertainty preserved
- [x] Sid Meier 30s rule satisfied
- [x] Ball-saver-on-spawn spec'd
- [x] Spawn-to-flipper-arc rule spec'd (≤1 physics second)
- [x] Daily-seed deterministic
- [x] Mutator pool spec'd v1.0 + v1.1
