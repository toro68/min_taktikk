import { useCallback, useRef, useEffect, useState } from 'react';
import { TraceElement, FootballElement, LineElement } from '../@types/elements';
import { createLinePathMemoized } from '../lib/line-utils';
import { getTracesConfig, TracesConfig } from '../lib/config';

interface UseTraceManagerProps {
  showTraces: boolean;
  curveOffset: number;
}

export const useTraceManager = (props: UseTraceManagerProps) => {
  const traceHistory = useRef<Map<string, TraceElement[]>>(new Map());
  const lastPositions = useRef<Map<string, { x: number; y: number; frame: number }>>(new Map());
  const lastFrameRef = useRef<number | null>(null);
  const [configuredStyles, setConfiguredStyles] = useState({
    player: { enabled: true, style: 'dashedStraightArrow', opacity: 0.7 },
    opponent: { enabled: true, style: 'dashedStraightArrow', opacity: 0.7 },
    ball: { enabled: true, style: 'solidStraight', opacity: 0.8 }
  });
  const [traces, setTraces] = useState<TraceElement[]>([]);

  // Keep trace style configuration in sync with .aigenrc settings
  useEffect(() => {
    try {
      const config = getTracesConfig();
      const features = (config as TracesConfig & { features?: any }).features || {};
      const playerCfg = features.playerTraces || {}; 
      const opponentCfg = features.opponentTraces || playerCfg;
      const ballCfg = features.ballTraces || {};

      setConfiguredStyles({
        player: {
          enabled: playerCfg.enabled !== false,
          style: playerCfg.style || 'dashedStraightArrow',
          opacity: typeof playerCfg.opacity === 'number' ? playerCfg.opacity : 0.7
        },
        opponent: {
          enabled: opponentCfg.enabled !== false,
          style: opponentCfg.style || playerCfg.style || 'dashedStraightArrow',
          opacity: typeof opponentCfg.opacity === 'number'
            ? opponentCfg.opacity
            : (typeof playerCfg.opacity === 'number' ? playerCfg.opacity : 0.7)
        },
        ball: {
          enabled: ballCfg.enabled !== false,
          style: ballCfg.style || 'solidStraight',
          opacity: typeof ballCfg.opacity === 'number' ? ballCfg.opacity : 0.8
        }
      });
    } catch (error) {
      console.warn('TraceManager: failed to read trace config, using defaults', error);
    }
  }, []);

  const inferLineRendering = (styleKey?: string): { dashed: boolean; marker?: LineElement['marker'] } => {
    const normalized = styleKey?.toLowerCase() || '';
    return {
      dashed: normalized.includes('dashed') || normalized.includes('dot'),
      marker: normalized.includes('arrow') ? 'arrow' : undefined
    };
  };

  const createTrace = useCallback((
    element: FootballElement,
    currentFrame: number
  ): TraceElement | null => {
    if (!props.showTraces || !element.x || !element.y) return null;
    if (!['player', 'opponent', 'ball'].includes(element.type)) return null;

    const elementId = element.id;
    const lastPos = lastPositions.current.get(elementId);
    const typeKey = element.type === 'opponent' ? 'opponent' : (element.type === 'player' ? 'player' : 'ball');
    const styleConfig = configuredStyles[typeKey as 'player' | 'opponent' | 'ball'];
    if (styleConfig && styleConfig.enabled === false) {
      return null;
    }

    // Check if element moved enough to create new trace
    if (lastPos) {
      const distance = Math.sqrt(
        Math.pow(element.x - lastPos.x, 2) + 
        Math.pow(element.y - lastPos.y, 2)
      );
      
      // Minimum distance to create trace
      if (distance < 10) return null;

      const renderHints = inferLineRendering(styleConfig?.style);

      // Create trace element
      const trace: TraceElement = {
        id: `trace-${elementId}-${Date.now()}`,
        type: 'trace',
        path: createLinePathMemoized(
          { x: lastPos.x, y: lastPos.y },
          { x: element.x, y: element.y },
          props.curveOffset !== 0 ? 'curved' : 'straight',
          props.curveOffset
        ),
        elementId,
        elementType: element.type as 'player' | 'opponent' | 'ball',
        opacity: typeof styleConfig?.opacity === 'number' ? styleConfig.opacity : 0.25,
        timestamp: Date.now(),
        frameStart: lastPos.frame,
        frameEnd: currentFrame,
        color: element.color || (element.type === 'ball' ? '#f97316' : '#2563eb'),
        thickness: element.type === 'ball' ? 1.5 : 1,
        dashed: renderHints.dashed,
        marker: renderHints.marker,
        x: element.x,
        y: element.y,
        visible: true,
        curveOffset: props.curveOffset,
        style: styleConfig?.style as TraceElement['style']
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
  }, [props.showTraces, props.curveOffset, configuredStyles]);

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
    lastFrameRef.current = null;
    setTraces([]);
  }, []);

  const updateTraces = useCallback((
    elements: FootballElement[],
    currentFrame: number
  ): TraceElement[] => {
    if (lastFrameRef.current !== null && currentFrame < lastFrameRef.current) {
      traceHistory.current.clear();
      lastPositions.current.clear();
    }

    // Create new traces for moved elements
    elements.forEach(element => {
      createTrace(element, currentFrame);
    });

    const updated = getTraces();
    lastFrameRef.current = currentFrame;
    setTraces(updated);
    return updated;
  }, [createTrace, getTraces]);

  return {
    traces,
    updateTraces,
    getTraces,
    clearTraces,
    createTrace
  };
};
