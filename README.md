# TILT

Mobile-vertical pinball. Daily-seed shared tables + roguelite mutators per run.

## Quickstart
```bash
npm install
npm run dev      # serve www/ at http://localhost:3000
```

## What
Tap left/right side to flip flippers → keep ball alive → hit bumpers/targets → chain combos → trigger modes (multiball, hurry-up). After each table, pick 1 of 3 mutators that applies to all subsequent tables in the run. Today's seed is the same for everyone; share your score.

## Why
See [STRATEGY.md](./STRATEGY.md). Built per `/game-build` orchestrator (Phase -1..16). Solo Tier (9 active roles).

## Stack
- Vanilla JS + Canvas 2D + WebAudio (no framework)
- Custom 2D physics
- Daily seed deterministic (UTC date)
- Local-only v1.0; serverless leaderboard v1.1 if D7 ≥15%
- Vercel/GitHub Pages, $0
- See [ARCHITECTURE.md](./ARCHITECTURE.md)

## Test
```bash
npm test
npm run harness
npm run ship-gate
```

## Stop criteria
D7 retention <8% by week 4 → archive. STRATEGY §9.
