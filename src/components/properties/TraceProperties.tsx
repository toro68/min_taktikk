import React from 'react';
import { TraceElement, TraceCurveType } from '../../@types/elements';
import { Slider } from '../ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { createLinePathMemoized, createSCurvePath, extractPathEndpoints } from '../../lib/line-utils';
import { getEffectiveCurveOffset } from '../../hooks/useTraceManager';

interface TracePropertiesProps {
  trace: TraceElement;
  updateElement: (updates: Partial<TraceElement>) => void;
  globalCurveOffset: number;
}

/**
 * Kurvepresets med visuell forhåndsvisning.
 * Verdiene samsvarer med CURVE_TYPE_OFFSETS i useTraceManager.
 */
const CURVE_PRESETS: Array<{
  key: TraceCurveType;
  label: string;
  description: string;
  preview: React.ReactElement;
}> = [
  {
    key: 'straight',
    label: 'Rett',
    description: 'Direkte linje mellom punkter',
    preview: (
      <svg width="40" height="24" viewBox="0 0 40 24">
        <path d="M 4 12 L 36 12" stroke="currentColor" fill="none" strokeWidth="2" />
        <circle cx="36" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'arc-left',
    label: 'Bue venstre',
    description: 'Kurve som bøyer mot venstre',
    preview: (
      <svg width="40" height="24" viewBox="0 0 40 24">
        <path d="M 4 18 Q 20 2, 36 18" stroke="currentColor" fill="none" strokeWidth="2" />
        <circle cx="36" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'arc-right',
    label: 'Bue høyre',
    description: 'Kurve som bøyer mot høyre',
    preview: (
      <svg width="40" height="24" viewBox="0 0 40 24">
        <path d="M 4 6 Q 20 22, 36 6" stroke="currentColor" fill="none" strokeWidth="2" />
        <circle cx="36" cy="6" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 's-curve',
    label: 'S-kurve',
    description: 'Myk S-formet bane',
    preview: (
      <svg width="40" height="24" viewBox="0 0 40 24">
        <path d="M 4 18 Q 14 4, 20 12 Q 26 20, 36 6" stroke="currentColor" fill="none" strokeWidth="2" />
        <circle cx="36" cy="6" r="2" fill="currentColor" />
      </svg>
    ),
  },
];

const TraceProperties: React.FC<TracePropertiesProps> = ({ trace, updateElement, globalCurveOffset }) => {
  const currentCurveType = trace.curveType || 'straight';
  const currentOffset = trace.curveOffset ?? globalCurveOffset ?? 0;
  const color = trace.color || '#2563eb';
  const opacity = trace.opacity || 0.25;

  /**
   * Oppdater kurvetype og regenerer path.
   */
  const handleCurveTypeChange = (newType: TraceCurveType) => {
    // Ekstraher start/slutt fra eksisterende path
    const endpoints = extractPathEndpoints(trace.path);
    if (!endpoints) {
      // Kan ikke regenerere path uten koordinater
      updateElement({ curveType: newType });
      return;
    }

    const { start, end } = endpoints;
    const effectiveOffset = getEffectiveCurveOffset(newType, trace.curveOffset, globalCurveOffset);
    const pathStyle = effectiveOffset !== 0 ? 'curved' : 'straight';

    const newPath = (newType === 's-curve' && effectiveOffset !== 0)
      ? createSCurvePath(start, end, effectiveOffset)
      : createLinePathMemoized(start, end, pathStyle, effectiveOffset);

    updateElement({
      curveType: newType,
      curveOffset: effectiveOffset,
      path: newPath,
    });
  };

  /**
   * Oppdater opacity
   */
  const handleOpacityChange = (value: number[]) => {
    updateElement({ opacity: value[0] / 100 });
  };

  return (
    <div className="p-3 space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Sporinnstillinger
      </h3>

      {/* Curve Type Selector */}
      <div className="space-y-2">
        <label className="text-xs text-gray-500 dark:text-gray-400">Kurvetype</label>
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-1">
            {CURVE_PRESETS.map((preset) => (
              <Tooltip key={preset.key}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleCurveTypeChange(preset.key)}
                    className={`
                      p-2 rounded border transition-colors
                      ${currentCurveType === preset.key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="text-gray-700 dark:text-gray-300">
                      {preset.preview}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <p className="font-medium">{preset.label}</p>
                  <p className="text-gray-500">{preset.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-500 dark:text-gray-400">Synlighet</label>
          <span className="text-xs text-gray-400">{Math.round(opacity * 100)}%</span>
        </div>
        <Slider
          value={[opacity * 100]}
          onValueChange={handleOpacityChange}
          min={10}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Color indicator */}
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded border border-gray-300"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Farge arves fra element ({trace.elementType})
        </span>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
        <p>Element: {trace.elementId}</p>
        {trace.frameStart !== undefined && trace.frameEnd !== undefined && (
          <p>Frame {trace.frameStart} → {trace.frameEnd}</p>
        )}
      </div>
    </div>
  );
};

export default TraceProperties;
