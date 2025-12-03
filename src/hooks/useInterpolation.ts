import { useEffect } from 'react';
import { FootballElement, Frame } from '../@types/elements';
import { lerp, lerpOpacity, lerpRotation, smoothStep, InterpolationType } from '../lib/interpolation';
import { debugLog } from '../lib/debug';

interface UseInterpolationProps {
  currentFrame: number;
  progress: number;
  frames: Frame[];
  setInterpolatedElements: React.Dispatch<React.SetStateAction<FootballElement[]>>;
  showTraces?: boolean;
  traceCurveOffset?: number;
  interpolationType?: InterpolationType; // New: configurable interpolation type
}

export const useInterpolation = (props: UseInterpolationProps) => {
  useEffect(() => {
    const { currentFrame, progress, frames, interpolationType = 'smooth' } = props;
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
          
          // Interpolate position (with safe defaults)
          const currentX = currentElement.x || 0;
          const currentY = currentElement.y || 0;
          const nextX = nextElement.x || 0;
          const nextY = nextElement.y || 0;
          
          // DEBUG: Log interpolation calculation for first element
          if (elements.indexOf(currentElement) === 0 && progress < 0.1) {
            console.log('🔢 INTERPOLATION CALC:', {
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
          
          const interpolatedX = interpolationFunc(currentX, nextX, progress);
          const interpolatedY = interpolationFunc(currentY, nextY, progress);

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
  }, [props.currentFrame, props.progress, props.frames, props.interpolationType]);
};