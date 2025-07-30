import React from 'react';
import { LineElement } from '../../@types/elements';
import { LineStyle } from '../../types';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { getLineProperties, createLinePath, updateLineEndpoints, extractPathEndpoints, getCurveRangeFromConfig } from '../../lib/line-utils';
import { getLineStylesConfig } from '../../lib/config';

interface LinePropertiesProps {
  line: LineElement;
  updateElement: (updates: Partial<LineElement>) => void;
}

const LineProperties: React.FC<LinePropertiesProps> = ({ line, updateElement }) => {
  // Provide default values for optional properties
  const color = line.color || '#000000';
  const dashed = line.dashed || false;
  const marker = line.marker || null;
  const curveOffset = line.curveOffset || 0;
  const style = line.style || 'solidStraight';

  // Get line styles configuration from .aigenrc
  const lineStylesConfig = getLineStylesConfig();
  const curveRange = getCurveRangeFromConfig();

  // Get available line styles from config
  const availableStyles: Array<{key: LineStyle, label: string, preview: React.ReactElement}> = [
    {
      key: 'straight',
      label: 'Rett linje',
      preview: (
        <svg width="30" height="20" viewBox="0 0 30 20">
          <path d="M 5 10 L 25 10" stroke="black" fill="none" strokeWidth="2" />
        </svg>
      )
    },
    {
      key: 'curved',
      label: 'Kurvet linje',
      preview: (
        <svg width="30" height="20" viewBox="0 0 30 20">
          <path d="M 5 15 Q 15 5, 25 15" stroke="black" fill="none" strokeWidth="2" />
        </svg>
      )
    },
    {
      key: 'sineWave',
      label: 'Sinusbølge',
      preview: (
        <svg width="30" height="20" viewBox="0 0 30 20">
          <path d="M 5 10 Q 10 5, 15 10 Q 20 15, 25 10" stroke="black" fill="none" strokeWidth="2" />
        </svg>
      )
    },
    {
      key: 'fishHook',
      label: 'Fiskekrok',
      preview: (
        <svg width="30" height="20" viewBox="0 0 30 20">
          <path d="M 5 10 L 20 10 Q 25 10, 25 15" stroke="black" fill="none" strokeWidth="2" />
        </svg>
      )
    },
    {
      key: 'hook',
      label: 'Krok',
      preview: (
        <svg width="30" height="20" viewBox="0 0 30 20">
          <path d="M 5 10 L 15 10 Q 20 10, 20 15 L 20 17" stroke="black" fill="none" strokeWidth="2" />
        </svg>
      )
    }
  ];

  // Available colors from .aigenrc
  const availableColors = lineStylesConfig.colors || [
    { key: 'black', label: 'Svart', value: '#000000' },
    { key: 'red', label: 'Rød', value: '#ff0000' },
    { key: 'blue', label: 'Blå', value: '#0000ff' },
    { key: 'green', label: 'Grønn', value: '#008000' },
    { key: 'orange', label: 'Oransje', value: '#ffa500' },
    { key: 'purple', label: 'Lilla', value: '#800080' },
    { key: 'yellow', label: 'Gul', value: '#ffff00' },
  ];

  // Available end markers from .aigenrc
  const availableMarkers: Array<{key: LineElement['marker'], label: string, icon: string}> = [
    { key: null, label: 'Ingen', icon: 'none' },
    { key: 'arrow', label: 'Pil', icon: '→' },
    { key: 'endline', label: 'Endestrek', icon: '|' },
    { key: 'plus', label: 'Pluss', icon: '+' },
    { key: 'xmark', label: 'Kryss', icon: '×' },
    { key: 'target', label: 'Mål', icon: '⊙' },
    { key: 'circle', label: 'Sirkel', icon: '○' }
  ];

  // Handle style changes and update path accordingly
  const handleStyleChange = (newStyle: LineStyle) => {
    const endpoints = extractPathEndpoints(line.path);
    if (!endpoints) return;

    const newPath = createLinePath(endpoints.start, endpoints.end, newStyle, curveOffset);
    updateElement({ 
      style: newStyle, 
      path: newPath 
    });
  };

  // Handle curve offset changes and update path accordingly
  const handleCurveOffsetChange = (newOffset: number) => {
    const endpoints = extractPathEndpoints(line.path);
    if (!endpoints) return;

    const newPath = updateLineEndpoints(line.path, style, endpoints.start, endpoints.end, newOffset);
    updateElement({ 
      curveOffset: newOffset, 
      path: newPath 
    });
  };

  // All line styles should support curves according to requirements
  const supportsCurves = true;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="p-4 bg-white border-t">
        <h3 className="text-sm font-medium mb-3">Linjeegenskaper</h3>
        
        <div className="space-y-4">
          {/* Line Style Selector - Compact design from .aigenrc */}
          <div>
            <label className="text-sm mb-2 block font-medium">Linjestil</label>
            <div className="grid grid-cols-2 gap-2">
              {availableStyles.map(styleOption => (
                <Tooltip key={styleOption.key}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleStyleChange(styleOption.key)}
                      className={`flex flex-col items-center p-2 border rounded hover:bg-gray-50 transition-colors ${
                        style === styleOption.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="w-full flex justify-center mb-1">
                        {styleOption.preview}
                      </div>
                      <span className="text-xs text-center">{styleOption.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-medium">{styleOption.label}</p>
                      <p className="text-[9px] text-gray-300">Klikk for å velge stil</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Curve Offset - Only show for curved lines */}
          {supportsCurves && (
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Kurvatur</label>
                <span className="text-xs tabular-nums">{curveOffset}px</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mt-2">
                    <Slider 
                      value={[curveOffset]} 
                      min={curveRange.min} 
                      max={curveRange.max} 
                      step={curveRange.step}
                      onValueChange={([value]) => handleCurveOffsetChange(value)}
                      className="w-full"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-medium">Juster kurvatur: {curveOffset}px</p>
                    <p className="text-[9px] text-gray-300">Dra for å endre ({curveRange.min} til {curveRange.max})</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Color Selector */}
          <div>
            <label className="text-sm mb-2 block font-medium">Linjefarge</label>
            <div className="flex flex-wrap gap-1">
              {availableColors.map(colorOption => (
                <Tooltip key={colorOption.key}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => updateElement({ color: colorOption.value })}
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        color === colorOption.value ? 'border-blue-500 scale-110' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: colorOption.value }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-medium">{colorOption.label}</p>
                      <p className="text-[9px] text-gray-300">{colorOption.value}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
              {/* Custom color picker */}
              <div className="flex items-center">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => updateElement({ color: e.target.value })}
                  className="w-8 h-8 rounded border cursor-pointer"
                  title="Egendefinert farge"
                />
              </div>
            </div>
          </div>

          {/* End Markers */}
          <div>
            <label className="text-sm mb-2 block font-medium">Slutt-markør</label>
            <div className="grid grid-cols-4 gap-1">
              {availableMarkers.map(markerOption => (
                <Tooltip key={markerOption.key || 'none'}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => updateElement({ marker: markerOption.key })}
                      className={`flex items-center justify-center h-8 border rounded transition-colors ${
                        marker === markerOption.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-mono">{markerOption.icon}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-medium">{markerOption.label}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Dashed Toggle */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Stiplet linje</label>
              <Button
                variant={dashed ? "default" : "outline"}
                size="sm"
                onClick={() => updateElement({ dashed: !dashed })}
                className="h-8"
              >
                {dashed ? 'På' : 'Av'}
              </Button>
            </div>
          </div>

          {/* Visibility Toggle */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Synlig</label>
              <Button
                variant={line.visible !== false ? "default" : "outline"}
                size="sm"
                onClick={() => updateElement({ visible: !(line.visible !== false) })}
                className="h-8"
              >
                {line.visible !== false ? 'Synlig' : 'Skjult'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LineProperties;
