import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Minus, Smile, ArrowRight, CornerDownRight, Palette, Waves, MoreHorizontal, TrendingUp, ArrowBigRight, ArrowUpRight, Move, Plus, X, Circle, Target, ArrowRightLeft
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { getConfig } from '../../lib/config';
import { LineStyle } from '../../types';
import { useAppTheme } from '../../providers/AppThemeProvider';
import { LineElement } from '../../@types/elements';
import { extractPathEndpoints, createLinePath, updateLineEndpoints } from '../../lib/line-utils';

interface ContextualLineToolbarProps {
  line: LineElement;
  updateElement: (updates: Partial<LineElement>) => void;
  isVisible: boolean;
}

const ContextualLineToolbar: React.FC<ContextualLineToolbarProps> = ({
  line,
  updateElement,
  isVisible
}) => {
  const config = getConfig();
  const { theme } = useAppTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!isVisible) return null;

  const contextualConfig = config.settings.toolbar.contextual?.line;
  const colors = config.settings.lineStyles.colors;
  const curveRange = config.settings.lineStyles.curveRange;
  const markerOptions = config.settings.lineStyles.markers || [];
  const nonCurvableStyles: LineStyle[] = []; // All line styles should support curve offset

  // Debug logging can be removed since fixes are implemented
  // console.log('ContextualLineToolbar render:', {
  //   isVisible,
  //   lineStyle: line.style,
  //   curveControlsIncluded: contextualConfig?.controls?.includes('curve'),
  //   isNonCurvable: nonCurvableStyles.includes(line.style),
  //   shouldShowCurve: contextualConfig?.controls?.includes('curve') && !nonCurvableStyles.includes(line.style)
  // });

  // Map string keys to Lucide icons
  const iconMap: { [key: string]: React.ElementType } = {
    Minus, Move, Plus, X, Target, Circle, ArrowRight
  };

  const endMarkerOptions = markerOptions.map((marker: { key: string | null; icon: string; label: string; }) => ({
    ...marker,
    icon: iconMap[marker.icon] || Minus
  }));

  // Complete line styles from .aigenrc baseStyles and combinations
  const lineStyles = [
    { key: 'solidStraight', icon: Minus, label: 'Hel rett linje', description: 'Rett linje mellom to punkter' },
    { key: 'solidCurved', icon: Smile, label: 'Hel kurvet linje', description: 'Kurvet linje med justerbar kurvatur' },
    { key: 'straightArrow', icon: ArrowRight, label: 'Rett pil', description: 'Rett linje med pil på slutten' },
    { key: 'curvedArrow', icon: CornerDownRight, label: 'Kurvet pil', description: 'Kurvet linje med pil på slutten' },
    { key: 'dashedStraight', icon: MoreHorizontal, label: 'Stiplet rett', description: 'Stiplet rett linje', dashed: true },
    { key: 'dashedCurved', icon: TrendingUp, label: 'Stiplet kurvet', description: 'Stiplet kurvet linje', dashed: true },
    { key: 'sineWave', icon: Waves, label: 'Sinusbølge', description: 'Bølgeformet linje' },
    { key: 'fishHook', icon: ArrowBigRight, label: 'Fiskekrok', description: 'Linje med krok på slutten' },
    { key: 'hook', icon: ArrowUpRight, label: 'Krok', description: 'Linje med krok i start eller slutt' }
  ];

  const availableStyles = contextualConfig?.styles || [
    'solidStraight', 'solidCurved', 'straightArrow', 'curvedArrow', 'dashedStraight', 'dashedCurved', 'sineWave', 'fishHook', 'hook'
  ];
  const filteredStyles = lineStyles.filter(style => availableStyles.includes(style.key));

  // Handlers for property changes
  const handleStyleChange = (newStyle: LineStyle) => {
    // If we are updating an existing line with a valid path, recalculate it
    if (line && line.path) {
      const endpoints = extractPathEndpoints(line.path);
      if (endpoints) {
        const newPath = createLinePath(endpoints.start, endpoints.end, newStyle, line.curveOffset || 0);
        updateElement({ style: newStyle, path: newPath });
        return;
      }
    }
    
    // If no line is selected or the path is invalid, just update the style (setting the default)
    updateElement({ style: newStyle });
  };

  const handleCurveOffsetChange = (newOffset: number) => {
    const endpoints = extractPathEndpoints(line.path);
    if (!endpoints) return;
    const newPath = updateLineEndpoints(line.path, line.style, endpoints.start, endpoints.end, newOffset);
    updateElement({ curveOffset: newOffset, path: newPath });
  };

  const handleColorChange = (color: string) => {
    updateElement({ color });
  };

  const handleMarkerChange = (marker: LineElement['marker']) => {
    updateElement({ marker });
  };

  // UI rendering
  return (
    <TooltipProvider delayDuration={0}>
      <div className="bg-white border-t border-gray-200 shadow-sm sticky bottom-0 z-10" style={{ borderTopColor: theme.secondaryColor + '30' }}>
        <div className="flex items-center gap-1 p-2 overflow-x-auto">
          {/* Style selector */}
          {contextualConfig?.controls?.includes('style') && (
            <>
              <div className="flex items-center gap-1 flex-shrink-0">
                {filteredStyles.map((style) => {
                  const IconComponent = style.icon;
                  const isActive = line.style === style.key;
                  return (
                    <Tooltip key={style.key}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => handleStyleChange(style.key as LineStyle)}
                          className="h-8 w-8 p-0"
                          style={{ backgroundColor: isActive ? theme.primaryColor : undefined, color: isActive ? 'white' : undefined }}
                        >
                          <IconComponent className="w-4 h-4" />
                          {style.dashed && (
                            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-orange-500" style={{ fontSize: '8px' }} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs bg-black/90 text-white border-0">
                        <div className="flex flex-col">
                          <p className="font-medium">{style.label}</p>
                          {style.description && <p className="text-gray-300 text-[10px]">{style.description}</p>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
              <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />
            </>
          )}

          {/* Curve control */}
          {contextualConfig?.controls?.includes('curve') && !nonCurvableStyles.includes(line.style) && (
            <>
              <div className="flex items-center gap-2 min-w-0 flex-shrink-0 bg-gray-50 rounded px-2 py-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Waves className="w-4 h-4 text-gray-600" />
                      <label htmlFor="curve-slider" className="text-xs font-medium text-gray-600 whitespace-nowrap select-none">Kurve</label>
                      <input
                        id="curve-slider"
                        type="range"
                        min={curveRange.min}
                        max={curveRange.max}
                        step={curveRange.step}
                        value={line.curveOffset || 0}
                        onChange={(e) => handleCurveOffsetChange(Number(e.target.value))}
                        className="w-24 h-3 bg-gray-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs text-gray-700 w-8 text-center tabular-nums font-mono">{line.curveOffset || 0}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs bg-black/90 text-white border-0">
                    <div className="flex flex-col">
                      <p className="font-medium">Juster kurvatur</p>
                      <p className="text-gray-300 text-[10px]">Verdi: {line.curveOffset || 0} (Område: {curveRange.min} til {curveRange.max})</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />
            </>
          )}

          {/* Color controls */}
          {contextualConfig?.controls?.includes('color') && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {colors.slice(0, 6).map((color: any) => (
                <Tooltip key={color.name}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleColorChange(color.value === 'custom' ? line.color || '#000000' : color.value)}
                      className="w-6 h-6 rounded-full border-2 transition-all hover:border-gray-400"
                      style={{
                        backgroundColor: color.value === 'custom' ? line.color || '#000000' : color.value,
                        borderColor: (line.color || '#000000') === (color.value === 'custom' ? line.color || '#000000' : color.value) ? theme.primaryColor : '#d1d5db'
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs bg-black/90 text-white border-0">{color.name}</TooltipContent>
                </Tooltip>
              ))}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showColorPicker ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="h-6 w-6 p-0"
                  >
                    <Palette className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs bg-black/90 text-white border-0">Egendefinert farge</TooltipContent>
              </Tooltip>
              {showColorPicker && (
                <input
                  type="color"
                  value={line.color || '#000000'}
                  onChange={(e) => {
                    handleColorChange(e.target.value);
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded border-0 cursor-pointer"
                  style={{ backgroundColor: 'transparent' }}
                />
              )}
            </div>
          )}

          {/* Marker controls */}
          {contextualConfig?.controls?.includes('marker') && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {endMarkerOptions.map((marker: { key: string | null; icon: React.ElementType; label: string; }) => {
                const IconComponent = marker.icon;
                const isActive = line.marker === marker.key;
                return (
                  <Tooltip key={String(marker.key)}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleMarkerChange(marker.key as LineElement['marker'])}
                        className="h-8 w-8 p-0"
                        style={{ backgroundColor: isActive ? theme.primaryColor : undefined, color: isActive ? 'white' : undefined }}
                      >
                        <IconComponent className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs bg-black/90 text-white border-0">
                      <div className="flex flex-col">
                        <p className="font-medium">{marker.label}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ContextualLineToolbar;
