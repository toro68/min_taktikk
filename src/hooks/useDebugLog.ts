import { useEffect } from 'react';
import { FootballElement, Tool } from '../@types/elements';
import { debugLog } from '../lib/debug';

export const useDebugLog = (
  tool: Tool,
  elements: FootballElement[],
  frames: any[],
  currentFrame: number
) => {
  useEffect(() => {
    debugLog('🔄 STATE CHANGE:', {
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
      debugLog('📋 ALL ELEMENTS:', elements.map(el => ({
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
      debugLog('🌍 GLOBAL CLICK:', {
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