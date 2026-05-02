# CLAUDE.md — TILT project constitution

> Auto-generated from `/game-build` Phase 6. Read on every session.

## Stack (locked, see ARCHITECTURE.md)
- Vanilla JS, no framework
- HTML Canvas 2D
- WebAudio API (synthesized)
- localStorage + IndexedDB
- Single-file `www/index.html` for v1.0

## DoD (every commit)
- [ ] Tests pass: `npm test`
- [ ] Real-input harness GREEN: `npm run harness`
- [ ] Bundle ≤300KB gzip
- [ ] No console errors during 90s play
- [ ] No `.click()` shortcuts in tests (real-input only)
- [ ] No PII in telemetry
- [ ] No NC-licensed assets

## Hard rules from memory
1. **NEVER make user the tester** — dispatch QA roles BEFORE saying "done" (per feedback_no_user_testing.md, FAILURE_MODE_LEDGER 2026-05-02)
2. **NEVER hint-stack on confusion** — when player says "amacı ne anlamadım", FIX THE VISUAL LAYER, do not add tutorial overlays (per feedback_dont_addhint_to_complaint.md)
3. **NEVER ship YELLOW** — Quality-Bar Lead [#50] enforces. Convert to GREEN by fix or RED by escalation
4. **NEVER reference cyber-pinball or DROP** in retros — they're killed approaches (per feedback_dont_re_reference_killed_approaches.md)
5. **NEVER add framework / backend / IAP without ADR**
6. **NEVER mid-task interstitial ads / energy gates / accounts**

## Solo Tier active (9)
#1, #2, #3, #7, #G1, #11, #19, #20, #25 — per RoleActivation.json. NEVER 10+.

## Phase ownership table
See `~/.claude/skills/game-build/SKILL.md` Phase ownership table.

## Re-entry checklist (every session start)
1. Read CLAUDE.md (this)
2. Read RoleActivation.json
3. Read ACCEPTANCE_CRITERIA.md
4. Read FAILURE_MODE_LEDGER.md at `~/.claude/skills/game-build/`
5. Determine current phase from `git log` + artifact presence
6. Continue from current phase per Phase ownership table

## File map
- `src/` (v1.1+) — JS modules
- `www/` — built deployable artifact
- `automation/scripts/` — harnesses
- `tests/` — unit
- 12 design docs at root (STRATEGY through ARCHITECTURE)
