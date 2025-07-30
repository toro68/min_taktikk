import { LineStyle, BaseLineStyle, LineStyleConfig } from '../types';

export const BASE_LINE_STYLES: { value: BaseLineStyle; label: string }[] = [
  { value: 'straight', label: 'Rett linje' },
  { value: 'curved', label: 'Kurvet linje' },
  { value: 'sineWave', label: 'Sinusbølge' },
  { value: 'fishHook', label: 'Fiskekrok' },
  { value: 'hook', label: 'Krok' }
];

export const END_MARKER_OPTIONS = [
  { value: 'none', label: 'Ingen' },
  { value: 'circle', label: 'Sirkel' },
  { value: 'square', label: 'Firkant' }
];

export const HOOK_DIRECTION_OPTIONS = [
  { value: 'left', label: 'Venstre' },
  { value: 'right', label: 'Høyre' }
];

// Simple legacy conversion functions for backward compatibility
export const legacyToNewStyle = (legacyStyle: string): LineStyleConfig => {
  const config: LineStyleConfig = {
    base: 'straight' as BaseLineStyle,
    modifiers: {}
  };

  // Determine base style
  if (legacyStyle.includes('Curved') || legacyStyle.includes('curved')) {
    config.base = 'curved';
  } else if (legacyStyle.includes('sineWave') || legacyStyle.includes('sine')) {
    config.base = 'sineWave';
  } else if (legacyStyle.includes('fishHook') || legacyStyle.includes('fish')) {
    config.base = 'fishHook';
  } else if (legacyStyle.includes('hook')) {
    config.base = 'hook';
  } else {
    config.base = 'straight';
  }

  // Determine modifiers
  if (legacyStyle.includes('dashed') || legacyStyle.includes('Dashed')) {
    config.modifiers.dashed = true;
  }

  if (legacyStyle.includes('Arrow') || legacyStyle.includes('arrow')) {
    config.modifiers.arrow = 'single';
  }

  return config;
};

export const newToLegacyStyle = (config: LineStyleConfig): string => {
  // This is a simplified conversion for backward compatibility
  let style: string = config.base;
  if (config.modifiers.dashed) {
    style = 'dashed' + style.charAt(0).toUpperCase() + style.slice(1);
  }
  if (config.modifiers.arrow !== 'none' && config.modifiers.arrow) {
    style += 'Arrow';
  }
  return style;
};

export const DEFAULT_LINE_STYLE: LineStyle = 'straight';