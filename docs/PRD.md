# Product Requirements Document (PRD)
## Football Animator - Taktikkplanlegger

**Versjon:** 1.1  
**Dato:** 15. juni 2025  
**Status:** Utviklingsversjon  

---

## 1. Produktoversikt

### 1.1 Produktvisjon
Football Animator er en webbasert taktikkplanlegger for fotball som lar brukere:
- Tegne taktiske diagrammer på fotballbaner
- Lage animerte sekvenser med spillerbevegelser
- Eksportere diagrammer som bilder, videoer og JSON-filer
- Dele og lagre taktiske oppsett

### 1.2 Målgruppe
- Fotballtrenere (primær målgruppe)
- Spillere 


### 1.3 Nåværende tilstand vs. Referanse (.aigenrc)

**Nåværende implementering:**
- Grunnleggende tegne- og animasjonsfunksjonalitet ✅
- Kompakt toolbar med alle hovedverktøy ✅
- Eksportfunksjoner delvis implementerte (kun placeholder) ⚠️
- Line style system med grunnleggende støtte ⚠️
- Theme og farger hardkodet ❌

**Ønsket forbedringer (inspirert av .aigenrc):**
- Fullstendig eksportfunksjonalitet ✅
- Utvidet line style system med modifiers ✅
- Konsistent ikonbruk som definert i .aigenrc ✅
- Theme system basert på .aigenrc fargepalett ✅

---

## 2. Teknisk arkitektur

### 2.1 .aigenrc som designreferanse
Appens design og funksjonalitet bruker `.aigenrc` som referanse for:

```json
{
  "version": "1.1",
  "settings": {
    "toolbar": {
      "position": "below",
      "layout": "grouped",
      "groups": {...}
    },
    "lineStyles": {...},
    "ui": {
      "theme": {...}
    }
  }
}
```

### 2.2 Nåværende teknisk stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom komponenter + shadcn/ui
- **State Management:** React hooks
- **SVG Rendering:** Native SVG med React

### 2.3 Implementeringsstatus vs. .aigenrc referanse

| Komponent | .aigenrc Referanse | Nåværende implementering | Status |
|-----------|-------------------|--------------------------|--------|
| Toolbar struktur | Definert gruppering | Kompakt flat struktur | ✅ Fungerer |
| Ikoner | Spesifikke ikoner (SquareDashedBottom) | Tilsvarende ikoner (SquareSplitHorizontal) | ⚠️ Kan synkroniseres |
| Eksportfunksjoner | JSON, PNG, GIF, Video | Kun placeholder-implementering | ❌ Mangler |
| Line styles | Komplekst modifier-system | Grunnleggende styles | ⚠️ Delvis |
| Theme system | Definerte farger | Hardkodede farger | ❌ Ikke implementert |

---

## 3. Funksjonelle krav

### 3.1 Grunnverktøy (Core)
**Status:** ✅ Implementert i BottomToolbar

| Verktøy | .aigenrc Ikon | Implementert Ikon | Funksjon | Status |
|---------|---------------|-------------------|----------|--------|
| Velg | MousePointer | MousePointer | Velg og flytt elementer | ✅ |
| Spiller | User | User | Legg til spillere | ✅ |
| Motspiller | Users | Users | Legg til motstandere | ✅ |
| Ball | Volleyball | Volleyball | Legg til ball | ✅ |
| Linje | PenTool | PenTool | Tegn linjer med kurver | ✅ |
| Tekst | Type | Type | Legg til tekstmerknader | ✅ |

### 3.2 Banekontroller (Pitch)
**Status:** ✅ Implementert

| Verktøy | .aigenrc Ikon | Implementert Ikon | Funksjon | Status |
|---------|---------------|-------------------|----------|--------|
| Bytt bane | SquareDashedBottom | SquareSplitHorizontal | Skift mellom banetyper | ⚠️ Annet ikon |

**Støttede banetyper fra .aigenrc:**

- `offensive`, `defensive`, `handball`, `full`, `fullLandscape`, `blankPortrait`, `blankLandscape`

