# AUDIO_LIST — TILT

> Phase 5b. Owner: [#G12]. 2026-05-02.
> ALL audio synthesized in WebAudio API at runtime. Zero samples. License-clean.

## Music

| ID | Purpose | Length | BPM | Key | Notes |
|---|---|---|---|---|---|
| music_main | Game-loop bed | 32s loop | 90 | A minor | Synthwave + chiptune fusion. Lo-fi pad + 8-bit lead arp + sub bass. Bed −18dB. Ducks −3dB during hype events. |
| music_menu | Menu/splash/run-summary | 16s loop | 90 | A minor | Stripped: pad + arp only, no bass. |
| music_mode | Active mode (multiball/hurry-up) | 16s loop | 110 | A minor | Tempo +20BPM, more arp activity, drives urgency. Crossfades from main 250ms. |

Implementation: WebAudio OscillatorNode + GainNode + BiquadFilter LP. Procedural composition. No sample files.

## SFX

| ID | Event | Duration | Pitch | Synth | Notes |
|---|---|---|---|---|---|
| sfx_chime | UI open / restart / hype prompt | 200ms | A4 + E5 | Sine + envelope (5ms attack, 195ms release) | |
| sfx_drop | Ball auto-launch from shooter | 100ms | C5→A4 desc | Square + LP filter | "Whoosh" |
| sfx_spawn | Ball appears at shooter lane | 80ms | C5 | Sine | Subtle "ready" |
| sfx_flipper | Flipper press kick | 60ms | E4 | Square + short envelope | Mechanical "thwack" |
| sfx_bumper | Bumper hit | 40ms | C5 base, +0.4 semi/chain peg | Square + short env | Pitch ramps with chain |
| sfx_target | Target lit | 100ms | E5 + B5 | Sine | Reward chime |
| sfx_combo | Combo counter increment | 60ms | D5 base, +0.3 semi per | Square + short env | |
| sfx_save | Ball-saver triggered | 250ms | F5 → A5 → C6 ascending | Square arp | Reassurance up-chord |
| sfx_drain | Ball drained | 200ms | C4 → G3 desc | Sine + LP descending | Sad "loss" |
| sfx_mode_enter | Multiball/hurry-up activates | 600ms | C5 → C6 sweep + arp | Saw sweep + chip | Big shift |
| sfx_mode_exit | Mode ends | 300ms | C6 → C5 desc | Saw desc | |
| sfx_hype50 | 50x combo | 1200ms | C5 → C6 sweep + arpeggio | Saw sweep + chip arp | Celebratory |
| sfx_pick_open | Mutator pick UI appears | 250ms | A4 + E5 chord | Sine | |
| sfx_pick_commit | Mutator selected | 350ms | E5 + B5 + E6 ascending | Sine arp | Big "yes" |
| sfx_table_end | Table summary | 600ms | A minor desc | Sine + decay | Calm resolution |
| sfx_run_end | Run-end modal | 1.2s | C minor desc + chord on resolve | Sine + chord | Final beat |
| sfx_near_miss | Chain breaks at 9 | 200ms | F4-F#4 dissonance | Square + dissonance | Frustration cue |
| sfx_ui_press | Button | 60ms | E5 | Sine | |
| sfx_load | Daily-seed stamp animates in | 150ms | C5 + G5 | Sine | "New day" reveal |

## VO
NONE in v1. Pure sonic-juice + music.

## Stingers

| ID | Event | Length |
|---|---|---|
| stinger_daily_pb | New daily PB on run-end | 1.5s major chord arp C-E-G-C, harmonic resolution |
| stinger_alltime_pb | New all-time PB | 2.5s extended chord progression, larger reveal |
| stinger_first_play | First-ever run start | 600ms welcome chord, fires once per device |
| stinger_streak_extend | Daily streak +1 | 800ms ascending arpeggio with reverb tail |

## Audio mixing
- Master ceiling −3dB
- Music bed −18dB (ducks for events)
- SFX peak −10dB
- Stingers peak −8dB
- Mute toggle persistent in localStorage
- iOS Safari: AudioContext unlocked on first user gesture

## Implementation
- WebAudio API only (no `<audio>` tags)
- Synth on-the-fly, no sample loading (zero asset weight)
- Pre-warm AudioContext on first user gesture
- Polyphony cap: 12 simultaneous SFX (older mobile CPU friendly)
- Music: 3 tracks total, fade-cross-mix on transition

## DoD (Phase 5b gate)
- [x] Every ASSET_MATRIX event has SFX entry
- [x] BPM + key consistent (90 main, 110 mode, A minor)
- [x] No license-encumbered samples
- [x] iOS Safari audio-unlock spec'd
- [x] Mute toggle + persistence
- [x] Pitch-shift rule per chain peg (BENCHMARK Feature 3)
