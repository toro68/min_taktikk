import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";

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
  | 'dashedStraightArrow'
  | 'sineWave'
  | 'sineWaveArrow'
  | 'fishHook'
  | 'fishHookArrow'
  | 'hookStart'
  | 'hookStartArrow'
  | 'hookEnd'
  | 'hookEndArrow';

export interface LineProperties {
  curved: boolean;
  dashed: boolean;
  sineWave: boolean;
  fishHook: boolean;
  hookStart: boolean;
  hookEnd: boolean;
  marker: 'arrow' | 'endline' | 'plus' | 'xmark' | 'redArrow' | 'blueArrow' | 'greenArrow' | 'orangeArrow' | 'purpleArrow' | null;
  strokeColor: string;
  curveOffset?: number;
}

interface LineStyleSelectorProps {
  selectedStyle?: LineStyle;
  onStyleChange?: (style: LineStyle) => void;
  // De nye propsene som ToolSelector prøver å sende
  lineStyleOptions?: { value: LineStyle; label: string; preview: React.ReactElement }[]; // Endre Element til React.ReactElement
  selectedLineStyle?: LineStyle;
  setSelectedLineStyle?: (style: LineStyle) => void;
  curveOffset?: number;
  setCurveOffset?: (offset: number) => void;
  getLineProperties?: (style: LineStyle) => LineProperties; // Proper type instead of any
  tool?: string;
}

export const LineStyleSelector: React.FC<LineStyleSelectorProps> = ({
  selectedStyle,
  onStyleChange,
  selectedLineStyle,
  setSelectedLineStyle,
  lineStyleOptions
}) => {
  // Bruk selectedLineStyle hvis det finnes, ellers selectedStyle
  const currentStyle = selectedLineStyle || selectedStyle || 'solidCurved';
  const handleChange = setSelectedLineStyle || onStyleChange;

  // Bruk lineStyleOptions hvis tilgjengelig, ellers default styles
  const stylesToUse = lineStyleOptions || [];

  if (!stylesToUse.length) {
    return null; // Don't render if no options
  }

  return (
    <div className="flex items-center gap-1 p-2 bg-white border-t">
      <span className="text-xs text-gray-600 mr-2">Linjestil:</span>
      <div className="flex items-center gap-1">
        {stylesToUse.map((style) => (
          <Tooltip key={style.value}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleChange?.(style.value)}
                className={`
                  w-8 h-8 border rounded-lg flex items-center justify-center transition-colors
                  ${currentStyle === style.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                <div className="w-6 h-4 flex items-center justify-center">
                  {style.preview}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {style.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default LineStyleSelector;