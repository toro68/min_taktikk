// Grunnleggende typer for taktikktavlen

export interface Coordinates {
  x: number;
  y: number;
}

export interface Point {
  x: number;
  y: number;
}

// Base line styles (simplified)
export type BaseLineStyle = 
  | 'straight'
  | 'curved'
  | 'sineWave'
  | 'fishHook'
  | 'hook';

// Line style modifiers
export interface LineStyleModifiers {
  dashed?: boolean;
  arrow?: 'none' | 'single' | 'double'; // Updated for clarity
  endMarker?: 'none' | 'circle' | 'square'; // Simplified based on docs
  hookDirection?: 'left' | 'right'; // Simplified based on docs
}

// Complete line style configuration
export interface LineStyleConfig {
  base: BaseLineStyle;
  modifiers: LineStyleModifiers;
  markers?: { key: string | null; icon: string; label: string; }[];
}

// The primary LineStyle type should include both base styles and contextual styles from .aigenrc
export type LineStyle = 
  // Base styles
  | BaseLineStyle
  // Contextual styles from .aigenrc
  | 'solidStraight'
  | 'solidCurved'
  | 'straightArrow'
  | 'curvedArrow'
  | 'dashedStraight'
  | 'dashedCurved'
  | 'sineWave'
  | 'sineWaveArrow';

// Deprecated: Combined and legacy styles for backward compatibility.
// These should be phased out from active UI components.
export type LegacyLineStyle = 
  | 'solidStraight'
  | 'solidCurved'
  | 'straightArrow'
  | 'curvedArrow'
  | 'dashedStraight'
  | 'dashedCurved'
  | 'dashedStraightArrow'
  | 'dashedCurvedArrow'
  | 'endMark'
  | 'plusEnd'
  | 'xEnd'
  | 'sineWaveArrow'
  | 'fishHookArrow'
  | 'hookStart'
  | 'hookStartArrow'
  | 'hookEnd'
  | 'hookEndArrow';

export interface LineProperties {
  curved: boolean;
  dashed: boolean;
  sineWave: boolean;
  fishHook: boolean;
  hookStart: boolean;
  hookEnd: boolean;
  marker: 'arrow' | 'endline' | 'plus' | 'xmark' | 'target' | 'circle' | 'doubleArrow' | 'smallArrow' | null;
  strokeColor: string;
  curveOffset?: number;
  strokeWidth?: number;
  dashArray?: string;
  doubleLines?: boolean;
  category?: string;
  intensity?: string;
}

export type Tool = 'select' | 'player' | 'opponent' | 'ball' | 'cone' | 'line' | 'text' | 'area';
export type PitchType = 'full' | 'offensive' | 'defensive' | 'handball' | 'fullLandscape' | 'blankPortrait' | 'blankLandscape';