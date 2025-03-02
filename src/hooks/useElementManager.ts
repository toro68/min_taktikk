import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Element, 
  PlayerElement, 
  OpponentElement, 
  BallElement, 
  ConeElement, 
  LineElement, 
  TextElement 
} from '../@types/elements';

interface UseElementManagerReturn {
  createPlayer: (x: number, y: number, number?: string) => PlayerElement;
  createOpponent: (x: number, y: number, number?: string) => OpponentElement;
  createBall: (x: number, y: number) => BallElement;
  createCone: (x: number, y: number) => ConeElement;
  createLine: (path: string, options?: Partial<Omit<LineElement, 'id' | 'type' | 'path'>>) => LineElement;
  createText: (x: number, y: number, content: string, fontSize?: number) => TextElement;
  updateElement: <T extends Element>(element: T, updates: Partial<Omit<T, 'id' | 'type'>>) => T;
  isElementVisible: (element: Element, currentFrameIndex: number) => boolean;
}

export const useElementManager = (): UseElementManagerReturn => {
  // Opprett en ny spiller
  const createPlayer = useCallback((x: number, y: number, number: string = "1"): PlayerElement => {
    return {
      id: uuidv4(),
      type: 'player',
      x,
      y,
      number,
      visible: true
    };
  }, []);

  // Opprett en ny motstander
  const createOpponent = useCallback((x: number, y: number, number: string = "1"): OpponentElement => {
    return {
      id: uuidv4(),
      type: 'opponent',
      x,
      y,
      number,
      visible: true
    };
  }, []);

  // Opprett en ny ball
  const createBall = useCallback((x: number, y: number): BallElement => {
    return {
      id: uuidv4(),
      type: 'ball',
      x,
      y,
      visible: true
    };
  }, []);

  // Opprett en ny kjegle
  const createCone = useCallback((x: number, y: number): ConeElement => {
    return {
      id: uuidv4(),
      type: 'cone',
      x,
      y,
      visible: true
    };
  }, []);

  // Opprett en ny linje
  const createLine = useCallback((
    path: string, 
    options: Partial<Omit<LineElement, 'id' | 'type' | 'path'>> = {}
  ): LineElement => {
    return {
      id: uuidv4(),
      type: 'line',
      path,
      dashed: options.dashed || false,
      marker: options.marker || null,
      color: options.color,
      visible: options.visible !== undefined ? options.visible : true,
      x: options.x,
      y: options.y
    };
  }, []);

  // Opprett en ny tekst
  const createText = useCallback((
    x: number, 
    y: number, 
    content: string, 
    fontSize: number = 14
  ): TextElement => {
    return {
      id: uuidv4(),
      type: 'text',
      x,
      y,
      content,
      fontSize,
      visible: true
    };
  }, []);

  // Oppdater et element
  const updateElement = useCallback(<T extends Element>(
    element: T, 
    updates: Partial<Omit<T, 'id' | 'type'>>
  ): T => {
    return { ...element, ...updates } as T;
  }, []);

  // Sjekk om et element er synlig
  const isElementVisible = useCallback((element: Element, currentFrameIndex: number): boolean => {
    return element.visible !== false;
  }, []);

  return {
    createPlayer,
    createOpponent,
    createBall,
    createCone,
    createLine,
    createText,
    updateElement,
    isElementVisible
  };
}; 