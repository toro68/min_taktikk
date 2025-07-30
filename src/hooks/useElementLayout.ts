import { useMemo } from 'react';
import { Frame, FootballElement } from '../@types/elements';

export const useElementLayout = (
  frames: Frame[],
  currentFrame: number,
  progress: number,
  interpolatedElements: FootballElement[]
) => {
  
  const elementsToRender = useMemo(() => {
    // If we have interpolated elements (during animation), use those
    if (interpolatedElements.length > 0) {
      return interpolatedElements;
    }
    
    // Otherwise, use current frame elements
    const currentFrameElements = frames[currentFrame]?.elements || [];
    return currentFrameElements;
  }, [frames, currentFrame, interpolatedElements]);

  return {
    elementsToRender
  };
};