import { useCallback, useRef, useEffect, useState } from 'react';
import { TraceElement, FootballElement, LineElement, TraceCurveType, Frame } from '../@types/elements';
import { createLinePathMemoized } from '../lib/line-utils';
import { getTracesConfig, TracesConfig } from '../lib/config';

interface UseTraceManagerProps {
  showTraces: boolean;
  curveOffset: number;
}

/**
 * Map TraceCurveType preset til faktisk curveOffset-verdi.
 * Disse verdiene gir visuelt distinkte kurver uten å være for ekstreme.
 */
const CURVE_TYPE_OFFSETS: Record<TraceCurveType, number> = {
  'straight': 0,
  // Merk: SVG-koordinater har Y nedover. For en bevegelse "fremover" betyr negativ offset
  // at kurven bøyer mot venstre (mot klokka) relativt til retningen start→slutt.
  'arc-left': -35,
  'arc-right': 35,
  's-curve': 25  // S-curve bruker positiv offset, men rendres annerledes
};

/**
 * Beregn effektivt curveOffset basert på trace-innstillinger.
 * Prioritet: curveType preset > individuelt curveOffset > globalt curveOffset
 */
export const getEffectiveCurveOffset = (
  curveType: TraceCurveType | undefined,
  individualOffset: number | undefined,
  globalOffset: number
): number => {
  if (curveType) {
    if (curveType === 'straight') {
      return 0;
    }
    return CURVE_TYPE_OFFSETS[curveType];
  }
  if (typeof individualOffset === 'number' && individualOffset !== 0) {
    return individualOffset;
  }
  return globalOffset;
};

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
    if (!props.showTraces) return null;
    const currentX = typeof element.x === 'number' ? element.x : null;
    const currentY = typeof element.y === 'number' ? element.y : null;
    if (currentX === null || currentY === null) return null;
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
      const currentX = element.x ?? lastPos.x;
      const currentY = element.y ?? lastPos.y;
      const distance = Math.sqrt(
        Math.pow(currentX - lastPos.x, 2) + 
        Math.pow(currentY - lastPos.y, 2)
      );
      
      // Minimum distance to create trace
      if (distance < 10) return null;

      const renderHints = inferLineRendering(styleConfig?.style);

      // Beregn effektivt curve offset basert på globale innstillinger
      // (per-trace curveType kan settes senere ved redigering)
      const effectiveOffset = props.curveOffset;
      const pathStyle = effectiveOffset !== 0 ? 'curved' : 'straight';

      // Create trace element
      const trace: TraceElement = {
        id: `trace-${elementId}-${Date.now()}`,
        type: 'trace',
        path: createLinePathMemoized(
          { x: lastPos.x, y: lastPos.y },
          { x: currentX, y: currentY },
          pathStyle,
          effectiveOffset
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
        x: currentX,
        y: currentY,
        visible: true,
        curveOffset: effectiveOffset,
        curveType: effectiveOffset === 0 ? 'straight' : undefined,  // Sett default basert på offset
        style: styleConfig?.style as TraceElement['style']
      };

      // Update position tracking
      lastPositions.current.set(elementId, {
        x: currentX,
        y: currentY,
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
        x: currentX,
        y: currentY,
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

  const rebuildTracesFromFrames = useCallback((frames: Frame[], globalCurveOffset?: number): TraceElement[] => {
    if (!props.showTraces) {
      clearTraces();
      return [];
    }

    // Reset internal state before rebuilding
    clearTraces();

    frames.forEach((frame, frameIndex) => {
      (frame?.elements || []).forEach((element) => {
        createTrace(
          element,
          frameIndex
        );
      });
    });

    // Override curve offsets globally if provided
    if (typeof globalCurveOffset === 'number') {
      traceHistory.current.forEach((traceList, elementId) => {
        const updatedList = traceList.map((trace) => ({
          ...trace,
          curveOffset: trace.curveOffset ?? globalCurveOffset,
          curveType: trace.curveType ?? (globalCurveOffset === 0 ? 'straight' : trace.curveType)
        }));
        traceHistory.current.set(elementId, updatedList);
      });
    }

    const updated = getTraces();
    setTraces(updated);
    return updated;
  }, [clearTraces, createTrace, getTraces, props.showTraces]);

  const updateTrace = useCallback((traceId: string, updates: Partial<TraceElement>): TraceElement | null => {
    let updatedTrace: TraceElement | null = null;

    traceHistory.current.forEach((traceList, elementId) => {
      let changed = false;
      const nextList = traceList.map((trace) => {
        if (trace.id !== traceId) return trace;
        changed = true;
        updatedTrace = { ...trace, ...updates } as TraceElement;
        return updatedTrace;
      });

      if (changed) {
        traceHistory.current.set(elementId, nextList);
      }
    });

    if (updatedTrace) {
      setTraces((prev) => prev.map((trace) => (trace.id === traceId ? updatedTrace as TraceElement : trace)));
    }

    return updatedTrace;
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
    createTrace,
    updateTrace,
    rebuildTracesFromFrames
  };
};
