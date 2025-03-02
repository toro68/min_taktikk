import React from 'react';
import { Slider } from './ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export type LineStyle = 
  | 'solidCurved'
  | 'dashedCurved'
  | 'solidStraight'
  | 'dashedStraight'
  | 'curvedArrow'
  | 'straightArrow'
  | 'endMark'
  | 'plusEnd'
  | 'xEnd'
  | 'dashedCurvedArrow'
  | 'dashedStraightArrow';

interface LineStyleSelectorProps {
  lineStyleOptions: { value: LineStyle; label: string; preview: React.ReactElement; }[];
  selectedLineStyle: LineStyle;
  setSelectedLineStyle: (style: LineStyle) => void;
  curveOffset: number;
  setCurveOffset: (offset: number) => void;
  // Funksjonen for å hente linjeegenskaper (for eksempel om den er kurvet)
  getLineProperties: (style: LineStyle) => { 
    curved: boolean; 
    dashed: boolean; 
    marker: 'arrow' | 'endline' | 'plus' | 'xmark' | 'redArrow' | 'blueArrow' | 'greenArrow' | 'orangeArrow' | 'purpleArrow' | null 
  };
  tool: string;
}

const LineStyleSelector: React.FC<LineStyleSelectorProps> = ({
  lineStyleOptions,
  selectedLineStyle,
  setSelectedLineStyle,
  curveOffset,
  setCurveOffset,
  getLineProperties,
  tool
}) => {
  const { curved } = getLineProperties(selectedLineStyle);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="p-4 border rounded bg-white mb-4">
        <h3 className="text-sm font-semibold mb-2">Linjestil</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {lineStyleOptions.map(option => (
            <Tooltip key={option.value}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSelectedLineStyle(option.value)}
                  className={`flex flex-col items-center p-2 border rounded hover:bg-gray-50 ${
                    selectedLineStyle === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="w-full flex justify-center mb-1">
                    {option.preview}
                  </div>
                  <span className="text-xs">{option.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                <div className="flex flex-col">
                  <p className="text-[10px] font-medium">{option.label}</p>
                  <p className="text-[9px] text-gray-300">Klikk for å velge stil</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        {(curved || tool === 'select') && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Kurvatur:</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1">
                  <Slider
                    value={[curveOffset]}
                    onValueChange={([val]) => setCurveOffset(val)}
                    min={-300}
                    max={300}
                    step={1}
                    className="w-32"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                <div className="flex flex-col">
                  <p className="text-[10px] font-medium">Juster kurvatur: {curveOffset}px</p>
                  <p className="text-[9px] text-gray-300">Dra for å endre (-300 til 300)</p>
                </div>
              </TooltipContent>
            </Tooltip>
            <span className="text-xs tabular-nums w-8">{curveOffset}px</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default LineStyleSelector; 