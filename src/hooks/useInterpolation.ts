import { useEffect } from 'react';
import { FootballElement, Frame, TraceElement } from '../@types/elements';
import { lerp, lerpOpacity, lerpRotation, smoothStep, InterpolationType } from '../lib/interpolation';
import { extractPathEndpoints } from '../lib/line-utils';
import { getEffectiveCurveOffset } from './useTraceManager';
import { debugLog } from '../lib/debug';

interface UseInterpolationProps {
  currentFrame: number;
  progress: number;
  frames: Frame[];
  setInterpolatedElements: React.Dispatch<React.SetStateAction<FootballElement[]>>;
  showTraces?: boolean;
  traceCurveOffset?: number;
  interpolationType?: InterpolationType; // New: configurable interpolation type
  enablePathFollowing?: boolean;
  traces?: TraceElement[];
}

export const useInterpolation = (props: UseInterpolationProps) => {
  useEffect(() => {
    const { currentFrame, progress, frames, interpolationType = 'smooth', enablePathFollowing, traces = [], traceCurveOffset = 0 } = props;
    const shouldFollowPath = Boolean(enablePathFollowing || props.showTraces);
    const currentFrameData = frames[currentFrame];
    
    if (!currentFrameData) {
      props.setInterpolatedElements([]);
      return;
    }
    
    let elements: FootballElement[] = [...currentFrameData.elements];

    // Advanced interpolation between frames
    if (progress > 0 && progress < 1 && currentFrame < frames.length - 1) {
      const nextFrameData = frames[currentFrame + 1];
      debugLog('🔍 Interpolation check:', {
        currentFrame,
        progress,
        maxFrame: frames.length - 1,
        willInterpolate: currentFrame < frames.length - 1,
        nextFrameExists: !!nextFrameData
      });
      
      if (nextFrameData) {
        const nextElementMap = new Map(
          nextFrameData.elements.map(el => [el.id, el])
        );

        elements = elements.map(currentElement => {
          const nextElement = nextElementMap.get(currentElement.id);
          if (!nextElement) return currentElement;

          // Use smooth interpolation for more natural movement
          const interpolationFunc = interpolationType === 'smooth' ? smoothStep : lerp;
          
          // Interpolate position (with safe defaults; preserve 0)
          const currentX = typeof currentElement.x === 'number' ? currentElement.x : 0;
          const currentY = typeof currentElement.y === 'number' ? currentElement.y : 0;
          const nextX = typeof nextElement.x === 'number' ? nextElement.x : 0;
          const nextY = typeof nextElement.y === 'number' ? nextElement.y : 0;
          
          // DEBUG: Log interpolation calculation for first element
          if (elements.indexOf(currentElement) === 0 && progress < 0.1) {
            debugLog('🔢 INTERPOLATION CALC:', {
              elementId: currentElement.id,
              currentPos: { x: currentX, y: currentY },
              nextPos: { x: nextX, y: nextY },
              progress,
              willInterpolateTo: {
                x: interpolationFunc(currentX, nextX, progress),
                y: interpolationFunc(currentY, nextY, progress)
              }
            });
          }
          
          const resolvedTrace = shouldFollowPath
            ? traces
                .filter((trace) =>
                  trace.elementId === currentElement.id &&
                  typeof trace.frameStart === 'number' &&
                  typeof trace.frameEnd === 'number' &&
                  trace.frameStart <= currentFrame &&
                  trace.frameEnd >= currentFrame + 1
                )
                .sort((a, b) => {
                  const aIsExact = a.frameStart === currentFrame && a.frameEnd === currentFrame + 1 ? 0 : 1;
                  const bIsExact = b.frameStart === currentFrame && b.frameEnd === currentFrame + 1 ? 0 : 1;
                  if (aIsExact !== bIsExact) {
                    return aIsExact - bIsExact;
                  }

                  const aSpan = (a.frameEnd as number) - (a.frameStart as number);
                  const bSpan = (b.frameEnd as number) - (b.frameStart as number);
                  return aSpan - bSpan;
                })[0]
            : undefined;

          const endpoints = resolvedTrace ? extractPathEndpoints(resolvedTrace.path) : null;
          const effectiveOffset = resolvedTrace ? getEffectiveCurveOffset(resolvedTrace.curveType, resolvedTrace.curveOffset, traceCurveOffset || 0) : 0;
          const traceProgress = (resolvedTrace && typeof resolvedTrace.frameStart === 'number' && typeof resolvedTrace.frameEnd === 'number' && resolvedTrace.frameEnd > resolvedTrace.frameStart)
            ? Math.min(
                1,
                Math.max(
                  0,
                  (currentFrame - resolvedTrace.frameStart + progress) /
                    (resolvedTrace.frameEnd - resolvedTrace.frameStart)
                )
              )
            : progress;
          const tNorm = interpolationFunc(0, 1, traceProgress);

          const sampleQuadraticPoint = () => {
            if (!endpoints) return { x: interpolationFunc(currentX, nextX, progress), y: interpolationFunc(currentY, nextY, progress) };

            const dx = endpoints.end.x - endpoints.start.x;
            const dy = endpoints.end.y - endpoints.start.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const perpX = -dy / len;
            const perpY = dx / len;
            const actualOffset = effectiveOffset || 50;
            const midX = (endpoints.start.x + endpoints.end.x) / 2;
            const midY = (endpoints.start.y + endpoints.end.y) / 2;
            const controlX = midX + perpX * actualOffset;
            const controlY = midY + perpY * actualOffset;

            const mt = 1 - tNorm;
            const quadX = mt * mt * endpoints.start.x + 2 * mt * tNorm * controlX + tNorm * tNorm * endpoints.end.x;
            const quadY = mt * mt * endpoints.start.y + 2 * mt * tNorm * controlY + tNorm * tNorm * endpoints.end.y;
            return { x: quadX, y: quadY };
          };

          const sampleSCurvePoint = () => {
            if (!endpoints) return { x: interpolationFunc(currentX, nextX, progress), y: interpolationFunc(currentY, nextY, progress) };

            const dx = endpoints.end.x - endpoints.start.x;
            const dy = endpoints.end.y - endpoints.start.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const perpX = -dy / len;
            const perpY = dx / len;
            const cp1 = {
              x: endpoints.start.x + dx * 0.33 + perpX * effectiveOffset,
              y: endpoints.start.y + dy * 0.33 + perpY * effectiveOffset
            };
            const cp2 = {
              x: endpoints.start.x + dx * 0.66 - perpX * effectiveOffset,
              y: endpoints.start.y + dy * 0.66 - perpY * effectiveOffset
            };

            const mt = 1 - tNorm;
            const bezX = mt * mt * mt * endpoints.start.x + 3 * mt * mt * tNorm * cp1.x + 3 * mt * tNorm * tNorm * cp2.x + tNorm * tNorm * tNorm * endpoints.end.x;
            const bezY = mt * mt * mt * endpoints.start.y + 3 * mt * mt * tNorm * cp1.y + 3 * mt * tNorm * tNorm * cp2.y + tNorm * tNorm * tNorm * endpoints.end.y;
            return { x: bezX, y: bezY };
          };

          const curvePoint = (resolvedTrace && endpoints)
            ? (effectiveOffset !== 0
                ? (resolvedTrace.curveType === 's-curve' ? sampleSCurvePoint() : sampleQuadraticPoint())
                : {
                    x: interpolationFunc(endpoints.start.x, endpoints.end.x, progress),
                    y: interpolationFunc(endpoints.start.y, endpoints.end.y, progress)
                  })
            : {
                x: interpolationFunc(currentX, nextX, progress),
                y: interpolationFunc(currentY, nextY, progress)
              };

          const interpolatedX = curvePoint.x;
          const interpolatedY = curvePoint.y;

          // Interpolate additional properties if they exist (using type guards)
          let interpolatedElement = {
            ...currentElement,
            x: interpolatedX,
            y: interpolatedY
          };

          // Interpolate rotation for text elements
          if (currentElement.type === 'text' && nextElement.type === 'text' && 
              typeof currentElement.rotation === 'number' && typeof nextElement.rotation === 'number') {
            (interpolatedElement as any).rotation = lerpRotation(currentElement.rotation, nextElement.rotation, progress);
          }

          // Interpolate opacity for area and trace elements
          if ((currentElement.type === 'area' || currentElement.type === 'trace') && 
              (nextElement.type === 'area' || nextElement.type === 'trace') &&
              typeof (currentElement as any).opacity === 'number' && typeof (nextElement as any).opacity === 'number') {
            (interpolatedElement as any).opacity = lerpOpacity((currentElement as any).opacity, (nextElement as any).opacity, progress);
          }

          // Interpolate text fontSize for text elements
          if (currentElement.type === 'text' && nextElement.type === 'text' &&
              typeof currentElement.fontSize === 'number' && typeof nextElement.fontSize === 'number') {
            (interpolatedElement as any).fontSize = interpolationFunc(currentElement.fontSize, nextElement.fontSize, progress);
          }

          // Interpolate area dimensions
          if (currentElement.type === 'area' && nextElement.type === 'area') {
            (interpolatedElement as any).width = interpolationFunc(
              currentElement.width, nextElement.width, progress
            );
            (interpolatedElement as any).height = interpolationFunc(
              currentElement.height, nextElement.height, progress
            );
          }

          return interpolatedElement;
        });
      }
    } else {
      // DEBUG: Log why interpolation is not happening
      if (progress > 0 && progress < 1) {
        debugLog('🚫 Interpolation skipped:', {
          currentFrame,
          progress,
          reason: currentFrame >= frames.length - 1 ? 'Last frame' : 'Progress out of range',
          totalFrames: frames.length
        });
      }
    }

    props.setInterpolatedElements(elements);
    
    // 🎬 DEBUG: Log interpolation activity
    if (progress > 0 && progress < 1) {
      debugLog('🎬 Smooth interpolation active:', {
        currentFrame,
        progress: progress.toFixed(3),
        interpolationType,
        elementsCount: elements.length,
        frameTransition: `${currentFrame} → ${currentFrame + 1}`,
        interpolatedPositions: elements.slice(0, 2).map(el => ({ 
          id: el.id, 
          type: el.type,
          x: el.x?.toFixed(1), 
          y: el.y?.toFixed(1) 
        })),
        sourceFrames: {
          current: currentFrameData.elements.slice(0, 2).map(el => ({ 
            id: el.id, 
            x: el.x?.toFixed(1), 
            y: el.y?.toFixed(1) 
          })),
          next: frames[currentFrame + 1]?.elements.slice(0, 2).map(el => ({ 
            id: el.id, 
            x: el.x?.toFixed(1), 
            y: el.y?.toFixed(1) 
          }))
        }
      });
    }
  }, [
    props.currentFrame,
    props.progress,
    props.frames,
    props.interpolationType,
    props.enablePathFollowing,
    props.traces,
    props.traceCurveOffset,
    props.showTraces
  ]);
};
