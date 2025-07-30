import { LineStyleModifiers, LineStyle } from "../types";

// Re-export Tool-typen
export type { Tool } from "../types";

// Eksporter PitchType hvis den brukes andre steder
export type PitchType = 'offensive' | 'defensive' | 'handball' | 'full' | 'fullLandscape' | 'blankPortrait' | 'blankLandscape';

// Standardiser GuidelineMode til det som faktisk brukes i koden
export type GuidelineMode = false | 'lines' | 'colors' | 'full';

// Grunnleggende element interface
export interface BaseElement {
  id: string;
  x?: number;
  y?: number;
  visible?: boolean;
  color?: string;
}

// Line element with all nødvendige egenskaper
export interface LineElement extends BaseElement {
  type: 'line';
  path: string;
  style: LineStyle; // Updated to use the comprehensive LineStyle type
  modifiers: LineStyleModifiers;
  color: string;
  curveOffset?: number;
  // Legacy properties - should be phased out
  dashed?: boolean;
  marker?: 'arrow' | 'endline' | 'plus' | 'xmark' | 'target' | 'circle' | 'redArrow' | 'blueArrow' | 'greenArrow' | 'orangeArrow' | 'purpleArrow' | 'doubleArrow' | 'smallArrow' | null;
}

// Player elements
export interface PlayerElement extends BaseElement {
  type: 'player';
  x: number;
  y: number;
  number: string;
  color?: string;
}

export interface OpponentElement extends BaseElement {
  type: 'opponent';
  x: number;
  y: number;
  number: string;
  color?: string;
}

export interface BallElement extends BaseElement {
  type: 'ball';
  x: number;
  y: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  x: number;
  y: number;
  content: string;
  fontSize: number;
  color?: string;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  padding?: number;
  rotation?: number;
}

export interface ConeElement extends BaseElement {
  type: 'cone';
  x: number;
  y: number;
  color?: string;
}

export interface AreaElement extends BaseElement {
  type: 'area';
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  opacity?: number;
  label?: string;
}

export interface TraceElement extends BaseElement {
  type: 'trace';
  path: string;
  style?: LineStyle;
  dashed?: boolean;
  curved?: boolean;
  curveOffset?: number;
  elementId: string;
  elementType: 'player' | 'opponent' | 'ball';
  opacity?: number;
  quality?: 'low' | 'medium' | 'high';
  duration?: number;
  timestamp?: number;
  frameStart?: number;
  frameEnd?: number;
  thickness?: number;
  fadeType?: 'linear' | 'exponential' | 'none';
}

export interface TraceElement extends BaseElement {
  type: 'trace';
  path: string;
  style?: LineStyle;
  dashed?: boolean;
  curved?: boolean;
  curveOffset?: number;
  elementId: string;
  elementType: 'player' | 'opponent' | 'ball';
  opacity?: number;
  quality?: 'low' | 'medium' | 'high';
  duration?: number;
  timestamp?: number;
  frameStart?: number;
  frameEnd?: number;
  thickness?: number;
  fadeType?: 'linear' | 'exponential' | 'none';
}

// Legg til i FootballElement union
export type FootballElement = 
  | PlayerElement 
  | OpponentElement 
  | BallElement 
  | ConeElement 
  | TextElement 
  | LineElement 
  | AreaElement 
  | TraceElement;

export type Element = FootballElement;

export interface Frame {
  elements: FootballElement[];
  duration: number;
}

export const PLAYER_RADIUS = 15;
export const BALL_RADIUS = 8;
export const CONE_WIDTH = 10;
export const CONE_HEIGHT = 16;