### 3.3 Animasjonskontroller
**Status:** ✅ Implementert i TopToolbar

| Verktøy | .aigenrc Ikon | Implementert Ikon | Funksjon | Status |
|---------|---------------|-------------------|----------|--------|
| Start/Pause | Play | Play/Pause | Kontroller avspilling | ✅ |
| Spol tilbake | SkipBack | SkipBack | Tilbake til start | ✅ |
| Ny keyframe | Plus | Plus | Legg til ny ramme | ✅ |

### 3.3.1 Trace-funksjonalitet (Spilleranimering)
**Status:** ✅ Implementert og viktig for spilleranimering

Traces (bevegelseslinjer) viser bevegelse mellom keyframes:
- **Spillertraces:** Stiplete linjer som viser spillerbevegelser
- **Motstandertraces:** Stiplete linjer som viser motstanderbevegelser
- **Balltraces:** Solide linjer som viser ballbevegelser
- **Konfigurerbar:** Opacity, kurvatur og stil kan justeres
- **Automatisk:** Aktiveres automatisk under animasjonsavspilling

```json
"traces": {
  "enabled": true,
  "description": "Viser bevegelseslinjer for spillere under animasjon",
  "features": {
    "playerTraces": {
      "enabled": true,
      "opacity": 0.7,
      "style": "dashedStraight"
    },
    "opponentTraces": {
      "enabled": true,
      "opacity": 0.7,
      "style": "dashedStraight"
    },
    "ballTraces": {
      "enabled": true,  
      "opacity": 0.8,
      "style": "solidStraight"
    }
  }
}
```

### 3.4 Eksportfunksjoner
**Status:** ❌ Kun placeholder-implementering i useExportImport.ts

| Verktøy | .aigenrc Ikon | Implementert Ikon | Funksjon | Status |
|---------|---------------|-------------------|----------|--------|
| Lagre | Download | Download | Eksporter som JSON | ❌ console.log |
| PNG | Image | Download | Last ned som PNG | ❌ console.log |
| Last inn | Upload | Upload | Importer JSON | ⚠️ Delvis |

### 3.5 Avanserte verktøy
**Status:** ⚠️ Implementert, men mangler "collapsed" funksjonalitet

| Verktøy | .aigenrc Ikon | Implementert Ikon | Funksjon | Status |
|---------|---------------|-------------------|----------|--------|
| Kjegle | Cone | Cone | Legg til kjegler | ✅ |
| Område | Square | Square | Merk områder | ✅ |
| Kopier | Copy | Copy | Kopier keyframe | ✅ |
| Video | Film | Film | Eksporter video | ❌ console.log |
| GIF | FileImage | FileImage | Eksporter GIF | ❌ console.log |
| Eksempel | BookOpen | BookOpen | Last eksempeldata | ✅ |

**Kritisk mangel:** `"collapsed": true` funksjonalitet fra .aigenrc ikke implementert

---

## 4. Line Style System

### 4.1 Base styles (fra .aigenrc)
```json
"baseStyles": [
  {"key": "solidStraight", "label": "Rett linje", "icon": "Minus"},
  {"key": "solidCurved", "label": "Kurvet linje", "icon": "Smile"},
  {"key": "straightArrow", "label": "Rett pil", "icon": "ArrowRight"},
  {"key": "curvedArrow", "label": "Kurvet pil", "icon": "CornerDownRight"}
]
```

### 4.2 Contextual Toolbar Design (Oppdatert)
```json
"contextual": {
  "line": {
    "position": "bottom",
    "expanded": true,
    "compact": true,
    "showLabels": false,
    "controls": ["style", "curve", "color"]
  }
}
```

**Designprinsipper for contextual toolbar:**
- ✅ **Kun ikoner** - Ingen tekstlabels for å spare plass
- ✅ **Tooltips** - Hover/touch for å vise funksjonalitet  
- ✅ **Kompakt layout** - Maksimal funksjonalitet på minimal plass
- ✅ **Visuell representasjon** - Ikoner som representerer linjestilen

