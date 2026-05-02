# ACCEPTANCE_CRITERIA — TILT

> Phase 0.6 LOCKED. Owners: [#3] [#19] [#20] [#43]. 2026-05-02.
> Rule: every AC has WHO + WHAT (measurable) + HOW + WHEN + TOOL.
> No YELLOW ships. Loop until GREEN per AC.

## A. Functional (Layer A) — [#19]
| AC | WHAT | HOW | WHEN | TOOL |
|---|---|---|---|---|
| A1 | Zero console errors during 90s table | grep `Error:` in playwright console log | Phase 12 | real-game-test.mjs |
| A2 | Ball physics: no NaN positions, no OOB | invariant check every frame, headless | Phase 8+12 | physics tick assertions |
| A3 | Flipper input → flipper-state-change ≤16.6ms | tap-to-flipper-up timestamp delta | Phase 12 | playwright touchscreen + state probe |
| A4 | Flipper kick imparts ≥1500 px/s on contact (Williams T2 baseline) | measure ball.vy after flipper hit | Phase 8+12 | physics-stress harness |
| A5 | Ball-saver on FIRST ball spawn — ball must reach flipper sweep arc within 1 physics second of spawn (no insta-drain) | timer + arc intersection check | Phase 8+12 | spawn-arc harness |
| A6 | Daily seed deterministic — same date → same table | run twice with mocked Date, compare layouts | Phase 8 | unit test |
| A7 | Mutator pick UI offers 3 distinct mutators (no duplicates) | inspect `mutator_pick_shown.options` | Phase 12 | telemetry replay |
| A8 | Game-over → restart-cleanup atomic | inspect state after run_end → run_start | Phase 12 | persona harness `restart-spammer` |
| A9 | localStorage save (PB, streak, mutator-collection) survives kill+reload | inject state, kill, reload, assert | Phase 12 | playwright reload |
| A10 | Multiball mutator: ≥2 simultaneous balls don't crash physics | force-multiball, run 30s | Phase 12 | physics-stress harness |
| A11 | Suspend/resume — pausing during mid-flight ball preserves trajectory after resume | visibilitychange spy + state delta | Phase 12 | playwright visibility |

## B. Performance — [#15] (folded into [#19] for solo)
| AC | WHAT | HOW | WHEN | TOOL |
|---|---|---|---|---|
| B1 | p99 frame ≤16.6ms on Pixel 5 chromium | playwright performance.measure 60s | Phase 12+15 | chrome perf trace |
| B2 | No allocation in hot path (pool balls + particles) | heap snapshot delta <2MB after 30s | Phase 8+12 | chrome heap diff |
| B3 | Bundle ≤300KB initial gzip | rollup analysis | Phase 6+15 | bundle-analyzer |
| B4 | First Contentful Paint ≤1.5s on 4G throttled | lighthouse mobile | Phase 15 | lighthouse |
| B5 | iOS Safari 60fps for 90s without throttle drop | RAF timestamp delta | Phase 12 | webkit playwright |
| B6 | dt-clamp on suspended frame: no physics jump after gap >100ms | inject visibility hide/show, watch ball jump | Phase 8+12 | playwright |

## C. Subjective UX (Layer B) — [#20]
| AC | WHAT | HOW | WHEN | TOOL |
|---|---|---|---|---|
| C1 | "Premium feel" VLM rubric ≥7/10 (cold-load + mid-table + post-50x screenshots) | VLM call on captures | Phase 11+12 | VLM-rubric harness |
| C2 | "Theme-coherent retro-modern fusion" ≥7/10 | VLM rubric axis | Phase 11+12 | VLM |
| C3 | "Would-screenshot moment" ≥7/10 — daily-seed 50x clip is share-bait | VLM + telemetry `screenshot_taken` count | Phase 12 | VLM + telemetry |
| C4 | "Hook-activation" ≥7/10 — first flipper-hit ≤5s for skilled persona | telemetry `time_to_first_flipper_hit_ms` p50 | Phase 12 | persona harness |
| C5 | "Hype-angle delivery" — at least one persona hits hype_25x within first run | telemetry filter | Phase 12 | persona harness |
| C6 | "Self-evident mechanic" — fresh-spawn-survival persona drops first ball + uses flipper without seeing tutorial overlay text | screenshot capture during persona run, no text overlay visible | Phase 12 | persona harness |
| C7 | "No 'amacı ne' moment" — UX ROI test: VLM rubric on splash + first 5 frames returns "I understand: pinball, hit targets, flippers protect ball" | open-ended VLM "what does this game want me to do" | Phase 11+12 | VLM open-ended |

## D. A11y — [#21] (folded into [#19] for solo)
| AC | WHAT | HOW | WHEN | TOOL |
|---|---|---|---|---|
| D1 | Flipper hit-targets ≥44pt (left/right tap zones bottom 25% × 50% width each) | DOM measurement | Phase 11 | playwright bbox |
| D2 | All UI buttons (mute, settings, restart, share) ≥44pt | DOM measurement | Phase 11 | playwright bbox |
| D3 | ΔE76 ≤20 between any rendered color and STYLE_GUIDE palette | screenshot color sampling | Phase 11 | image-color-diff |
| D4 | Photosensitivity: ≤3 flashes/sec across all juice | flash detector on 90s capture | Phase 11+12 | flash-rate analyzer |
| D5 | Color is not the only signal (lit-state of targets also has shape change) | manual + VLM | Phase 3+11 | VLM |
| D6 | Keyboard fallback: arrow keys = flippers, space = launch | playwright keyboard | Phase 11 | playwright |

## E. Engagement / KPI — [#20]
| AC | WHAT | HOW | WHEN |
|---|---|---|---|
| E1 | Hype-fire rate ≥30% tables (chain ≥10 fires) | telemetry post-launch wk1 | KPI dashboard |
| E2 | Screenshot hit-rate ≥5% of hype_50x events | telemetry post-launch wk2 | KPI dashboard |
| E3 | Drain-to-restart ratio ≥40% | telemetry post-launch wk1 | KPI dashboard |
| E4 | Session length p50 ≥4 min, p95 ≥12 min | telemetry post-launch wk2 | KPI dashboard |
| E5 | D7 retention ≥15% (gates v1.1) | sid revisit count | post-launch wk2 |
| E6 | Daily seed engagement: ≥30% of D1-active sids return next day to play that day's seed | telemetry post-launch wk2 | KPI dashboard |

## F. Privacy/Legal — [#33] (folded into [#3] for solo)
| AC | WHAT | HOW | WHEN | TOOL |
|---|---|---|---|---|
| F1 | privacy.html present, GDPR/KVKK compliant | manual review | Phase 14 | textlint |
| F2 | terms.html present, ≤9th grade Hemingway | readability score | Phase 14 | hemingway |
| F3 | NO PII in telemetry payload | event payload audit | Phase 12+15 | replay scrubber |
| F4 | LICENSE_TRAIL.md complete (vanilla JS + custom physics + procedural sprites + OFL font) | dep + asset audit | Phase 13 | npm audit |
| F5 | NO brand-name borrowing in any artifact (no Williams/Stern/FX/Wizard/etc) | grep audit | Phase 13 | grep |
| F6 | All 4 Operating Constitution Gates GREEN | self-attest checklist | Phase 14 | manual |

## G. Ship-gate composite — [#25]
| AC | WHAT | WHEN | TOOL |
|---|---|---|---|
| G1 | All A1-A11 GREEN | Phase 14 | /ship-gate |
| G2 | All B1-B6 GREEN | Phase 14 | /ship-gate |
| G3 | All C1-C7 ≥7/10 | Phase 14 | /ship-gate |
| G4 | All D1-D6 GREEN | Phase 14 | /ship-gate |
| G5 | F1-F6 GREEN | Phase 14 | /ship-gate |
| G6 | E1-E6 events firing in dev (post-launch validates thresholds) | Phase 12 | telemetry replay |

**Ship-block rule**: ANY single AC RED or YELLOW = no ship. YELLOW must convert to GREEN by fix or RED by escalation. Per Quality-Bar Lead [#50].

## Loop policy (post-Phase-12)
If ANY Layer B (C1-C7) score <7 → Phase 12.5 Strategist Mode B fires automatically. Max 3 iterations before mandatory user check-in.

## DoD (Phase 0.6 gate)
- [x] Every criterion measurable
- [x] Every criterion has WHO/WHAT/HOW/WHEN/TOOL
- [x] No YELLOW path defined
- [x] Joint sign-off: [#3] [#19] [#20] [#43]
