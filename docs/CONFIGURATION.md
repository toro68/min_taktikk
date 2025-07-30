# Konfigurasjonssystem for Football Animator

Dette dokumentet beskriver det nye konfigurasjonssystemet som lar deg tilpasse Football Animator appen gjennom en `.aigenrc` fil.

## Oversikt

Konfigurasjonssystemet leser innstillinger fra `.aigenrc` filen og anvender dem på hele applikasjonen. Dette gjør det mulig å:

- Tilpasse verktøyknapper og deres etiketter
- Endre fargepaletter for linjer
- Justere kurve-innstillinger for linjer og traces
- Konfigurere banetyper og retningslinjer
- Sette UI-tema og animasjonsinnstillinger

## Hvordan det fungerer

1. **Konfigurasjonsfilene**:
   - `.aigenrc` - Hovedkonfigurasjonsfil (JSON-format)
   - `public/.aigenrc` - Kopi som kan lastes av browseren

2. **Automatisk lasting**:
   - Appen laster konfigurasjonen automatisk ved oppstart
   - Fallback til standardverdier hvis konfig ikke kan lastes

3. **Live reload**:
   - Endringer i `public/.aigenrc` kan tas i bruk ved å refreshe siden

## Konfigurasjonsfil (.aigenrc)

### Struktur

```json
{
  "version": "1.1",
  "settings": {
    "toolbar": { /* Verktøyknapper */ },
    "lineStyles": { /* Linjestiler og farger */ },
    "keyframes": { /* Keyframe-funksjoner */ },
    "traces": { /* Bevegelseslinjer */ },
    "pitchTypes": [ /* Tilgjengelige banetyper */ ],
    "guidelines": { /* Retningslinjer */ },
    "ui": { /* UI-tema og animasjoner */ }
  }
}
```

### Toolbar-konfigurasjon

```json
"toolbar": {
  "position": "below",
  "layout": "single-line",
  "buttons": [
    {
      "key": "select",
      "icon": "MousePointer",
      "label": "Velg",
      "tooltip": "Velg og flytt elementer"
    }
    // ... flere knapper
  ]
}
```

**Tilgjengelige ikoner**:
- `MousePointer`, `User`, `Users`, `Volleyball`, `Cone`, `PenTool`, `Type`, `Square`
- `SquareDashedBottom`, `Trash2`, `Play`, `Pause`, `SkipBack`, `Copy`, `Plus`
- `Film`, `Download`, `FileImage`, `Upload`, `BookOpen`

### Linjestiler og farger

```json
"lineStyles": {
  "curveRange": {
    "min": -300,
    "max": 300,
    "step": 1
  },
  "colors": [
    {
      "key": "black",
      "label": "Svart",
      "value": "#000000"
    }
    // ... flere farger
  ]
}
```

### Traces (bevegelseslinjer)

```json
"traces": {
  "enabled": true,
  "curveRange": {
    "min": -300,
    "max": 300,
    "step": 1
  }
}
```

### UI-tema

```json
"ui": {
  "theme": {
    "primaryColor": "#3b82f6",
    "secondaryColor": "#64748b",
    "successColor": "#10b981",
    "warningColor": "#f59e0b",
    "errorColor": "#ef4444"
  },
  "animations": {
    "enabled": true,
    "duration": 200
  }
}
```

## Bruk av konfigurasjonssystemet

### 1. Endre eksisterende konfigurasjon

Rediger `.aigenrc` filen i rot-mappen:

```bash
# Rediger hovedkonfigurasjon
vim .aigenrc

# Kopier til public-mappen for at browseren skal kunne laste den
cp .aigenrc public/.aigenrc
```

### 2. Test endringer

1. Start utviklingsserveren: `npm start`
2. Gå til `http://localhost:3000`
3. Klikk på "⚙️ Configuration Demo" for å se alle innstillinger
4. Refresh siden for å laste nye innstillinger

### 3. Tilpasse farger

For å legge til en ny farge:

```json
{
  "key": "pink",
  "label": "Rosa",
  "value": "#ff69b4"
}
```

### 4. Endre kurve-områder

