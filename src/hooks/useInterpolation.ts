import { useEffect } from 'react';
import { FootballElement, Frame } from '../@types/elements';

interface UseInterpolationProps {
  currentFrame: number;
  progress: number;
  frames: Frame[];
  setInterpolatedElements: React.Dispatch<React.SetStateAction<FootballElement[]>>;
  showTraces?: boolean;
  traceCurveOffset?: number;
}

export const useInterpolation = (props: UseInterpolationProps) => {
  useEffect(() => {
    const { currentFrame, progress, frames } = props;
    const currentFrameData = frames[currentFrame];
    
    if (!currentFrameData) {
      props.setInterpolatedElements([]);
      return;
    }
    
    let elements: FootballElement[] = [...currentFrameData.elements];

    // Basic interpolation between frames
    if (progress > 0 && progress < 1 && currentFrame < frames.length - 1) {
      const nextFrameData = frames[currentFrame + 1];
      if (nextFrameData) {
        const nextElementMap = new Map(
          nextFrameData.elements.map(el => [el.id, el])
        );

        elements = elements.map(currentElement => {
          const nextElement = nextElementMap.get(currentElement.id);
          if (!nextElement) return currentElement;

          // Linear interpolation for position (with safe defaults)
          const currentX = currentElement.x || 0;
          const currentY = currentElement.y || 0;
          const nextX = nextElement.x || 0;
          const nextY = nextElement.y || 0;
          
          const interpolatedX = currentX + (nextX - currentX) * progress;
          const interpolatedY = currentY + (nextY - currentY) * progress;

          return {
            ...currentElement,
            x: interpolatedX,
            y: interpolatedY
          };
        });
      }
    }

    props.setInterpolatedElements(elements);
  }, [props.currentFrame, props.progress, props.frames]);
};