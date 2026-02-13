# Trace Curve Design Brief

## Goal
Gi brukeren kontroll over hvordan trace-linjer (bevegelsesbaner) bøyer seg mellom keyframes.

Terminologi i prosjektet: «trace» = bevegelseslinje mellom keyframes.
Stilnøkler for traces følger moderne nøkler i config (`dashedStraight`, `solidStraight`), med støtte for legacy-alias ved import.

## Problem
- Dagens trace har kun ett globalt `curveOffset`-tall.
- Alle spiller- og balltraces følger samme kurveprofil og kan ikke finjusteres per element.

---

## MVP (v1) – Implementert ✅

### Løsning
Per-trace kurvepreset med fire forhåndsdefinerte kurvetyper:
- `straight` – Rett linje (offset=0)
- `arc-left` – Bue mot venstre (offset=35)
- `arc-right` – Bue mot høyre (offset=-35)
- `s-curve` – Myk S-form (offset=25)

### Endringer
1. **Type**: `TraceCurveType` og `curveType` lagt til i `TraceElement` (`@types/elements.ts`)
2. **Hook**: `getEffectiveCurveOffset()` i `useTraceManager.ts` beregner faktisk offset
3. **UI**: `TraceProperties.tsx` komponent med visuell preset-velger
4. **Bakoverkompatibilitet**: `curveType` er optional – gamle JSON-scenarier fungerer uendret

### Bruk
Når en trace er valgt i editoren, vises TraceProperties-panelet med:
- Grid med 4 kurvepreset-knapper (visuell forhåndsvisning)
- Opacity-slider
- Fargeindiktor (arves fra kilde-element)

---

## Fremtidige utvidelser (v2) – Ikke implementert

Følgende features fra opprinnelig brief er parkert for senere vurdering:

## Ønsket opplevelse
1. **Flere kontrollpunkter**
   - Brukeren kan legge inn flere punkter på banen som trace-linjen skal passere.
   - Punktene kan representere viktige vendepunkter (cut, overlap, underlap) og gjør banen mer realistisk.
2. **Individuell kurvejustering**
   - Hvert trace-objekt kan ha egne kurve-innstillinger i stedet for kun et globalt offset.
   - Støtte for å justere tangenter/kurvestyrke mellom hvert segment (f.eks. “myk”, “skarp”, “S-curve”).
3. **Interaktiv redigering**
   - Når trace er aktiv, kan man dra kontrollpunkter direkte på banen og se oppdatert kurve i sanntid.
   - Mulighet til å låse punkter til grid/pitch-linjer eller spesifikke koordinater.
4. **Forhåndsvalg / Presets**
   - Forhåndsdefinerte kurvetyper (rette løp, bue rundt, diagonalt cutback) for rask bruk.
5. **Per keyframe**
   - Kurveform må kunne variere mellom keyframes slik at samme spiller kan ha ulike baner senere i animasjonen.

## Krav til data og eksport
- Trace-element må lagre en liste av kontrollpunkter (`[{ x, y, tension }]`).
- Eksport (PNG/GIF/MP4/SVG/JSON) må tegne identisk kurve som editoren viser.
- JSON-scenarier må støtte bakoverkompatibilitet: hvis ingen kontrollpunkter finnes, fall tilbake til dagens offset-logikk.

## UI-ideer
- Kontekstmeny på spilleren: «Legg til bane» → klikker for å legge punkter.
- Sidepanel med liste over kontrollpunkter (kan reorderes, slettes, endres numerisk).
- Slider eller input for standardkurve pr. trace, pluss «Avansert» knapp for flere punkter.

## Tekniske notater
- Lag et nytt trace-editor lag som viser kontrollpunkter/håndtak.
- Bruk eksisterende `useTraceManager` til å kalkulere path, men utvid med Bezier-segmenter bygget fra brukerpunktene.
- Vurder å bruke `cubic-bezier` eller Catmull-Rom spline for jevn kurve mellom punkter.
- Sørg for at sanntidsoppdatering ikke påvirker ytelsen når mange traces er aktive.
- SVG-pathene kan animeres direkte: enten via SMIL (`<animate>`, `<animateMotion>`), CSS (`stroke-dashoffset`, `transform`, osv.) eller JavaScript/React som oppdaterer `d`-attributt/`transform` med `requestAnimationFrame`/anim libs (GSAP, Framer Motion). Velg metode som gir best kompatibilitet og kontroll.

## QA / Godkjenning
- Verifiser at man kan:
  - Legge til/slette punkter på både spiller- og balltraces.
  - Endre rekkefølgen og se korrekt kurve.
  - Forhåndsvise eksport og få samme bane.
- Test keyboard-navigasjon for redigering av punkter og tilgjengelighet (fokus, ARIA-labels).

## Åpne spørsmål
- Skal punkter kunne følge spilleren (relative koordinater), eller alltid være på pitch-koordinater?
- Hvordan versjoneres gamle scenarioer slik at nye felter ikke bryter loading?
- Trenger vi «snap to player» funksjon for å raskt definere start/slutt?