### 4.2 Modifiers (Ikke fullt implementert)
```json
"modifiers": {
  "dashed": {"label": "Stripet"},
  "arrow": {"label": "Pil"},
  "endMarker": {
    "options": ["none", "endline", "plus", "xmark"]
  },
  "hookDirection": {
    "options": ["start", "end"]
  }
}
```

**Status:** ❌ Kun grunnleggende line styles implementert

---

## 5. UI/UX Krav

### 5.1 Theme System (fra .aigenrc)
```json
"ui": {
  "theme": {
    "primaryColor": "#3b82f6",
    "secondaryColor": "#64748b",
    "successColor": "#10b981",
    "warningColor": "#f59e0b",
    "errorColor": "#ef4444"
  }
}
```

**Status:** ❌ Ikke implementert som theme provider

### 5.2 Animasjoner
```json
"animations": {
  "enabled": true,
  "duration": 200
}
```

**Status:** ⚠️ Delvis implementert med Tailwind transitions

### 5.3 Responsivt design
- ✅ Mobile-first tilnærming
- ✅ Kompakt toolbar for små skjermer
- ⚠️ Gruppering mangler for bedre organisering

---

## 6. Tekniske forbedringskrav

### 6.1 Høy prioritet

#### 6.1.1 Fullstendige eksportfunksjoner
**Beskrivelse:** Implementere alle eksportfunksjoner som er placeholder

**Akseptanskriterier:**

- [ ] JSON eksport/import fungerer (erstatt console.log i useExportImport.ts)
- [ ] PNG eksport av enkeltframes og hele banen
- [ ] GIF eksport av animasjoner
- [ ] Video eksport (MP4/WebM)

#### 6.1.2 Kompakt Line Style System
**Beskrivelse:** Implementere kompakt linjeverktøy med kun ikoner og tooltips

**Akseptanskriterier:**

- [x] Kompakt contextual toolbar for linjeverktøy
- [x] Kun ikoner - ingen tekstlabels for å spare plass  
- [x] Tooltips på hover/touch for funksjonalitetsbeskrivelse
- [ ] Ikoner som visuelt representerer linjestilen (Minus, Smile, ArrowRight, CornerDownRight)
- [ ] Compact curve slider implementert
- [ ] Compact color picker implementert

#### 6.1.3 Theme Provider basert på .aigenrc
**Beskrivelse:** Sentralisert fargesystem basert på .aigenrc theme

**Akseptanskriterier:**

- [ ] Theme provider leser farger fra .aigenrc
- [ ] Alle komponenter bruker theme farger i stedet for hardkodede
- [ ] CSS custom properties for konsistent styling

### 6.2 Medium prioritet

#### 6.2.1 Ikonsynkronisering med .aigenrc
**Beskrivelse:** Synkroniser ikoner med .aigenrc spesifikasjoner

**Akseptanskriterier:**

- [ ] SquareDashedBottom ikon for pitch toggle (ikke SquareSplitHorizontal)
- [ ] Alle ikoner matcher .aigenrc spesifikasjoner
- [ ] Konsistent ikonbruk på tvers av komponenter

#### 6.2.2 Enhanced Error Handling
**Beskrivelse:** Bedre bruker-feedback og feilhåndtering

**Akseptanskriterier:**

- [ ] Toast notifications for handlinger
- [ ] Feilmeldinger ved ugyldig input
- [ ] Loading states for eksportfunksjoner
- [ ] Undo/redo funksjonalitet

### 6.3 Lav prioritet

#### 6.3.1 Collapsed Groups Funksjonalitet
**Beskrivelse:** Implementere "collapsed": true for avanserte verktøy

**Akseptanskriterier:**

- [ ] Avanserte verktøy kan skjules/vises
- [ ] Brukerpreferanse lagres lokalt
- [ ] Smooth expand/collapse animasjoner

#### 6.3.2 Keyboard Shortcuts
**Beskrivelse:** Tilgjengelighet og effektivitet

**Akseptanskriterier:**

