import { LineStyle, LineProperties } from '../types';
import { getConfig } from './config';

/**
 * Convert line style to properties based on .aigenrc professional styles
 */
export const getLinePropertiesFromStyle = (style: LineStyle): LineProperties => {
  const config = getConfig();
  const professionalStyles = config.settings.lineStyles.professionalStyles;

  // Default properties
  const defaultProps: LineProperties = {
    curved: false,
    dashed: false,
    sineWave: false,
    fishHook: false,
    hookStart: false,
    hookEnd: false,
    marker: null,
    strokeColor: '#000000',
    curveOffset: 0,
    strokeWidth: 2,
    dashArray: undefined,
    doubleLines: false,
    category: 'basic',
    intensity: 'medium'
  };

  // Handle basic styles
  if (style === 'straight') {
    return { ...defaultProps, curved: false };
  }
  
  if (style === 'curved') {
    return { ...defaultProps, curved: true };
  }
  
  if (style === 'sineWave') {
    return { ...defaultProps, sineWave: true };
  }
  
  if (style === 'fishHook') {
    return { ...defaultProps, fishHook: true };
  }
  
  if (style === 'hook') {
    return { ...defaultProps, hookStart: true }; // default to hookStart
  }

  // Handle professional styles
  if (professionalStyles) {
    // Check player category
    if (professionalStyles.player && style in professionalStyles.player) {
      const styleConfig = professionalStyles.player[style as keyof typeof professionalStyles.player];
      return {
        ...defaultProps,
        strokeWidth: styleConfig.strokeWidth || 2,
        dashed: styleConfig.dashed || false,
        dashArray: styleConfig.dashArray,
        curved: styleConfig.curved || false,
        marker: styleConfig.marker as LineProperties['marker'] || null,
        doubleLines: styleConfig.doubleLines || false,
        category: 'player'
      };
    }

    // Check ball category
    if (professionalStyles.ball && style in professionalStyles.ball) {
      const styleConfig = professionalStyles.ball[style as keyof typeof professionalStyles.ball];
      return {
        ...defaultProps,
        strokeWidth: styleConfig.strokeWidth || 2,
        dashed: styleConfig.dashed || false,
        dashArray: styleConfig.dashArray,
        curved: styleConfig.curved || false,
        marker: styleConfig.marker as LineProperties['marker'] || null,
        sineWave: styleConfig.sineWave || false,
        category: 'ball'
      };
    }

    // Check tactical category
    if (professionalStyles.tactical && style in professionalStyles.tactical) {
      const styleConfig = professionalStyles.tactical[style as keyof typeof professionalStyles.tactical];
      return {
        ...defaultProps,
        strokeWidth: styleConfig.strokeWidth || 2,
        dashed: styleConfig.dashed || false,
        dashArray: styleConfig.dashArray,
        curved: styleConfig.curved || false,
        marker: styleConfig.marker as LineProperties['marker'] || null,
        category: 'tactical'
      };
    }
  }

  // Handle styles defined in .aigenrc contextual configuration
  const styleMap: Record<string, Partial<LineProperties>> = {
    solidStraight: { curved: false, dashed: false },
    solidCurved: { curved: true, dashed: false },
    straightArrow: { curved: false, dashed: false, marker: 'arrow' },
    curvedArrow: { curved: true, dashed: false, marker: 'arrow' },
    dashedStraight: { curved: false, dashed: true },
    dashedCurved: { curved: true, dashed: true },
    sineWave: { sineWave: true },
    sineWaveArrow: { sineWave: true, marker: 'arrow' },
    // Legacy styles
    endMark: { marker: 'endline' },
    plusEnd: { marker: 'plus' },
    xEnd: { marker: 'xmark' },
    dashedCurvedArrow: { curved: true, dashed: true, marker: 'arrow' },
    dashedStraightArrow: { curved: false, dashed: true, marker: 'arrow' },
    fishHook: { fishHook: true },
    fishHookArrow: { fishHook: true, marker: 'arrow' },
    hookStart: { hookStart: true },
    hookStartArrow: { hookStart: true, marker: 'arrow' },
    hookEnd: { hookEnd: true },
    hookEndArrow: { hookEnd: true, marker: 'arrow' }
  };

  const styleProps = styleMap[style] || {};
  const result = { ...defaultProps, ...styleProps };
  
  return result;
};