For å justere kurve-sliders:

```json
"curveRange": {
  "min": -500,    // Ny minimum verdi
  "max": 500,     // Ny maksimum verdi
  "step": 5       // Større steg
}
```

### 5. Deaktivere funksjoner

```json
"traces": {
  "enabled": false  // Skjuler trace-funksjoner
},
"keyframes": {
  "features": {
    "downloadPng": {
      "enabled": false  // Skjuler PNG-nedlasting
    }
  }
}
```

## Teknisk implementering

### Hovedkomponenter

1. **`src/lib/config.ts`** - Konfigurasjonssystem
2. **`src/hooks/useAppConfig.ts`** - React hook for lasting
3. **`src/lib/iconMap.ts`** - Mapping av ikon-strenger til komponenter
4. **`src/components/ConfigDemo.tsx`** - Demo-side for konfigurasjon

### Integrasjon i eksisterende komponenter

- **`src/constants/colors.ts`** - Leser farger fra konfig
- **`src/constants/tools.ts`** - Leser verktøy fra konfig
- **`src/components/ToolSelector.tsx`** - Bruker kurve-innstillinger
- **`src/components/BottomToolbar.tsx`** - Bruker trace-innstillinger
- **`src/components/LineProperties.tsx`** - Bruker kurve-innstillinger

### Fallback-mekanisme

Hvis konfigurasjonen ikke kan lastes:
1. Appen viser en loading-screen
2. Fallback til hardkodede standardverdier
3. Logger en advarsel i konsollen
4. Fortsetter med normal funksjonalitet

## Eksempler på tilpasninger

### Eksempel 1: Norsk konfigurasjon
```json
{
  "settings": {
    "lineStyles": {
      "colors": [
        {"key": "sort", "label": "Sort", "value": "#000000"},
        {"key": "rød", "label": "Rød", "value": "#ff0000"},
        {"key": "blå", "label": "Blå", "value": "#0000ff"}
      ]
    }
  }
}
```

### Eksempel 2: Utvidet kurve-område
```json
{
  "settings": {
    "lineStyles": {
      "curveRange": {"min": -1000, "max": 1000, "step": 10}
    },
    "traces": {
      "curveRange": {"min": -1000, "max": 1000, "step": 10}
    }
  }
}
```

### Eksempel 3: Eget fargetema
```json
{
  "settings": {
    "ui": {
      "theme": {
        "primaryColor": "#8b5cf6",
        "secondaryColor": "#64748b",
        "successColor": "#059669",
        "warningColor": "#d97706",
        "errorColor": "#dc2626"
      }
    }
  }
}
```

## Feilsøking

### Konfigurasjon lastes ikke
1. Sjekk at `public/.aigenrc` eksisterer
2. Valider JSON-syntaks med en validator
3. Sjekk nettverksfanen i DevTools for 404-feil

### TypeScript-feil
1. Sjekk at alle påkrevde felter er med
2. Valider at ikon-navn finnes i `iconMap.ts`
3. Sjekk at alle verdier har riktig type

### Endringer vises ikke
1. Refresh siden (Ctrl+R / Cmd+R)
2. Sjekk at `public/.aigenrc` er oppdatert
3. Tøm browser-cache hvis nødvendig

## Fremtidige utvidelser

Dette systemet kan enkelt utvides med:
- Tema-filer (mørk/lys modus)
- Bruker-spesifikke innstillinger
- Import/eksport av konfigurasjoner
- GUI for redigering av innstillinger
- Språk-lokalisering
- Plugin-system for tilleggsfunksjoner

## Konklusjon

Din `.aigenrc` fil er nå fullt integrert i Football Animator! Du kan enkelt tilpasse hele appen ved å redigere denne filen. Systemet er bygget for å være:

- **Fleksibelt** - Støtter mange typer tilpasninger
- **Robust** - Fallback til standardverdier ved feil
- **Utvidbart** - Enkelt å legge til nye konfigurasjonsalternativer
- **Brukersamet** - Endringer krever ikke gjencompiling

Teste gjerne systemet og tilpass appen til dine behov!
