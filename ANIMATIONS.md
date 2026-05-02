# ANIMATIONS — TILT

> Phase 5a. Owner: [#G13] + [#8]. 2026-05-02.

| Event | From | To | Duration | Easing | SFX | Particle |
|---|---|---|---|---|---|---|
| splash → playfield | logo | game | 600ms | ease-out-cubic | sfx_chime | none |
| daily-seed reveal | hidden | top-center pulse | 800ms | ease-out + spring | sfx_load | none |
| ball spawn (shooter lane) | invisible | full opacity | 200ms | ease-out | sfx_spawn | none |
| ball auto-launch | spawn pos | trajectory | instant | linear | sfx_drop | trail-segment |
| flipper press | down | up (kick angle) | 80ms in | ease-out | sfx_flipper | none |
| flipper release | up | down | 200ms | ease-in (or 400ms with FROZEN mutator) | none | none |
| bumper hit | default | hit-flash + ring expand | 80ms in / 80ms out + ring 200ms | ease-out | sfx_bumper (pitch+0.4 per chain) | particle×16 |
| target lit | unlit | lit + pulse | 150ms in then 1s pulse loop | ease-out + sin-wave | sfx_target | particle×8 |
| target unlit | lit | unlit | 100ms | ease-in | none | none |
| chain count update | n | n+1 | 100ms snappy | spring (k=200, d=15) | sfx_combo | none |
| ball-saver "SAVED" | hidden | visible 7s | 200ms in / 200ms out | ease-out | sfx_save | none |
| ball drained | falling | gone | 250ms shrink-fade | ease-in | sfx_drain | particle×8 (red) |
| mode enter (multiball/hurry-up) | normal | mode-active | 400ms zoom + flash | ease-out | sfx_mode_enter | particle×24 (green) |
| mode exit | mode-active | normal | 250ms | ease-in | sfx_mode_exit | none |
| hype 50x | normal | full juice | 200ms ease-out | ease-out | sfx_hype50 | hype-flash + chromatic 200ms |
| screenshot prompt | hidden | visible top-center | 300ms slide-down | ease-out | sfx_chime | none |
| table-end | last-ball drained or timer-out | summary fade-in | 600ms | ease-in-out | sfx_table_end | gentle particle fade |
| mutator-pick reveal | hidden | 3-card slide-in | 500ms staggered (each card 150ms) | ease-out | sfx_pick_open | none |
| mutator-pick commit | card highlighted | card flash + collapse | 250ms | spring | sfx_pick_commit | particle×16 (mutator color) |
| run-end summary | invisible | full modal | 600ms fade-in + scale | ease-in-out | sfx_run_end | none |
| restart transition | run-end | new run | 400ms | ease-in-out | sfx_chime | none |

## Reveal sequence — 50x combo (Phase 10 spec)

Total 2.2s, skippable.

| Beat | Time | Visual | Audio |
|---|---|---|---|
| Anticipation | 0-100ms | Combo freezes at 50x, screen darkens 20% | Music duck −3dB |
| Action | 100-300ms | Yellow flash full screen (peak alpha 0.4 → 0) | sfx_hype50 rises pitch |
| Reaction | 300-700ms | Chromatic aberration peak 1.5px, scanline pulse | sfx_hype50 sustains |
| Accumulation | 700-1500ms | "50×" pixel-zoom in, holds | Music swell back |
| Completion | 1500-2200ms | Share button fades in below combo | sfx_chime |

## Juice grammar (5-phase verified per top events)

| Event | Anticipation | Action | Reaction | Accumulation | Completion |
|---|---|---|---|---|---|
| Flipper tap | finger touch press-state | tap fires + flipper rotates up | flipper glows + sfx | flipper count++ | flipper returns down |
| Bumper hit | (continuous fall = anticipation) | ball collides bumper | flash + particles + sfx | chain++ | brief pause before next bumper |
| Mode enter | targets all-lit blink 200ms | mode-trigger fires | screen flash + mode banner | mode_active = true | rest 300ms before action resumes |
| 50x hype | combo climbs visibly | combo hits 50 | full reveal sequence | hype event in telemetry | rest 2.2s |

## DoD (Phase 5a gate)
- [x] Every ASSET_MATRIX interactable has animation entry
- [x] Snappy/floaty/weighty pick per element
- [x] Reveal sequence 6-14s range with skip
- [x] 5-phase juice grammar verified
- [x] Frozen-flippers mutator handled (return time variable)
