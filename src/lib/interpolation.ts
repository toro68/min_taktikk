/**
 * Advanced interpolation utilities for smooth football animations
 */

/**
 * Linear interpolation function (Lerp)
 * @param startValue - Starting value
 * @param endValue - Ending value  
 * @param progress - Progress from 0.0 to 1.0
 * @returns Interpolated value
 */
export function lerp(startValue: number, endValue: number, progress: number): number {
  return startValue + (endValue - startValue) * progress;
}

/**
 * Smooth step interpolation (ease-in-out)
 * Provides a more natural, curved interpolation
 * @param startValue - Starting value
 * @param endValue - Ending value
 * @param progress - Progress from 0.0 to 1.0
 * @returns Smoothly interpolated value
 */
export function smoothStep(startValue: number, endValue: number, progress: number): number {
  // Smooth curve: 3t² - 2t³
  const smoothProgress = progress * progress * (3 - 2 * progress);
  return lerp(startValue, endValue, smoothProgress);
}

/**
 * Ease-in interpolation (slow start, fast end)
 */
export function easeIn(startValue: number, endValue: number, progress: number): number {
  const easeProgress = progress * progress;
  return lerp(startValue, endValue, easeProgress);
}

/**
 * Ease-out interpolation (fast start, slow end)  
 */
export function easeOut(startValue: number, endValue: number, progress: number): number {
  const easeProgress = 1 - (1 - progress) * (1 - progress);
  return lerp(startValue, endValue, easeProgress);
}

/**
 * Interpolate rotation taking into account shortest path
 * Handles 360° wraparound correctly
 */
export function lerpRotation(startAngle: number, endAngle: number, progress: number): number {
  // Normalize angles to [0, 360)
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;
  
  const start = normalizeAngle(startAngle);
  const end = normalizeAngle(endAngle);
  
  // Calculate shortest path
  let delta = end - start;
  if (delta > 180) {
    delta -= 360;
  } else if (delta < -180) {
    delta += 360;
  }
  
  return normalizeAngle(start + delta * progress);
}

/**
 * Interpolate opacity with clamping
 */
export function lerpOpacity(startOpacity: number, endOpacity: number, progress: number): number {
  const result = lerp(startOpacity, endOpacity, progress);
  return Math.max(0, Math.min(1, result)); // Clamp to [0, 1]
}

/**
 * Interpolation types for different animation styles
 */
export type InterpolationType = 'linear' | 'smooth' | 'easeIn' | 'easeOut';

/**
 * Get interpolation function by type
 */
export function getInterpolationFunction(type: InterpolationType): typeof lerp {
  switch (type) {
    case 'smooth': return smoothStep;
    case 'easeIn': return easeIn;
    case 'easeOut': return easeOut;
    case 'linear':
    default: return lerp;
  }
}
