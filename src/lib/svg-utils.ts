import { PitchType, LineElement } from '../@types/elements';

interface Point {
  x: number;
  y: number;
}

/**
 * Konverterer klientkoordinater til SVG-koordinater
 * @param clientX Klientens X-koordinat
 * @param clientY Klientens Y-koordinat
 * @param svgElement SVG-elementet
 * @returns SVG-koordinater
 */
export const getSVGCoordinates = (
  clientX: number, 
  clientY: number, 
  svgElement: SVGSVGElement | null
): Point => {
  if (!svgElement) return { x: 0, y: 0 };
  
  const svgPoint = svgElement.createSVGPoint();
  svgPoint.x = clientX;
  svgPoint.y = clientY;
  
  const transformedPoint = svgPoint.matrixTransform(svgElement.getScreenCTM()?.inverse());
  return {
    x: transformedPoint.x,
    y: transformedPoint.y
  };
};

/**
 * Henter dimensjoner for ulike banetyper
 */
export const getPitchDimensions = (pitchType: PitchType): { width: number; height: number } => {
  switch (pitchType) {
    case 'full':
      return { width: 1050, height: 680 };
    case 'offensive':
      return { width: 525, height: 680 };
    case 'defensive':
      return { width: 525, height: 680 };
    case 'handball':
      return { width: 400, height: 200 };
    case 'fullLandscape':
      return { width: 1050, height: 680 };
    case 'blankPortrait':
      return { width: 680, height: 1050 };
    case 'blankLandscape':
      return { width: 1050, height: 680 };
    default:
      return { width: 1050, height: 680 };
  }
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
export const calculateDistance = (p1: Point, p2: Point): number => {
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
export const createLinePath = (points: Point[]): string => {
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
export const createCurvePath = (points: Point[], curveOffset: number = 30): string => {
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
export const calculateMarkerEndpoint = (path: string, markerLength: number = 10): Point => {
  const commands = path.trim().split(/(?=[MLHVCSQTAZmlhvcsqtaz])/);
  
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
  
  // Normaliser og skaler
  const length = Math.sqrt(dx * dx + dy * dy);
  const normalizedX = dx / length;
  const normalizedY = dy / length;
  
  return {
    x: endX + normalizedX * markerLength,
    y: endY + normalizedY * markerLength
  };
}; 