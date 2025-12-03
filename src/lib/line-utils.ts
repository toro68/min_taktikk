import { LineStyle, BaseLineStyle, LineStyleConfig, LineStyleModifiers, Coordinates } from '../types';
import { getLineStylesConfig, getTracesConfig } from './config';
import { legacyToNewStyle } from '../constants/lineStyles';
import { getLinePropertiesFromStyle } from './lineStyleUtils';

// Simple memoization cache for createLinePath
const pathCache = new Map<string, string>();
let cacheHits = 0;
let cacheMisses = 0;

/**
 * Creates a cache key for path generation
 */
const createPathCacheKey = (
  start: Coordinates,
  end: Coordinates,
  style: LineStyle | boolean,
  offset: number
): string => {
  // Round coordinates to 2 decimal places to avoid cache misses from tiny floating point differences
  const startX = Math.round(start.x * 100) / 100;
  const startY = Math.round(start.y * 100) / 100;
  const endX = Math.round(end.x * 100) / 100;
  const endY = Math.round(end.y * 100) / 100;
  const roundedOffset = Math.round(offset * 100) / 100;
  
  const styleStr = typeof style === 'boolean' ? (style ? 'curved' : 'straight') : style;
  return `${startX},${startY}-${endX},${endY}-${styleStr}-${roundedOffset}`;
};

/**
 * Henter linjeegenskaper basert på ny LineStyleConfig
 */
export const getLinePropertiesFromConfig = (config: LineStyleConfig, color: string = '#000000', curveOffset: number = 0) => {
  const props = {
    curved: config.base === 'curved',
    dashed: config.modifiers.dashed || false,
    sineWave: config.base === 'sineWave',
    fishHook: config.base === 'fishHook',
    hookStart: config.base === 'hook' && config.modifiers.hookDirection === 'left',
    hookEnd: config.base === 'hook' && config.modifiers.hookDirection === 'right',
    marker: null as "arrow" | "endline" | "plus" | "xmark" | "redArrow" | "blueArrow" | "greenArrow" | "orangeArrow" | "purpleArrow" | "target" | "circle" | "doubleArrow" | "smallArrow" | null,
    strokeColor: color,
    curveOffset
  };

  // Set marker based on modifiers
  if (config.modifiers.arrow) {
    props.marker = 'arrow';
  } else if (config.modifiers.endMarker && config.modifiers.endMarker !== 'none') {
    // Map endMarker values to valid marker types
    const markerMap: Record<string, typeof props.marker> = {
      'circle': 'circle',
      'square': 'plus' // Map square to plus as a placeholder
    };
    props.marker = markerMap[config.modifiers.endMarker] || 'circle';
  }

  return props;
};

/**
 * Henter linjeegenskaper basert på valgt linjestil
 */
export const getLineProperties = (style: LineStyle, color: string = '#000000', curveOffset: number = 0) => {
  // Use the new style utilities directly
  const properties = getLinePropertiesFromStyle(style);
  return {
    ...properties,
    strokeColor: color,
    curveOffset
  };
};

/**
 * Oppretter SVG-sti for linje basert på stil og offset
 */
const SHOULD_LOG = process.env.NODE_ENV === 'development';
const logLinePath = (message: string, data?: any) => {
  if (!SHOULD_LOG) return;
  if (data) {
    console.log(message, data);
  } else {
    console.log(message);
  }
};

export const createLinePath = (
  start: Coordinates,
  end: Coordinates,
  style: LineStyle | boolean,
  offset: number = 0
): string => {
  // Handle both LineStyle and boolean (for backward compatibility)
  let actualStyle: LineStyle;
  if (typeof style === 'boolean') {
    actualStyle = style ? 'curved' : 'straight';
  } else {
    actualStyle = style;
  }
  
  // Use config-based path generation
  const properties = getLinePropertiesFromStyle(actualStyle);
  
  logLinePath('🎨 createLinePath called:', {
    style: actualStyle,
    properties,
    offset,
    willCreateCurved: properties.curved || Math.abs(offset) > 0
  });
  
  if (properties.sineWave) {
    return createSineWavePath(start, end, offset);
  }
  
  if (properties.fishHook) {
    return createFishHookPath(start, end, offset);
  }
  
  if (properties.hookStart || properties.hookEnd) {
    return createHookPath(start, end, offset, properties.hookEnd);
  }
  
  // Create curved path if explicitly curved OR if offset is applied
  // Exception: Don't apply curve to special line types that have their own path logic
  if ((properties.curved || Math.abs(offset) > 0) && !properties.sineWave && !properties.fishHook && !properties.hookStart && !properties.hookEnd) {
    return createCurvedPath(start, end, offset);
  }
  
  return createStraightPath(start, end);
};

