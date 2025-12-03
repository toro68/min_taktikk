# Football Animator

En interaktiv applikasjon for å lage fotball-taktiske animasjoner og diagrammer.

## Funksjoner

- **Interaktive elementer**: Plasser spillere, motstander, ball, kjegler og tekst
- **Linje- og pilverktøy**: Tegn bevegelser og pasninger med kurverbare linjer
- **Animasjoner**: Lag keyframe-baserte animasjoner av taktiske bevegelser
- **Flere banetyper**: Støtte for forskjellige baneformater (fotball, håndball, blanke)
- **Eksport/import**: Last ned som PNG, GIF, MP4, SVG eller JSON
- **Bevegelseslinjer (traces)**: Visualiser spillerbevegelser gjennom animasjoner
- **Konfigurerbart**: Tilpass hele appen gjennom `.aigenrc` konfigurasjonfil

👉 **Bruksområde:** Tegn spilleplanen, lag keyframes for bevegelsene, aktiver traces for spillere og ball, og eksporter som PNG/GIF/MP4/SVG eller del JSON-scenariet med trenerteamet.

## Kom i gang

### Installer avhengigheter

```bash
npm install
```

### Start utviklingsserver

```bash
npm start
```

Åpner applikasjonen på [http://localhost:3000](http://localhost:3000).

### Bygg for produksjon

```bash
npm run build
```

### Kjør tester

```bash
npm test
```

## Konfigurasjonssystem

Football Animator bruker en `.aigenrc` fil for konfigurasjon. Dette lar deg tilpasse:

- Verktøyknapper og etiketter
- Fargepaletter
- Kurve-innstillinger
- UI-tema og animasjoner

Hvis `.aigenrc` mangler, start med `docs/CONFIG_SNAPSHOT.md` og kopier innholdet.

Se [CONFIGURATION.md](./CONFIGURATION.md) for detaljert dokumentasjon.

### Rask start med konfigurasjon

1. Rediger `.aigenrc` filen i rot-mappen
2. Kopier endringer til `public/.aigenrc`
3. Refresh browseren for å laste nye innstillinger

```bash
# Eksempel: Kopier konfigurasjon etter endringer
cp .aigenrc public/.aigenrc
```

## Bruk

### Grunnleggende verktøy

- **Velg** (V): Velg og flytt elementer
- **Spiller** (P): Legg til spillere
- **Motspiller** (O): Legg til motstandere  
- **Ball** (B): Legg til ball
- **Kjegle** (C): Legg til kjegler/markører
- **Linje** (L): Tegn linjer og piler
- **Tekst** (X): Legg til tekstetiketter
- **Område** (A): Merk områder på banen

### Animasjon

1. Lag første keyframe med elementer
2. Legg til nye keyframes med endrede posisjoner og tall
3. Bruk play-knappen for å se animasjonen
4. Juster playback-hastighet etter behov
5. Aktiver trace-knappen for å se bevegelseslinjer for spillere og ball
6. Eksporter sekvensen (PNG/GIF/MP4) eller lagre som JSON for deling og gjenbruk

### Linjer og piler

- Velg linjeverktøy og klikk to punkter for å tegne
- Bruk linjestil-velgeren for forskjellige pil- og linjetyper
- Juster kurve-offset for buede linjer
- Velg farge fra fargepaletten

### Bevegelseslinjer (traces)

- Aktiver traces for å vise spillerbevegelser under animasjon
- Juster kurve-offset for trace-linjer
- Traces vises automatisk basert på animasjonsframes

## Teknisk stack

- **React 18** - UI-framework
- **TypeScript** - Type-sikkerhet
- **Tailwind CSS** - Styling  
- **Lucide React** - Ikoner
- **Radix UI** - UI-primitiver
- **Canvas API** - Eksport til bilder
- **SVG** - Vektorgrafikk

## Arkitektur

- `src/index.tsx` monterer `App`, som laster `.aigenrc` via `useAppConfig` og pakker hele appen inn i `ThemeProvider` og `ToastProvider`.
- `src/football-animator.tsx` er kjernekontaineren. Den bruker `useFootballAnimatorLogic` til å samle del-logikk: animasjon, verktøy, interaksjoner, element/ramme-handling, eksport/import, traces og layout.
- Hooken `useFootballAnimatorLogic` kombinerer spesialiserte hooks (`useAnimationLogic`, `useToolLogic`, `useInteractionLogic`, `useElementActions`, `useTraceManager`, `useInterpolation`) slik at komponentlaget holder seg tynt.
- Viktige mapper:
  - `src/components/` – layout, pitch, toolbar og properties.
  - `src/hooks/` – domenelogikk og sideeffekter.
  - `src/lib/` – matte/SVG-hjelpere, eksportverktøy og ytelsestester.
  - `src/providers/` – globale temaer/toasts.

Se `docs/football-animator.md` for et dypdykk i hook-komposisjonen.

## Mappestruktur

```
src/
├── components/          # React-komponenter
│   ├── elements/       # Spillbare elementer (Player, Ball, etc.)
│   ├── layout/         # Layout-komponenter
│   ├── pitch/          # Bane-komponenter
│   └── ui/             # UI-primitiver
├── constants/          # Konfigurasjoner og konstanter  
├── hooks/              # Custom React hooks
├── lib/                # Hjelpefunksjoner og utils
├── types/              # TypeScript type-definisjoner
└── utils/              # Generelle hjelpefunksjoner
```

## Konfigurasjonsfiler

- `.aigenrc` (må gjenopprettes fra `docs/CONFIG_SNAPSHOT.md` dersom slettet)
- `src/constants/` - Hardkodede konstanter
- `tailwind.config.js` - Tailwind CSS konfigurasjon
- `tsconfig.json` - TypeScript konfigurasjon

### Konfigurasjonsflyt

1. Rediger `.aigenrc` i rotmappen for å oppdatere verktøylinjer, linjestiler, baner, farger, guidelinjer og UI-temaer.
2. Synk til `public/.aigenrc` med `cp .aigenrc public/.aigenrc` slik at dev-serveren plukker opp endringen.
3. Dokumenter nye felter i `docs/CONFIGURATION.md` (angi standardverdi, datatype og hva som bryter bakoverkompabilitet).
4. Appen har fallback til standarder hvis filen mangler eller feiler. Feil logges i konsollen via `useAppConfig`.

## Testing

Prosjektet bruker Jest og React Testing Library:

```bash
# Kjør alle tester
npm test

# Kjør tester i watch-modus  
npm run test:watch

# Generer test-coverage rapport
npm run test:coverage
```

## Eksport og filformat

- **PNG** – statiske bilder fra nåværende frame (`Last ned PNG`).
- **GIF / MP4** – animasjoner gjengitt via `gif.js` og `canvg` (bruk top-toolbar).
- **JSON** – ramme-data som kan lastes inn igjen (bruk `Last inn` / `Eksempel`).

Sørg for at `recordedSVGRef` peker på aktiv tavle før eksport; ellers blir filene tomme.

## Feilsøking

- **Appen starter ikke**: Bekreft `npm install`, slett `node_modules` ved behov, og sjekk Node 18+.
- **Tom skjerm**: Kontroller at `public/.aigenrc` eksisterer og er gyldig JSON. DevTools → Network skal vise 200 på `.aigenrc`.
- **Konfigurasjon endres ikke**: Kopiér på nytt til `public/.aigenrc`, hard refresh (Cmd+Shift+R) og se etter konsollfeil.
- **Eksport feiler**: Sikre at alle rammer har elementer; se konsollen for `handleDownload*`-feil. PNG krever at `recordedSVGRef` er satt.
- **Animasjon stopper**: `Space` spiller/pause, `R` rewinder. Dersom frames er korrupt, slett midlertidig `localStorage`-nøkler hvis brukt i utvikling.

## Bidrag

1. Fork prosjektet
2. Lag en feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit endringene (`git commit -m 'Add some AmazingFeature'`)
4. Push til branchen (`git push origin feature/AmazingFeature`)
5. Åpne en Pull Request

## Lisens

Dette prosjektet er privat og proprietært.

## 📚 Dokumentasjon

All detaljert dokumentasjon finner du i [`docs/`](./docs/) mappen:

- **[docs/PRD.md](./docs/PRD.md)** - Product Requirements Document
- **[docs/CONFIGURATION.md](./docs/CONFIGURATION.md)** - Konfigurasjonssystem
- **[docs/football-animator.md](./docs/football-animator.md)** - Teknisk dokumentasjon
- **[docs/README.md](./docs/README.md)** - Oversikt over all dokumentasjon

## Kontakt

For spørsmål eller support, kontakt prosjektteamet.

---

**Tips**: Start med "⚙️ Configuration Demo" for å se alle tilgjengelige konfigurasjonsalternativer!
