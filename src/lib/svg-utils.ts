import { PitchType } from '../@types/elements';

export interface Coordinates {
  x: number;
  y: number;
}

export interface PitchDimensions {
  width: number;
  height: number;
  viewBox: string;
}

// Add coordinate caching for performance during drag operations
const coordinateCache = new Map<string, { coords: Coordinates; timestamp: number }>();
const CACHE_DURATION = 100; // Cache for 100ms for better cache hits during rapid mouse movements
const SHOULD_CACHE_COORDINATES = process.env.NODE_ENV !== 'test';

/**
 * Helper to validate SVG coordinates
 */
export const isValidCoordinate = (value: number): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Konverterer klientkoordinater til SVG-koordinater
 * Robust implementation that handles all edge cases
 */
export function getSVGCoordinates(
  clientX: number, 
  clientY: number, 
  svgElement: SVGSVGElement | null
): Coordinates {
  // Early return for invalid input
  if (!svgElement || typeof clientX !== 'number' || typeof clientY !== 'number') {
    return { x: 0, y: 0 };
  }

  // Check for NaN or infinite values
  if (!isFinite(clientX) || !isFinite(clientY)) {
    return { x: 0, y: 0 };
  }

  // Create cache key for this calculation - handle missing getAttribute safely
  // Round coordinates more aggressively for better cache hits
  const roundedClientX = Math.round(clientX * 4) / 4; // Round to nearest 0.25
  const roundedClientY = Math.round(clientY * 4) / 4; // Round to nearest 0.25
  const viewBoxForCache = (svgElement.getAttribute && svgElement.getAttribute('viewBox')) || 'default';
  const cacheKey = `${roundedClientX}-${roundedClientY}-${viewBoxForCache}`;
  let now: number | null = null;

  if (SHOULD_CACHE_COORDINATES) {
    now = Date.now();
    const cached = coordinateCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return cached.coords;
    }
  }
  
  const rect = svgElement.getBoundingClientRect && svgElement.getBoundingClientRect();
  
  // Handle missing getBoundingClientRect or invalid rect
  if (!rect || typeof rect.width !== 'number' || typeof rect.height !== 'number') {
    return { x: 0, y: 0 };
  }
  
  // Handle zero or negative dimensions
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: clientX, y: clientY };
  }
  
  // Try native SVG transformation first (browser environment)
  if (typeof svgElement.createSVGPoint === 'function') {
    try {
      const point = svgElement.createSVGPoint();
      point.x = clientX;
      point.y = clientY;
      
      const ctm = svgElement.getScreenCTM();
      if (ctm) {
        const transformedPoint = point.matrixTransform(ctm.inverse());          // Validate the result and round for better cache hits
          if (isFinite(transformedPoint.x) && isFinite(transformedPoint.y)) {
            const result = { 
              x: Math.round(transformedPoint.x * 100) / 100, // Round to 2 decimal places
              y: Math.round(transformedPoint.y * 100) / 100  // Round to 2 decimal places
            };

            if (SHOULD_CACHE_COORDINATES) {
              coordinateCache.set(cacheKey, { coords: result, timestamp: now ?? Date.now() });
            }

            return result;
          }
      }
    } catch (error) {
      // Fall through to manual calculation
    }
  }
  
  // Manual calculation fallback - optimized for performance
  const relativeX = clientX - rect.left;
  const relativeY = clientY - rect.top;
  
  // Default to element dimensions if no viewBox
  let viewBoxX = 0;
  let viewBoxY = 0;
  let viewBoxWidth = rect.width;
  let viewBoxHeight = rect.height;
  
  // Parse viewBox attribute if present - optimized version
  const viewBoxAttr = svgElement.getAttribute?.('viewBox');
  if (viewBoxAttr) {
    // Use faster parsing without regex
    const values = viewBoxAttr.trim().split(/\s+/);
    if (values.length === 4) {
      const x = parseFloat(values[0]);
      const y = parseFloat(values[1]);
      const w = parseFloat(values[2]);
      const h = parseFloat(values[3]);
      
      // Only update if all values are valid
      if (!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
        viewBoxX = x;
        viewBoxY = y;
        viewBoxWidth = w;
        viewBoxHeight = h;
      }
    }
  }
  
  // Calculate scale factors
  const scaleX = viewBoxWidth > 0 && rect.width > 0 ? viewBoxWidth / rect.width : 1;
  const scaleY = viewBoxHeight > 0 && rect.height > 0 ? viewBoxHeight / rect.height : 1;
  
  // Transform to SVG coordinate space
  const transformedX = viewBoxX + (relativeX * scaleX);
  const transformedY = viewBoxY + (relativeY * scaleY);
  
  // Final validation and result with rounding for better cache hits
  const result = {
    x: isFinite(transformedX) ? Math.round(transformedX * 100) / 100 : 0,
    y: isFinite(transformedY) ? Math.round(transformedY * 100) / 100 : 0
  };
  
  if (SHOULD_CACHE_COORDINATES) {
    coordinateCache.set(cacheKey, { coords: result, timestamp: now ?? Date.now() });

    // Clean up old cache entries periodically
    if (coordinateCache.size > 100) {
      const cleanupTimestamp = Date.now();
      coordinateCache.forEach((value, key) => {
        if (cleanupTimestamp - value.timestamp > 1000) { // Remove entries older than 1 second
          coordinateCache.delete(key);
        }
      });
    }
  }

  return result;
};

