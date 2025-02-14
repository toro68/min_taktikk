import React from 'react';
import { Slider } from './ui/slider';

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
  | 'dashedCurvedArrow';

interface LineStyleSelectorProps {
  lineStyleOptions: { value: LineStyle; label: string; preview: React.ReactElement; }[];
  selectedLineStyle: LineStyle;
  setSelectedLineStyle: (style: LineStyle) => void;
  curveOffset: number;
  setCurveOffset: (offset: number) => void;
  // Funksjonen for å hente linjeegenskaper (for eksempel om den er kurvet)
  getLineProperties: (style: LineStyle) => { curved: boolean; dashed: boolean; marker: 'arrow' | 'endline' | 'plus' | 'xmark' | null };
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
    <div className="p-4 border rounded bg-white mb-4">
      <h3 className="text-sm font-semibold mb-2">Linjestil</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {lineStyleOptions.map(option => (
          <button
            key={option.value}
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
        ))}
      </div>
      {(curved || tool === 'select') && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Kurvatur:</span>
          <Slider
            value={[curveOffset]}
            onValueChange={([val]) => setCurveOffset(val)}
            min={-100}
            max={100}
            step={1}
            className="w-32"
          />
          <span className="text-xs">{curveOffset}px</span>
        </div>
      )}
    </div>
  );
};

export default LineStyleSelector; 