/**
 * Get style description for tooltip
 */
export const getStyleDescription = (style: LineStyle): string => {
  const config = getConfig();
  const professionalStyles = config.settings.lineStyles.professionalStyles;

  // Check professional styles first
  if (professionalStyles) {
    for (const [categoryKey, categoryData] of Object.entries(professionalStyles)) {
      if (categoryData && typeof categoryData === 'object' && style in categoryData) {
        const styleConfig = (categoryData as any)[style];
        return styleConfig?.description || styleConfig?.label || style;
      }
    }
  }

  // Basic style descriptions
  const basicDescriptions: Record<string, string> = {
    straight: 'Rett linje mellom to punkter',
    curved: 'Kurvet linje med justerbar buning',
    straightArrow: 'Rett linje med pil',
    curvedArrow: 'Kurvet linje med pil',
    solidStraight: 'Rett, heltrukken linje',
    solidCurved: 'Kurvet, heltrukken linje',
    dashedCurved: 'Kurvet, stiplet linje',
    dashedStraight: 'Rett, stiplet linje'
  };

  return basicDescriptions[style] || style;
};

/**
 * Get category for a line style
 */
export const getStyleCategory = (style: LineStyle): 'basic' | 'player' | 'ball' | 'tactical' => {
  const config = getConfig();
  const professionalStyles = config.settings.lineStyles.professionalStyles;

  if (professionalStyles) {
    if (professionalStyles.player && style in professionalStyles.player) return 'player';
    if (professionalStyles.ball && style in professionalStyles.ball) return 'ball';
    if (professionalStyles.tactical && style in professionalStyles.tactical) return 'tactical';
  }

  return 'basic';
};

/**
 * Get all available styles for a category
 */
export const getStylesForCategory = (category: 'basic' | 'player' | 'ball' | 'tactical'): LineStyle[] => {
  const config = getConfig();
  
  if (category === 'basic') {
    // Get styles from contextual line configuration in .aigenrc
    const contextualConfig = config.settings.toolbar.contextual?.line;
    if (contextualConfig?.styles) {
      return contextualConfig.styles as LineStyle[];
    }
    
    // Fallback to default basic styles
    return ['straight', 'curved', 'straightArrow', 'curvedArrow', 'sineWave', 'sineWaveArrow'] as LineStyle[];
  }

  // Check for professional styles
  const contextualConfig = config.settings.toolbar.contextual?.line;
  if (contextualConfig?.categories) {
    const categoryConfig = contextualConfig.categories[category];
    if (categoryConfig && categoryConfig.styles) {
      return categoryConfig.styles as LineStyle[];
    }
  }

  return [];
};

/**
 * Validate if a line style exists in configuration
 */
export const isValidLineStyle = (style: string): style is LineStyle => {
  const config = getConfig();
  
  // Check styles from .aigenrc contextual configuration
  const contextualConfig = config.settings.toolbar.contextual?.line;
  if (contextualConfig?.styles && contextualConfig.styles.includes(style)) {
    return true;
  }

  // Check basic styles
  const basicStyles = ['straight', 'curved', 'straightArrow', 'curvedArrow', 'solidStraight', 'solidCurved'];
  if (basicStyles.includes(style)) return true;

  // Check professional styles
  const professionalStyles = config.settings.lineStyles.professionalStyles;
  if (professionalStyles) {
    for (const [categoryKey, categoryData] of Object.entries(professionalStyles)) {
      if (categoryData && typeof categoryData === 'object' && style in categoryData) {
        return true;
      }
    }
  }

  // Check legacy styles
  const legacyStyles = [
    'dashedCurved', 'dashedStraight', 'curvedArrow', 'straightArrow',
    'endMark', 'plusEnd', 'xEnd', 'dashedCurvedArrow', 'dashedStraightArrow',
    'sineWave', 'sineWaveArrow', 'fishHook', 'fishHookArrow',
    'hookStart', 'hookStartArrow', 'hookEnd', 'hookEndArrow'
  ];
  
  return legacyStyles.includes(style);
};
