# CONCEPT — TILT

> Phase 0. Auto-derived from STRATEGY.md. 2026-05-02.

## 1-line niche thesis
90-second mobile-vertical pinball with daily-seed shared table + roguelite mutators per run. Pinball silhouette = self-evident tutorial. Group-chat trash-talk = primary distribution channel.

## Genre + sub-genre
- **Primary**: Physics arcade (pinball-class)
- **Sub-genre**: Mobile-vertical pinball with roguelite per-run mutation
- **Session length**: 90s per table × 3-5 tables per run = 5-8 min per session

## Theme (cultural + visual angle)
- **Cultural**: Synthwave + arcade-cabinet nostalgia + modern minimalist mobile UI
- **Visual angle**: 8-bit pixel base sprites (ball, bumpers, flippers) + modern soft particle bloom on hits + CRT scanline overlay (≤8% opacity) + neon HDR palette (magenta/cyan/yellow). Dark playfield, glowing physics objects, screen-warp on big chains. Vertical 9:16 layout, one-handed playable.
- **Anti-pattern**: NOT skeuomorphic faux-cabinet. NOT pixel-only retro. NOT cartoon-mascot themed. The theme is the FUSION — synthwave neon laid on 8-bit pixels.

## Target audience (1 line)
Mobile arcade regulars (3+ short sessions/day), pinball-genre-recognizers, anti-tutorial, screenshot-share active in group chats and small communities.

## USP
**Daily seed everyone shares + per-run roguelite mutators on real flipper physics, on mobile-vertical.** No accounts, no IAP-walls, no ads. Pinball silhouette IS the tutorial.

## Monetization (locked v1.0)
- Free, no ads, no IAP, no accounts
- v1.1+ (gated D7 ≥15%): cosmetic packs (flipper styles, bumper themes, ball trails) — one-time purchase, no currency abstraction

## Stop criteria (mirrors STRATEGY §9)
- Hard kill: D7 < 8% by week 4 → archive
- Pivot trigger: 2 consecutive weeks <50 organic installs/wk + harsh feedback on hype-angle OR mutators → pivot ONE element
- "We won": 1000+ organic installs OR D7 ≥25% by week 6 → ramp paid acquisition

## Stack constraint
- Mobile-vertical web/PWA (v1.0); Capacitor APK in v1.2 if D7 hits target
- Vanilla JS + Canvas 2D + WebAudio
- Vercel free tier, $0
- Custom 2D physics (circle-circle, circle-AABB, segment) — no Matter.js dep
- Local-only daily seed in v1.0 (deterministic per UTC date); serverless leaderboard v1.1 if D7 ≥15%

## Hard avoid (from memory + ledger)
- ❌ Brand-name borrow (no Williams/Stern/FX/Wizard/etc)
- ❌ Tutorial overlay text-stacking when player confused → instead fix the visual layer (anti-pattern from DROP failure)
- ❌ "test on device + report bugs" closure (per feedback_no_user_testing.md)
- ❌ YELLOW QA verdict shipped (Quality-Bar Lead [#50])
- ❌ Re-mentioning killed approaches (cyber-pinball is dead; do not reference in retros)
- ❌ Predatory mechanics (energy gates, mid-task ads, real-money loot boxes, accounts)
