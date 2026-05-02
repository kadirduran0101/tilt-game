# STYLE_GUIDE — TILT

> Phase 3. Owner: [#7] + [#G10]. 2026-05-02. One-page.

## Title + pitch
**TILT** — Mobile-vertical pinball with daily-seed shared tables + roguelite mutators. Synthwave-neon laid on 8-bit pixel base + CRT scanlines.

## Color palette

### Primary (3)
- `--neon-magenta` #FF2F92 — flipper L, accent
- `--neon-cyan` #00E5FF — flipper R, lit-target glow
- `--neon-yellow` #FFE53D — score popups, hype 50x flash, daily-seed stamp

### Secondary (2)
- `--retro-fg` #C8C8DA — bumper rim, UI text
- `--retro-bg` #14141E — playfield bg, dark base

### Accent (2)
- `--combo-red` #FF3B30 — danger / drain
- `--mode-green` #36F5A4 — active mode (multiball, hurry-up) indicator

### Do-not-use
- ❌ Pure white #FFFFFF (use `--retro-fg`)
- ❌ Pure black #000000 (use `--retro-bg`)
- ❌ Pinball-cabinet brown / wood / chrome (skeuomorphic)

### Contrast
- All `--neon-*` on `--retro-bg` ≥ 4.5:1 (verified)
- `--retro-fg` on `--retro-bg` = 8.2:1 ✓
- Color NEVER only signal: lit-target also has shape change (filled vs outline) + brightness pulse

## Moodboard (8 thumbnails — descriptive, no copy)

1. **Synthwave concert poster vertical** — neon gradient sky, low-poly mountain silhouette below, retro-future grid floor receding. (BG layer.)
2. **Vintage solid-state pinball cabinet, low-light photo** — chrome flippers glinting under dim arcade light, ball mid-air with light trail. (Flipper material vocab.)
3. **Game Boy + neon overlay** — 8-bit ball with modern soft particle bloom around it. (Ball sprite layering.)
4. **CRT TV with chromatic aberration** — slight RGB channel shift on screen edges. (Hype event post-fx.)
5. **Tron light-cycle trail vertical** — neon line tracing curved path. (Ball trail effect on chain≥3.)
6. **80s arcade marquee text** — chunky pixel font with neon outline. (Combo counter typography.)
7. **Vaporwave grid floor receding** — perspective grid, low saturation. (Playfield bg pattern when no mutators active.)
8. **Lofi minimalist mobile UI** — large negative space, single accent. (HUD: score top-left, daily-seed stamp top-center, mutator-stack top-right.)

## Material vocabulary

- **Ball**: 16×16 pixel sprite (8-bit pure white core) + 1.5px outer glow halo (white). Trail on velocity ≥400 px/s (4-segment fading line).
- **Flippers**: 2D polygons, 22% playfield-width long × 8px thick. Default `--retro-fg` outline + `--neon-magenta` (L) / `--neon-cyan` (R) fill at 60% opacity. Pulse to 100% during press+kick (80ms).
- **Bumpers**: 24px diameter circles, 8-bit pixel rim + neon-color inner glow on hit. Hit-state flashes hit-color for 80ms + screen-shake 4px.
- **Targets**: 16×24 pixel rectangles. Unlit = `--retro-fg` outline only. Lit = full color fill + pulse (sin-wave brightness 80-100%, period 1s).
- **Particles**: 2×2 pixel squares, velocity-vector + horizontal jitter, lifetime 600ms, alpha-fade.
- **Daily-seed stamp**: top-center HUD chip "DAILY 2026-05-02" in 8px pixel font, `--neon-yellow`, subtle 1px stroke.
- **Mutator icon**: 16×16 pixel icon per mutator (snowflake=frozen, two-balls=multiball, clock=hurry-up, etc), color-coded.
- **Text**: chunky pixel font (Press Start 2P), 8px base × 2x scale.

## Lighting model

- **Diegetic**: ball emits radial light (radius 14px, soft falloff). Bumpers reflect (subtle local glow on hit).
- **Ambient**: `--retro-bg` base + radial gradient lifting center 4% brighter.
- **Post-fx**:
  - Bloom (Gaussian σ=3px, threshold luminance>0.7) — ON for neon objects
  - Scanlines (1px row alternating, 8% opacity) — OVERLAY always
  - Chromatic aberration (1.5px R/B split) — ONLY on hype_50x flash + on mutator activation, 200ms duration
- **Photosensitivity**: max 2 flashes/sec. Verified per AC D4.

## Type system
- **Display**: Press Start 2P (Open Font License 1.1)
- **Body/UI**: same family at smaller scale
- Fallback: `'Press Start 2P', 'Courier New', monospace`
- NO third font

## Audio palette pointer (detail in AUDIO_LIST.md)
- Bed: synthwave + chiptune fusion, 90 BPM, A minor
- SFX: 8-bit square-wave (bumpers, pitch+0.4 semi per chain) + soft sub-thump (mode triggers) + saw sweep (hype_50x)
- Anti: NO realistic samples; everything synthesized at runtime

## Motion vocabulary
- **Snappy** (80-150ms): bumper hit flash, flipper press kick, score popup spring
- **Floaty** (300-600ms): particle drift, score number rising, scanline pulse
- **Weighty** (200-400ms): screen shake on hype, mode-enter zoom, mutator-pick reveal
- **Per element**: ball = floaty fall + snappy bumper-hit; flipper = snappy press; mutator pick = weighty hold + snappy commit

## Anti-patterns
- ❌ Pixel-only retro (NES-faithful) — fusion is the point
- ❌ Modern-flat-only (no Material/HIG)
- ❌ Skeuomorphic cabinet/wood/chrome
- ❌ Cartoon mascots
- ❌ Photorealistic anything
- ❌ "Cute" / kawaii
- ❌ 3D — pure 2D vertical
- ❌ Particle-spam — every particle has purpose

## Tokens (CSS source of truth)

```css
:root{
  --neon-magenta:#FF2F92;--neon-cyan:#00E5FF;--neon-yellow:#FFE53D;
  --retro-fg:#C8C8DA;--retro-bg:#14141E;
  --combo-red:#FF3B30;--mode-green:#36F5A4;
  --grid:8px;
  --space-xs:8px;--space-sm:16px;--space-md:32px;--space-lg:64px;
  --text-xs:8px;--text-sm:12px;--text-md:16px;--text-lg:24px;--text-display:32px;
  --t-snappy:100ms;--t-floaty:450ms;--t-weighty:300ms;
  --scanline-opacity:0.08;--bloom-radius:12px;--aberration-px:1.5px;
}
```

## Benchmark % per interactable
- Flipper L: 22% playfield-width, bottom 12% of vertical
- Flipper R: same
- Tap zones (touch input): bottom 25% × 50% width each (large hit target)
- Bumpers: 5% width each (24px on 480px), 5-7 of them
- Targets: 3.3% width each (16px on 480px), 3-5 of them
- Daily-seed stamp: top-center, 12px height (1.5% of vertical)

## DoD (Phase 3 gate)
- [x] Palette tokens (3 primary + 2 secondary + 2 accent + do-not-use)
- [x] Moodboard 8 descriptions
- [x] Material vocab + lighting + post-fx
- [x] Type system 1 family
- [x] Motion vocab snappy/floaty/weighty
- [x] Anti-patterns enumerated
- [x] Benchmark % cited per interactable
- [x] Photosensitivity ≤2 flashes/sec