/**
 * Memoized version of createLinePath for performance optimization
 * Use this instead of createLinePath in frequently called contexts like traces and previews
 */
export const createLinePathMemoized = (
  start: Coordinates,
  end: Coordinates,
  style: LineStyle | boolean,
  offset: number = 0
): string => {
  const cacheKey = createPathCacheKey(start, end, style, offset);
  
  // Check cache first
  if (pathCache.has(cacheKey)) {
    cacheHits++;
    logLinePath('🎨 createLinePathMemoized CACHE HIT:', { 
      key: cacheKey,
      cacheHits, 
      cacheMisses, 
      cacheSize: pathCache.size,
      hitRate: `${((cacheHits / (cacheHits + cacheMisses)) * 100).toFixed(1)}%`
    });
    return pathCache.get(cacheKey)!;
  }
  
  // Generate path if not cached
  cacheMisses++;
  logLinePath('🎨 createLinePathMemoized CACHE MISS:', { 
    key: cacheKey,
    start: `${start.x.toFixed(2)},${start.y.toFixed(2)}`,
    end: `${end.x.toFixed(2)},${end.y.toFixed(2)}`,
    style,
    offset,
    cacheHits, 
    cacheMisses, 
    cacheSize: pathCache.size 
  });
  const path = createLinePath(start, end, style, offset);
  
  // Cache the result (with size limit to prevent memory leaks)
  if (pathCache.size > 1000) {
    // Clear oldest entries when cache gets too large
    const firstKey = pathCache.keys().next().value;
    if (firstKey) {
      pathCache.delete(firstKey);
      logLinePath('🧹 Cache cleanup: removed oldest entry', firstKey);
    }
  }
  
  pathCache.set(cacheKey, path);
  return path;
};

/**
 * Get cache statistics for debugging performance
 */
export const getCacheStats = () => {
  const hitRate = cacheHits + cacheMisses > 0 ? (cacheHits / (cacheHits + cacheMisses) * 100).toFixed(1) : '0';
  return {
    hits: cacheHits,
    misses: cacheMisses,
    size: pathCache.size,
    hitRate: `${hitRate}%`
  };
};

/**
 * Clear the cache (useful for testing)
 */
export const clearPathCache = () => {
  pathCache.clear();
  cacheHits = 0;
  cacheMisses = 0;
};

/**
 * Oppretter rett linje
 */
const createStraightPath = (start: Coordinates, end: Coordinates): string => {
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
};

/**
 * Oppretter kurvet linje
 */
const createCurvedPath = (start: Coordinates, end: Coordinates, offset: number): string => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return `M ${start.x} ${start.y}`;

  // Use default offset of 50 if offset is 0 (to ensure curves are actually curved)
  const actualOffset = offset || 50;

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  // Perpendicular vector for curve control point
  const perpX = -dy / length;
  const perpY = dx / length;
  
  const controlX = midX + perpX * actualOffset;
  const controlY = midY + perpY * actualOffset;

  return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
};

/**
 * Oppretter sinus-bølge sti med kort bølgelengde
 */
const createSineWavePath = (start: Coordinates, end: Coordinates, offset: number): string => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lineLength = Math.sqrt(dx * dx + dy * dy);
  
  if (lineLength === 0) return `M ${start.x} ${start.y}`;
  
  // Beregn amplitude basert på offset eller bruk default - mindre bølgehøyde
  const amplitude = Math.abs(offset) || 8;
  
  // Kortere bølgelengde - flere sykluser per linje
  const wavelength = 25; // Pixels per wave cycle (redusert fra 40 til 25)
  const numWaves = Math.max(1, lineLength / wavelength);
  const segments = Math.ceil(numWaves * 6); // 6 segments per wave for smooth curves
  
  // Retningsvektor og perpendikulær vektor
  const unitX = dx / lineLength;
  const unitY = dy / lineLength;
  const perpX = -unitY; // Perpendikulær retning
  const perpY = unitX;
  
  let path = `M ${start.x} ${start.y}`;
  
  // Generer punkter langs linjen med sinusbølge
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    
    // Posisjon langs hovedlinjen
    const baseX = start.x + dx * t;
    const baseY = start.y + dy * t;
    
    // Sinusbølge offset perpendikylært til linjen
    const wavePhase = t * numWaves * 2 * Math.PI;
    const waveOffset = Math.sin(wavePhase) * amplitude;
    
    // Endelig posisjon med bølgeoffset
    const x = baseX + perpX * waveOffset;
    const y = baseY + perpY * waveOffset;
    
    // Bruk line-to for enkel sine wave
    path += ` L ${x} ${y}`;
  }
  
  return path;
};