/**
 * Constrains coordinates to viewBox boundaries
 */
const constrainToViewBox = (coords: Coordinates, svgElement: SVGSVGElement): Coordinates => {
  const viewBoxAttr = svgElement.getAttribute('viewBox');
  if (!viewBoxAttr) return coords;
  
  const values = viewBoxAttr.trim().split(/\s+/);
  if (values.length !== 4) return coords;
  
  const [x, y, width, height] = values.map(parseFloat);
  if (values.some(value => isNaN(parseFloat(value)))) return coords;
  
  return {
    x: Math.max(x, Math.min(x + width, coords.x)),
    y: Math.max(y, Math.min(y + height, coords.y))
  };
};

/**
 * Henter dimensjoner for ulike banetyper
 */
export const getPitchDimensions = (pitch: PitchType): PitchDimensions => {
  let width: number, height: number;
  
  switch (pitch) {
    case 'full':
      width = 680;
      height = 1050;
      break;
    case 'fullLandscape':
      width = 1050;
      height = 680;
      break;
    case 'handball':
      width = 680;
      height = 340;
      break;
    case 'blankPortrait':
      width = 680;
      height = 1050;
      break;
    case 'blankLandscape':
      width = 1050;
      height = 680;
      break;
    case 'offensive':
      width = 680;
      height = 525;
      break;
    case 'defensive':
      width = 680;
      height = 525;
      break;
    default:
      width = 680;
      height = 525;
      break;
  }
  
  return {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`
  };
};

/**
 * Genererer en unik ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Beregner avstanden mellom to punkter
 * @param p1 Første punkt
 * @param p2 Andre punkt
 * @returns Avstand mellom punktene
 */
export const calculateDistance = (p1: Coordinates, p2: Coordinates): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Sjekker om et punkt er innenfor en sirkel
 */
export const isPointInCircle = (
  point: { x: number; y: number },
  circle: { x: number; y: number; radius: number }
): boolean => {
  const distance = calculateDistance(point, { x: circle.x, y: circle.y });
  return distance <= circle.radius;
};

/**
 * Sjekker om et punkt er innenfor et rektangel
 */
export const isPointInRect = (
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

/**
 * Beregner rotasjonsvinkel mellom to punkter
 */
export const calculateRotationAngle = (
  start: { x: number; y: number },
  end: { x: number; y: number }
): number => {
  return (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
};

/**
 * Oppretter en SVG-linjesti
 * @param points Array med punkter
 * @returns SVG-linjesti
 */
export const createLinePath = (points: Coordinates[]): string => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  
  return path;
};

/**
 * Oppretter en SVG-kurvesti med kontrollpunkter
 * @param points Array med punkter
 * @param curveOffset Offset for kontrollpunkter
 * @returns SVG-kurvesti
 */
export const createCurvePath = (points: Coordinates[], curveOffset: number = 30): string => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    
    // Beregn retningsvektor
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    
    // Normaliser og skaler med offset
    const length = Math.sqrt(dx * dx + dy * dy);
    const offsetX = (dx / length) * curveOffset;
    const offsetY = (dy / length) * curveOffset;
    
    // Kontrollpunkter
    const cp1x = current.x + offsetX;
    const cp1y = current.y + offsetY;
    const cp2x = next.x - offsetX;
    const cp2y = next.y - offsetY;
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }
  
  return path;
};

/**
 * Beregner endepunktet for en markør basert på linjens endepunkt og retning
 * @param path Linjens SVG-sti
 * @param markerLength Markørens lengde
 * @returns Endepunkt for markøren
 */
export const calculateMarkerEndpoint = (path: string, markerLength: number = 10): Coordinates => {
  const commands = path.trim().split(/([MLHVCSQTAZmlhvcsqtaz])/);
  
  if (commands.length < 2) return { x: 0, y: 0 };
  
  // Finn siste kommando
  const lastCommand = commands[commands.length - 1];
  const match = lastCommand.match(/[LM]\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
  
  if (!match) return { x: 0, y: 0 };
  
  const endX = parseFloat(match[1]);
  const endY = parseFloat(match[2]);
  
  // Finn nest siste punkt for å beregne retning
  let prevX = 0;
  let prevY = 0;
  
  if (commands.length > 2) {
    const prevCommand = commands[commands.length - 2];
    const prevMatch = prevCommand.match(/[LM]\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
    
    if (prevMatch) {
      prevX = parseFloat(prevMatch[1]);
      prevY = parseFloat(prevMatch[2]);
    }
  }
  
  // Beregn retningsvektor
  const dx = endX - prevX;
  const dy = endY - prevY;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) return { x: endX, y: endY };
  
  // Normaliser og skaler med markør lengde
  const unitX = dx / length;
  const unitY = dy / length;
  
  return {
    x: endX + unitX * markerLength,
    y: endY + unitY * markerLength
  };
};

/**
 * Helper to validate SVG coordinates
 */
export const validateCoordinates = (coords: Coordinates): Coordinates => {
  return {
    x: isFinite(coords.x) ? coords.x : 0,
    y: isFinite(coords.y) ? coords.y : 0
  };
};

/**
 * Helper to check if coordinates are within bounds
 */
export const isWithinBounds = (
  coords: Coordinates, 
  bounds: { width: number; height: number }
): boolean => {
  return (
    coords.x >= 0 && 
    coords.x <= bounds.width && 
    coords.y >= 0 && 
    coords.y <= bounds.height
  );
};
