# Football Animator

En interaktiv applikasjon for å lage fotball-taktiske animasjoner og diagrammer.

## Funksjoner

- **Interaktive elementer**: Plasser spillere, motstander, ball, kjegler og tekst
- **Linje- og pilverktøy**: Tegn bevegelser og pasninger med kurverbare linjer
- **Animasjoner**: Lag keyframe-baserte animasjoner av taktiske bevegelser
- **Flere banetyper**: Støtte for forskjellige baneformater (fotball, håndball, blanke)
- **Eksport/import**: Last ned som PNG, GIF, MP4 eller JSON
- **Bevegelseslinjer (traces)**: Visualiser spillerbevegelser gjennom animasjoner
- **Konfigurerbart**: Tilpass hele appen gjennom `.aigenrc` konfigurasjonfil

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
2. Legg til nye keyframes med endrede posisjoner
3. Bruk play-knappen for å se animasjonen
4. Juster playback-hastighet etter behov

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

- `.aigenrc` - Hovedkonfigurasjon (se CONFIGURATION.md)
- `src/constants/` - Hardkodede konstanter
- `tailwind.config.js` - Tailwind CSS konfigurasjon
- `tsconfig.json` - TypeScript konfigurasjon

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
