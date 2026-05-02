# TELEMETRY_SCHEMA — TILT

> Phase 0.5 LOCKED. Owners: [#3] Strategist + [#19] QA + [#20] UX. 2026-05-02. schema_v: 1.0.

## Common envelope
```json
{ "ev": "<name>", "ts": <ms>, "sid": "<uuid>", "build": "<sha>", "device": "ios-safari|...", "locale": "...", "schema_v": "1.0" }
```

## PII rules
- NO name/email/IP/device-id/ad-id/location
- YES anonymous session uuid, build, device class, locale

## Events

### Lifecycle
- `app_open` — first paint
- `app_close` — extras: `session_duration_ms`
- `app_resume` — extras: `gap_ms`
- `app_suspend` — extras: `session_partial_ms`

### Run-loop (TILT-specific)
- `run_start` — extras: `daily_seed` (YYYYMMDD), `mutators_applied` (array of mutator IDs for this run, length 0 on table-1)
- `table_start` — extras: `table_index_in_run` (1-based), `mutators_active` (array applied so far), `daily_seed`
- `ball_launch` — extras: `ball_index_in_table` (1-3), `launch_power` (normalized 0-1)
- `flipper_press` — extras: `side` (L|R), `ts_relative_to_table_start_ms`
- `bumper_hit` — extras: `bumper_id`, `chain_count_so_far`
- `target_hit` — extras: `target_id`, `score_delta`, `lit_state_change` (boolean)
- `chain_complete` — extras: `chain_length_final`, `score_delta`, `combo_multiplier`
- `mode_enter` — extras: `mode_id` (multiball, hurry-up, etc), `triggered_by`
- `mode_exit` — extras: `mode_id`, `score_during_mode`
- `ball_drained` — extras: `ball_index`, `prevented_by_ballsaver` (boolean)
- `table_end` — extras: `table_score`, `table_duration_ms`, `max_chain`, `balls_used`
- `mutator_pick_shown` — extras: `options` (3 mutator IDs offered)
- `mutator_picked` — extras: `picked_id`, `options_shown`, `pick_index` (0/1/2)
- `run_end` — extras: `final_run_score`, `tables_played`, `mutators_collected`, `personal_best_run` (bool), `daily_personal_best` (bool)

### Hype-fire (KPI critical)
- `hype_chain` — chain ≥10. extras: `chain_length`
- `hype_25x` — combo ≥25x. extras: `combo_multiplier`
- `hype_50x` — combo ≥50x. extras: `combo_multiplier`
- `screenshot_prompt_shown` — extras: `event_trigger`
- `screenshot_taken` — extras: `channel` (web-share|fallback)
- `share_completed` — extras: `channel`

### UX
- `tutorial_implicit_complete` — first flipper-hit happened. extras: `time_to_first_flipper_hit_ms`
- `near_miss` — chain broke at 9. (hype threshold = 10)
- `restart_after_drain` — restarted within 5s of run_end
- `streak_extended` — daily streak counter +1
- `daily_seed_revealed` — extras: `seed_date`, `mutator_of_day`

### Cosmetic (v1.1+)
- `cosmetic_unlock_view`
- `cosmetic_select` — extras: `cosmetic_id`, `unlock_method`
- `cosmetic_purchase` — extras: `cosmetic_id`, `price_local`, `currency`

### Error
- `js_error` — extras: `msg_120`, `stack_top_5`
- `physics_invariant_violation` — extras: `invariant_name`
- `perf_long_task` — extras: `frame_duration_ms`

## KPI mapping

| KPI | Sources |
|---|---|
| D1/D7/D28 retention | `app_open` per sid persistence |
| Session length p50/p95 | `app_close.session_duration_ms` |
| Hype-fire rate | (`hype_chain` + `hype_25x` + `hype_50x`) / `table_start` |
| Screenshot hit-rate | `screenshot_taken` / `hype_50x` |
| Time-to-first-flipper-hit (5-sec test extension) | `tutorial_implicit_complete.time_to_first_flipper_hit_ms` p50 |
| Drain-to-restart ratio | `restart_after_drain` / `run_end` |
| Mutator pick velocity | (`mutator_picked.ts` − `mutator_pick_shown.ts`) p50 |
| Daily seed engagement | unique sids per `daily_seed_revealed` per UTC date |
| Streak retention | `streak_extended` ≥7 / `app_open` |

## Implementation
- Local IndexedDB ringbuffer (last 200 events), flushed on `app_close` + every 30s
- v1.0: local-only telemetry; weekly export endpoint (in-app debug viewer)
- v1.1: optional Vercel-hosted Plausible-class endpoint, no PII

## DoD
- [x] Common envelope spec'd
- [x] PII rules explicit
- [x] All events ≥1 KPI consumer (no orphans)
- [x] Schema versioned
- [x] LOCK signed: [#3] [#19] [#20] joint
