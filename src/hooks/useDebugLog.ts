import { useEffect } from 'react';
import { FootballElement, Tool } from '../@types/elements';

export const useDebugLog = (
  tool: Tool,
  elements: FootballElement[],
  frames: any[],
  currentFrame: number
) => {
  useEffect(() => {
    console.log('🔄 STATE CHANGE:', {
      timestamp: new Date().toISOString(),
      tool,
      elementsCount: elements.length,
      framesCount: frames.length,
      currentFrame,
      currentFrameElements: frames[currentFrame]?.elements?.length || 0
    });
  }, [tool, elements.length, frames.length, currentFrame]);

  useEffect(() => {
    if (elements.length > 0) {
      console.log('📋 ALL ELEMENTS:', elements.map(el => ({
        id: el.id,
        type: el.type,
        x: el.x,
        y: el.y,
        visible: el.visible
      })));
    }
  }, [elements]);

  // Log clicks globally
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      console.log('🌍 GLOBAL CLICK:', {
        x: e.clientX,
        y: e.clientY,
        target: e.target,
        tool
      });
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [tool]);
};