- [ ] Ctrl+Z for undo
- [ ] Space for play/pause
- [ ] 1-9 for verktøyvalg
- [ ] Accessibility compliance

---

## 7. Ikke-funksjonelle krav

### 7.1 Ytelse
- **Responstid:** < 100ms for UI-interaksjoner
- **Lasting:** < 3 sekunder initial load
- **Animasjoner:** 60fps smooth playback

### 7.2 Kompatibilitet
- **Nettlesere:** Chrome 90+, Firefox 88+, Safari 14+
- **Enheter:** Desktop, tablet, smartphone
- **Skjermstørrelser:** 320px - 4K

### 7.3 Tilgjengelighet
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

---

## 8. Kvalitetssikring

### 8.1 Testing strategy
- **Unit tests:** Alle hooks og utility funksjoner
- **Integration tests:** Toolbar og eksportfunksjoner
- **E2E tests:** Komplette brukerscenarios
- **Visual regression:** UI consistency

### 8.2 Performance metrics
- **Bundle size:** < 2MB
- **First contentful paint:** < 1.5s
- **Largest contentful paint:** < 2.5s
- **Cumulative layout shift:** < 0.1

---

## 9. Implementeringsplan

### 9.0 Fase 0: Arkitektur opprydding (Pågående - 1 uke)

**✅ Fullført:**

1. **Komponentorganisering**
   - Komponenter flyttet til logiske undermapper
   - Import-paths oppdatert
   - Dokumentasjon reorganisert til `docs/`-mappen

**🔧 Gjenværende teknisk opprydding:**

1. **TypeScript type-fiks**
   - Oppdater `ToolbarConfig`-typen til å støtte `groups`-property
   - Løs kompileringsfeil i `src/lib/config.ts`

2. **Komponentkonsolidering**
   - Vurder og fjern duplikate LineStyleSelector-komponenter:
     - `LineStyleSelector.tsx`
     - `SimpleLineStyleSelector.tsx`
     - `CompactLineStyleSelector.tsx`
     - `ImprovedLineStyleSelector.tsx`
   - Velg beste implementering eller kombiner funksjonalitet

3. **Utility-mappekonsolidering**
   - Vurder å kombinere `src/lib` og `src/utils` til én mappe
   - Standardisér hvor utility-funksjoner skal ligge

4. **Test-organisering**
   - Flytt testfiler til co-located plassering eller samle i `tests/`
   - Sikre at alle tester fortsatt kjører etter reorganisering

### 9.1 Fase 1: Core-funksjoner (2 uker)

1. **Eksportfunksjoner**
   - Implementer JSON eksport/import
   - PNG download funksjonalitet
   - Erstatt console.log med faktiske funksjoner

2. **Theme provider setup**
   - Centralized color system basert på .aigenrc
   - CSS custom properties
   - Konsistent farge-bruk

### 9.2 Fase 2: Line Style System (2 uker)

1. **Line style modifiers**
   - Implementer dashed/solid toggle
   - End markers fra .aigenrc (none, endline, plus, xmark)
   - Hook direction selector

2. **Advanced line features**
   - Curve offset controls
   - Style combination logic
   - Preview system for line styles

### 9.3 Fase 3: UX Forbedringer (1 uke)

1. **Ikonsynkronisering**
   - Sync med .aigenrc spesifikasjoner
   - SquareDashedBottom for pitch toggle

2. **Enhanced UX**
   - Toast notifications
   - Loading states
   - Error handling

### 9.4 Fase 4: Advanced Features (1 uke)

1. **Collapsed groups**
   - Implementer .aigenrc "collapsed": true
   - User preferences

2. **Keyboard shortcuts**
   - Accessibility improvements
   - Productivity features

---

## 10. Risiko og mitigering

### 10.1 Tekniske risikoer

| Risiko | Sannsynlighet | Påvirkning | Mitigering |
|--------|---------------|------------|------------|
| Config parsing feil | Medium | Høy | Fallback til default config |
| Eksport ytelse problemer | Høy | Medium | Streaming/chunked eksport |
| Cross-browser kompatibilitet | Medium | Medium | Progressive enhancement |