/**
 * Oppretter fiskehetekrok sti
 */
const createFishHookPath = (start: Coordinates, end: Coordinates, offset: number): string => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const hookLength = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;
  
  const midX = start.x + dx * 0.8;
  const midY = start.y + dy * 0.8;
  
  const hookEndX = end.x;
  const hookEndY = end.y - hookLength;
  
  return `M ${start.x} ${start.y} L ${midX} ${midY} Q ${end.x} ${end.y}, ${hookEndX} ${hookEndY}`;
};

/**
 * Oppretter hook sti (buet i start eller slutt)
 */
const createHookPath = (start: Coordinates, end: Coordinates, offset: number, hookAtEnd: boolean): string => {
  // Use default offset of 30 if offset is 0 (to ensure hooks are actually curved)
  const actualOffset = offset || 30;
  
  if (hookAtEnd) {
    const cp1x = start.x + (end.x - start.x) * 0.7;
    const cp1y = start.y + (end.y - start.y) * 0.7;
    return `M ${start.x} ${start.y} Q ${cp1x} ${cp1y + actualOffset}, ${end.x} ${end.y}`;
  } else {
    const cp1x = start.x + (end.x - start.x) * 0.3;
    const cp1y = start.y + (end.y - start.y) * 0.3;
    return `M ${start.x} ${start.y} Q ${cp1x} ${cp1y + actualOffset}, ${end.x} ${end.y}`;
  }
};

/**
 * Oppdaterer en linjesti med nye endepunkter
 */
export const updateLineEndpoints = (
  originalPath: string,
  style: LineStyle,
  newStart?: Coordinates,
  newEnd?: Coordinates,
  curveOffset: number = 0
): string => {
  // Extract current endpoints
  const currentEndpoints = extractPathEndpoints(originalPath);
  if (!currentEndpoints) return originalPath;

  const startPoint = newStart || currentEndpoints.start;
  const endPoint = newEnd || currentEndpoints.end;

  // Recreate path with new endpoints
  return createLinePath(startPoint, endPoint, style, curveOffset);
};

/**
 * Henter start- og endepunkter fra en SVG-sti
 */
export const extractPathEndpoints = (pathString: string): { start: Coordinates; end: Coordinates } | null => {
  const commands = pathString.trim().split(/(?=[MLHVCSQTAZmlhvcsqtaz])/);
  if (commands.length < 2) return null;

  // Get start point (M command)
  const startMatch = commands[0].match(/M\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
  if (!startMatch) return null;

  // Get end point (last command)
  let endX = 0, endY = 0;
  for (let i = commands.length - 1; i >= 0; i--) {
    const cmd = commands[i];
    const coordMatch = cmd.match(/[MLCSQTA]\s*(?:[-\d\s.,]*\s+)?(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)(?:\s|$)/);
    if (coordMatch) {
      endX = parseFloat(coordMatch[1]);
      endY = parseFloat(coordMatch[2]);
      break;
    }
  }

  return {
    start: { x: parseFloat(startMatch[1]), y: parseFloat(startMatch[2]) },
    end: { x: endX, y: endY }
  };
};

/**
 * Checks if a point is near a line path (for selection)
 */
export const isPointNearLine = (
  point: { x: number; y: number },
  pathString: string,
  tolerance: number = 10
): boolean => {
  const endpoints = extractPathEndpoints(pathString);
  if (!endpoints) return false;

  // Simple distance check to line for now
  const { start, end } = endpoints;
  const lineLength = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  
  if (lineLength === 0) {
    return Math.sqrt((point.x - start.x) ** 2 + (point.y - start.y) ** 2) <= tolerance;
  }

  // Distance from point to line formula
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / (lineLength ** 2)));
  const projectionX = start.x + t * (end.x - start.x);
  const projectionY = start.y + t * (end.y - start.y);
  const distance = Math.sqrt((point.x - projectionX) ** 2 + (point.y - projectionY) ** 2);
  
  return distance <= tolerance;
};

/**
 * Get curve range settings from configuration
 */
export const getCurveRangeFromConfig = () => {
  try {
    const config = getLineStylesConfig();
    return config.curveRange;
  } catch (error) {
    console.warn('Using default curve range due to config error:', error);
    return { min: -400, max: 400, step: 10 };
  }
};

/**
 * Get trace curve range settings from configuration
 */
export const getTraceCurveRangeFromConfig = () => {
  try {
    const config = getTracesConfig();
    return config.curveRange;
  } catch (error) {
    console.warn('Using default trace curve range due to config error:', error);
    return { min: -400, max: 400, step: 10 };
  }
};
