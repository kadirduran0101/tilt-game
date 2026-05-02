# ASSET_MATRIX — TILT

> Phase 4. Owner: [#7] + [#G10] + [#10]. 2026-05-02.

| ID | Name | Theme rationale | Source | Logical size | Path | Status |
|---|---|---|---|---|---|---|
| ball | Ball | 8-bit pixel core + neon glow halo | code-drawn | 16×16 | embedded | TODO |
| ball-trail-segment | Ball trail (4 segments) | Velocity-based motion line for chain≥3 | code-drawn | varies | embedded | TODO |
| flipper-L | Left flipper | Magenta neon, 22% playfield-width polygon | code-drawn | varies (rotate) | embedded | TODO |
| flipper-R | Right flipper | Cyan neon, mirror of L | code-drawn | varies (rotate) | embedded | TODO |
| bumper | Standard bumper | 24px circle, 8-bit rim + neon inner | code-drawn | 24×24 | embedded | TODO |
| bumper-hit-flash | Bumper hit-state | 80ms color flash + ring expand | code-drawn anim | 24×24 | embedded | TODO |
| target-unlit | Drop target unlit | 16×24 outline rectangle | code-drawn | 16×24 | embedded | TODO |
| target-lit | Drop target lit | Filled + pulse (sin-wave 1s period) | code-drawn anim | 16×24 | embedded | TODO |
| shooter-lane | Ball spawn track | Top-right 12px-wide lit channel | code-drawn | 12×120 | embedded | TODO |
| daily-stamp | "DAILY YYYY-MM-DD" | Pixel-font chip top-center | DOM/canvas hybrid | 120×16 | embedded | TODO |
| mutator-icon-frozen | Frozen flippers icon | 16px snowflake | code-drawn | 16×16 | embedded | TODO |
| mutator-icon-multiball | Multiball icon | 16px two-circle pair | code-drawn | 16×16 | embedded | TODO |
| mutator-icon-hurryup | Hurry-up icon | 16px clock | code-drawn | 16×16 | embedded | TODO |
| mutator-icon-double | Double bumpers | 16px two-bumper pair | code-drawn | 16×16 | embedded | TODO |
| mutator-icon-extra | Extra target | 16px target + plus | code-drawn | 16×16 | embedded | TODO |
| mutator-pick-card | 3-card pick UI | Each card: icon + name + 1-line | DOM | 110×140 each | embedded | TODO |
| particle | Hit-impact particle | 2×2 pixel, ball-color, 600ms life | code-drawn pool ×80 | 2×2 | embedded | TODO |
| score-popup | Score number rise | "+250 →" in pixel font, alpha-fade | code-drawn | varies | embedded | TODO |
| combo-text | Combo counter | "5x → 25x → 50x" climb, center-top | DOM | varies | embedded | TODO |
| ball-saver-text | "SAVED" indicator | Pixel text appears 7s on table 1 | DOM | 80×16 | embedded | TODO |
| hype-flash | 50x screen flash | Yellow tint full-screen + chromatic aberration | post-fx | viewport | embedded | TODO |
| scanlines | CRT scanline overlay | 1px alternating rows, 8% opacity | post-fx CSS | viewport | embedded | TODO |
| bloom | Neon glow bloom | Gaussian threshold luminance>0.7 | post-fx canvas | viewport | embedded | TODO |
| btn-launch | Manual launch ball (rare) | Bottom-center, 44pt | DOM | 64×64 | embedded | TODO |
| btn-restart | Restart run | Round summary, 44pt | DOM | 160×44 | embedded | TODO |
| btn-share | Share daily-seed score | Appears post-hype + on run-end | DOM | 64×64 | embedded | TODO |
| btn-mute | Mute toggle | Top-right 32×32 | DOM | 32×32 | embedded | TODO |
| splash-frame | Splash screen | Logo + tagline + "tap to start" | DOM | viewport | embedded | TODO |
| run-summary | Post-run modal | Total score + max chain + mutators + share btn | DOM | viewport | embedded | TODO |

## Theme audit (Phase 9 verify)
- [ ] From playfield alone (no UI), is genre guessable in 3s? (flippers + ball + bumpers visible = pinball clear)
- [ ] No meaningless decorative shapes
- [ ] FG/BG hierarchy: ball + flippers most prominent, scanlines subtle
- [ ] 5 mutator icons distinguishable by shape (color secondary)
- [ ] Daily-seed stamp readable from arm's length

## Source attribution (LICENSE_TRAIL)
- All sprites: code-drawn programmatically (no external assets)
- Font: "Press Start 2P" — Google Fonts (OFL 1.1, commercial OK)
- Audio: WebAudio synth at runtime, zero samples
- NO AI generation for v1.0 (prevents 2026-05-02 FLUX-dev license issue)

## DoD (Phase 4 gate)
- [x] All interactables enumerated (29)
- [x] Theme rationale per row
- [x] All code-drawn (zero asset weight)
- [x] License-clean
