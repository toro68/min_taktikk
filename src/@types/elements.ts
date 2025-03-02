import { LineStyle } from '../components/LineStyleSelector';

export type Tool = 'select' | 'player' | 'opponent' | 'ball' | 'cone' | 'line' | 'text';
export type PitchType = 'full' | 'offensive' | 'defensive' | 'handball' | 'fullLandscape' | 'blankPortrait' | 'blankLandscape';

export interface BaseElement {
  id: string;
  x?: number;
  y?: number;
  visible?: boolean;
}

export interface PlayerElement extends BaseElement {
  type: 'player';
  number: string;
  traceOffset?: number;
}

export interface OpponentElement extends BaseElement {
  type: 'opponent';
  number: string;
}

export interface BallElement extends BaseElement {
  type: 'ball';
  traceOffset?: number;
}

export interface ConeElement extends BaseElement {
  type: 'cone';
}

export interface LineElement extends BaseElement {
  type: 'line';
  path: string;
  dashed: boolean;
  marker?: 'arrow' | 'endline' | 'plus' | 'xmark' | 'redArrow' | 'blueArrow' | 'greenArrow' | 'orangeArrow' | 'purpleArrow' | null;
  color?: string;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  width?: number;
  height?: number;
  rotation?: number;
}

export type Element = PlayerElement | OpponentElement | BallElement | ConeElement | LineElement | TextElement;

export interface Frame {
  elements: Element[];
  duration: number;
}

export const PLAYER_RADIUS = 10;
export const BALL_RADIUS = 5; 