### 10.2 UX risikoer

| Risiko | Sannsynlighet | Påvirkning | Mitigering |
|--------|---------------|------------|------------|
| For kompleks UI | Medium | Høy | Brukertest, forenkling |
| Mobile brukbarhet | Høy | Høy | Mobile-first design |
| Learning curve | Medium | Medium | Onboarding og hjelp |

---

## 11. Suksessmålinger

### 11.1 Tekniske metrics

- ✅ Alle eksportfunksjoner implementert og fungerende
- ✅ Line style modifiers system komplett
- ✅ Theme provider basert på .aigenrc implementert
- ✅ < 3s initial load time
- ✅ Zero critical accessibility issues

### 11.2 Bruker metrics

- Brukeropplevelse score > 4/5
- Task completion rate > 90%
- Avg. session duration > 10 min
- Feature adoption rate > 70%

---

## 12. Vedlegg

### 12.1 .aigenrc referanse

Se vedlagt `.aigenrc` fil for fullstendig konfigurasjonsreferanse.

### 12.2 Nåværende implementeringsstatus

**✅ Fullført - Arkitektur og organisering:**

- **Dokumentasjon reorganisert** - Alle markdown-filer flyttet til `docs/`-mappen
- **Komponentstruktur reorganisert** - `src/components` organisert i logiske undermapper:
  - `toolbar/` - Toolbar- og verktøy-komponenter (BottomToolbar, TopToolbar, ToolSelector)
  - `animation/` - Animasjons-komponenter (AnimationControls, Timeline, KeyframePanel)
  - `properties/` - Property panels (AreaProperties, LineProperties)  
  - `debug/` - Debug- og test-komponenter (DebugPanel, AppTester, LineToolTester)
  - `selectors/` - Selector-komponenter (ColorSelector, LineStyleSelector-varianter)
  - `core/` - Kjerne-komponenter (TacticsBoard, ElementRenderer, ErrorBoundary)
  - `elements/`, `layout/`, `pitch/`, `ui/` - Eksisterende strukturer beholdt
- **Import-paths oppdatert** - Alle relative imports i kodebasen oppdatert til ny struktur

**✅ Implementerte komponenter:**

- `FootballAnimator.tsx` - Hovedkomponent ✅
- `BottomToolbar.tsx` - Kompakt grunnverktøy ✅
- `TopToolbar.tsx` - Animasjon og eksport ⚠️ (placeholder funksjoner)
- `useAppConfig.ts` - Konfigurasjonssystem ✅
- `useExportImport.ts` - Eksportlogikk ❌ (kun console.log)

**❌ Manglende implementeringer:**

- Fullstendige eksportfunksjoner (JSON, PNG, GIF, Video)
- Line style modifiers system
- Theme provider basert på .aigenrc
- "Collapsed": true funksjonalitet for avanserte verktøy

**🔧 Teknisk oppgjørelsesstatus:**

- ⚠️ TypeScript-feil i `src/lib/config.ts` - `ToolbarConfig`-typen mangler `groups`-property
- ⚠️ Duplikate komponenter må konsolideres (flere LineStyleSelector-varianter)
- ⚠️ `src/lib` og `src/utils` mapper kan konsolideres

### 12.3 Kodeeksempler

**Theme provider (ønsket implementering):**

```tsx
const ThemeProvider = ({ children }) => {
  const { config } = useAppConfig();
  const theme = config.settings.ui.theme;
  
  return (
    <div style={{ 
      '--primary-color': theme.primaryColor,
      '--error-color': theme.errorColor 
    }}>
      {children}
    </div>
  );
};
```

**Eksportfunksjon (ønsket implementering):**

```tsx
const handleDownloadAnimation = useCallback((frames: Frame[]) => {
  const jsonData = JSON.stringify(frames, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'animation.json';
  link.click();
}, []);
```

---

**Dokumentslut**  
*Dette dokumentet skal oppdateres etter hver implementeringsfase og brukertest.*
