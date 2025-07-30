import { useCallback, useRef, useEffect } from 'react';
import { TraceElement, FootballElement } from '../@types/elements';
import { createLinePath } from '../lib/line-utils';

interface UseTraceManagerProps {
  showTraces: boolean;
  curveOffset: number;
}

export const useTraceManager = (props: UseTraceManagerProps) => {
  const traceHistory = useRef<Map<string, TraceElement[]>>(new Map());
  const lastPositions = useRef<Map<string, { x: number; y: number; frame: number }>>(new Map());

  const createTrace = useCallback((
    element: FootballElement,
    currentFrame: number
  ): TraceElement | null => {
    if (!props.showTraces || !element.x || !element.y) return null;
    if (!['player', 'opponent', 'ball'].includes(element.type)) return null;

    const elementId = element.id;
    const lastPos = lastPositions.current.get(elementId);

    // Check if element moved enough to create new trace
    if (lastPos) {
      const distance = Math.sqrt(
        Math.pow(element.x - lastPos.x, 2) + 
        Math.pow(element.y - lastPos.y, 2)
      );
      
      // Minimum distance to create trace
      if (distance < 10) return null;

      // Create trace element
      const trace: TraceElement = {
        id: `trace-${elementId}-${Date.now()}`,
        type: 'trace',
        path: createLinePath(
          { x: lastPos.x, y: lastPos.y },
          { x: element.x, y: element.y },
          props.curveOffset !== 0 ? 'curved' : 'straight',
          props.curveOffset
        ),
        elementId,
        elementType: element.type as 'player' | 'opponent' | 'ball',
        opacity: 0.25,
        timestamp: Date.now(),
        frameStart: lastPos.frame,
        frameEnd: currentFrame,
        color: element.color || '#8b94a1',
        thickness: element.type === 'ball' ? 1 : 1,
        dashed: true,
        x: element.x,
        y: element.y,
        visible: true,
        curveOffset: props.curveOffset
      };

      // Update position tracking
      lastPositions.current.set(elementId, {
        x: element.x,
        y: element.y,
        frame: currentFrame
      });

      // Store trace in history
      const existingTraces = traceHistory.current.get(elementId) || [];
      // Keep only last 20 traces per element
      const updatedTraces = [...existingTraces, trace].slice(-20);
      traceHistory.current.set(elementId, updatedTraces);

      return trace;
    } else {
      // First position for this element
      lastPositions.current.set(elementId, {
        x: element.x,
        y: element.y,
        frame: currentFrame
      });
      return null;
    }
  }, [props]);

  const getTraces = useCallback((): TraceElement[] => {
    if (!props.showTraces) return [];

    const allTraces: TraceElement[] = [];
    traceHistory.current.forEach((traces) => {
      allTraces.push(...traces);
    });
    return allTraces;
  }, [props.showTraces]);

  const clearTraces = useCallback(() => {
    traceHistory.current.clear();
    lastPositions.current.clear();
  }, []);

  const updateTraces = useCallback((
    elements: FootballElement[],
    currentFrame: number
  ): TraceElement[] => {
    // Create new traces for moved elements
    elements.forEach(element => {
      createTrace(element, currentFrame);
    });

    return getTraces();
  }, [createTrace, getTraces]);

  return {
    updateTraces,
    getTraces,
    clearTraces,
    createTrace
  };
};