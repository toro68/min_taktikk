# `.aigenrc` Snapshot

Dette dokumentet beskriver dagens konfigurasjon slik at `CLAUDE.md` og selve `.aigenrc` kan fjernes uten å miste referanse.

## Metadata
- **Version:** `1.1`
- **Layout:** `split` (delt top/bottom toolbar)

## Toolbar
- **Bottom group (`Hovedverktøy`):** `select`, `player`, `opponent`, `ball`, `cone`, `line`, `text`, `area`, `togglePitch`
- **Top animation group:** `playPause`, `rewind`, `addKeyframe`
- **Top export group:** `downloadJson`, `downloadPng`, `downloadFilm`, `downloadGif`, `loadAnimation`, `loadExample`
- **Contextual line toolbar:** position `bottom`, compact, controls `style/curve/color/marker`, styles `solidStraight`, `solidCurved`, `straightArrow`, `curvedArrow`, `dashedStraight`, `dashedCurved`, `sineWave`, `fishHook`, `hook`

## Line Styles
- **Colors:** `Svart (#000000)`, `Rød (#ff0000)`, `Blå (#0000ff)`, `Grønn (#008000)`, `Gul (#ffff00)`, `Oransje (#ffa500)`
- **Curve range:** min `-400`, max `400`, step `10`
- **Markers:** none (`Minus`), `arrow` (`ArrowRight`), `endline` (`Move`), `plus` (`Plus`), `xmark` (`X`), `target` (`Target`), `circle` (`Circle`)
- **Professional styles:** categories for `player`, `opponent`, `ball` each with `solid`, `dashed`, `dotted`

## Keyframes & Traces
- **Keyframes:** `downloadPng` feature enabled with tooltip "Last ned keyframe som PNG"
- **Traces:** enabled overall, description "Viser bevegelseslinjer…"
  - Player traces: opacity `0.7`, style `dashedStraightArrow`
  - Ball traces: opacity `0.8`, style `solidStraight`
  - Curve range: min `-300`, max `300`, step `1`

## Pitch & Guidelines
- **Pitch types:** `offensive`, `defensive`, `handball`, `full`, `fullLandscape`, `blankPortrait`, `blankLandscape`
- **Guideline modes:** `lines`, `colors`, `full`

## UI Theme
- Primary `#3b82f6`, secondary `#64748b`, success `#10b981`, warning `#f59e0b`, error `#ef4444`
- Animations enabled, duration `200ms`

Bruk dette som referanse når du bygger ny konfigurasjon eller kjører kode som forventer `.aigenrc`.
