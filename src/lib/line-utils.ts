import { LineElement } from '../@types/elements';
import { LineStyle } from '../components/LineStyleSelector';

/**
 * Oppretter en linjesti mellom to punkter
 */
export const createLinePath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  curved: boolean,
  offset = 0
): string => {
  if (!curved) {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Beregn normal vektor
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  
  const normalX = -dy / length;
  const normalY = dx / length;

  // Beregn kontrollpunkt med offset
  const controlX = midX + normalX * offset;
  const controlY = midY + normalY * offset;

  return `M ${start.x} ${start.y} Q ${controlX} ${controlY}, ${end.x} ${end.y}`;
};

/**
 * Beregner et punkt på en kubisk Bezier-kurve
 */
export const getCubicBezierPoint = (
  t: number,
  start: { x: number; y: number },
  end: { x: number; y: number },
  offset: number
): { x: number; y: number } => {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Beregn normal vektor
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) {
    return { x: start.x, y: start.y };
  }
  
  const normalX = -dy / length;
  const normalY = dx / length;

  // Beregn kontrollpunkt med offset
  const controlX = midX + normalX * offset;
  const controlY = midY + normalY * offset;

  // Kvadratisk Bezier-formel: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  
  const x = uu * start.x + 2 * u * t * controlX + tt * end.x;
  const y = uu * start.y + 2 * u * t * controlY + tt * end.y;
  
  return { x, y };
};

/**
 * Flytter en sti med gitte delta-verdier
 */
export const translatePath = (d: string, dx: number, dy: number): string => {
  return d.replace(/([0-9.-]+) ([0-9.-]+)/g, (match, x, y) => {
    return `${parseFloat(x) + dx} ${parseFloat(y) + dy}`;
  });
};

/**
 * Sjekker om et punkt er nær en sti
 */
export const isPointNearPath = (point: { x: number; y: number }, path: string): boolean => {
  // Enkel implementasjon: Sjekk om punktet er nær endepunktene
  const matches = path.match(/M ([0-9.-]+) ([0-9.-]+).*?([0-9.-]+) ([0-9.-]+)$/);
  if (!matches) return false;

  const startX = parseFloat(matches[1]);
  const startY = parseFloat(matches[2]);
  const endX = parseFloat(matches[3]);
  const endY = parseFloat(matches[4]);

  const distToStart = Math.sqrt(
    Math.pow(point.x - startX, 2) + Math.pow(point.y - startY, 2)
  );
  const distToEnd = Math.sqrt(
    Math.pow(point.x - endX, 2) + Math.pow(point.y - endY, 2)
  );

  // Sjekk om punktet er nær linjens endepunkter
  if (distToStart < 10 || distToEnd < 10) return true;

  // For rette linjer, beregn avstand til linjesegmentet
  if (!path.includes('Q')) {
    const lineLength = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    if (lineLength === 0) return false;

    // Beregn avstand fra punkt til linje
    const t =
      ((point.x - startX) * (endX - startX) + (point.y - startY) * (endY - startY)) /
      (lineLength * lineLength);
    
    if (t < 0) {
      return distToStart < 10;
    }
    if (t > 1) {
      return distToEnd < 10;
    }
    
    const projX = startX + t * (endX - startX);
    const projY = startY + t * (endY - startY);
    const distance = Math.sqrt(
      Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2)
    );
    
    return distance < 10;
  }

  // For kurver, bruk en enkel tilnærming med flere punkter langs kurven
  const steps = 10;
  let minDist = Infinity;
  
  // Finn kontrollpunktet fra stien
  const qMatch = path.match(/Q ([0-9.-]+) ([0-9.-]+),/);
  if (!qMatch) return false;
  
  const controlX = parseFloat(qMatch[1]);
  const controlY = parseFloat(qMatch[2]);
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const x = u * u * startX + 2 * u * t * controlX + t * t * endX;
    const y = u * u * startY + 2 * u * t * controlY + t * t * endY;
    
    const dist = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
    minDist = Math.min(minDist, dist);
  }
  
  return minDist < 10;
};

/**
 * Henter egenskaper for en linjestil
 */
export const getLineProperties = (style: LineStyle, color: string = 'black') => {
  let strokeDasharray = 'none';
  let strokeWidth = 2;
  let strokeColor = color;
  let curved = false;
  let dashed = false;
  let marker: 'arrow' | 'endline' | 'plus' | 'xmark' | 'redArrow' | 'blueArrow' | 'greenArrow' | 'orangeArrow' | 'purpleArrow' | null = null;
  
  switch (style) {
    case 'solidCurved':
      curved = true;
      break;
    case 'dashedCurved':
      curved = true;
      dashed = true;
      strokeDasharray = '5,5';
      break;
    case 'solidStraight':
      curved = false;
      break;
    case 'dashedStraight':
      curved = false;
      dashed = true;
      strokeDasharray = '5,5';
      break;
    case 'curvedArrow':
      curved = true;
      marker = 'arrow';
      break;
    case 'straightArrow':
      curved = false;
      marker = 'arrow';
      break;
    case 'endMark':
      curved = false;
      marker = 'endline';
      break;
    case 'plusEnd':
      curved = false;
      marker = 'plus';
      break;
    case 'xEnd':
      curved = false;
      marker = 'xmark';
      break;
    case 'dashedCurvedArrow':
      curved = true;
      dashed = true;
      strokeDasharray = '5,5';
      marker = 'arrow';
      break;
    case 'dashedStraightArrow':
      curved = false;
      dashed = true;
      strokeDasharray = '5,5';
      marker = 'arrow';
      break;
  }
  
  // Hvis fargen er spesifisert, bruk riktig pil basert på fargen
  if (marker === 'arrow') {
    if (color === 'red') {
      marker = 'redArrow';
    } else if (color === 'blue') {
      marker = 'blueArrow';
    } else if (color === 'green') {
      marker = 'greenArrow';
    } else if (color === 'orange') {
      marker = 'orangeArrow';
    } else if (color === 'purple') {
      marker = 'purpleArrow';
    }
  }
  
  return {
    curved,
    dashed,
    marker,
    strokeDasharray,
    strokeWidth,
    strokeColor
  };
};