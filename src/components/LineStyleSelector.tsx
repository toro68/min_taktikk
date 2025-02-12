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
  | 'xEnd';

interface LineStyleOption {
  value: LineStyle;
  label: string;
  preview: React.ReactElement;
}

interface LineStyleSelectorProps {
  lineStyleOptions: LineStyleOption[];
  selectedLineStyle: LineStyle;
  setSelectedLineStyle: (value: LineStyle) => void;
  curveOffset: number;
  setCurveOffset: (value: number) => void;
  // Funksjonen for å hente linjeegenskaper (for eksempel om den er kurvet)
  getLineProperties: (style: LineStyle) => { curved: boolean; dashed: boolean; marker: 'arrow' | 'endline' | 'plus' | 'xmark' | null };
}

const LineStyleSelector: React.FC<LineStyleSelectorProps> = ({
  lineStyleOptions,
  selectedLineStyle,
  setSelectedLineStyle,
  curveOffset,
  setCurveOffset,
  getLineProperties,
}) => {
  const properties = getLineProperties(selectedLineStyle);
  return (
    <div className="mb-4 p-2 border rounded bg-white">
      <h3 className="text-sm font-semibold mb-2">Velg linjestil:</h3>
      <div className="grid grid-cols-3 gap-4">
        {lineStyleOptions.map(option => (
          <div
            key={option.value}
            className={`cursor-pointer border p-2 ${selectedLineStyle === option.value ? 'border-blue-500' : 'border-gray-300'}`}
            onClick={() => {
              console.log("Setter linjestil:", option.value);
              setSelectedLineStyle(option.value);
            }}
          >
            {option.preview}
            <div className="text-xs text-center mt-1">{option.label}</div>
          </div>
        ))}
      </div>
      {properties.curved && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Juster bue:</h4>
          <Slider
            value={[curveOffset]}
            onValueChange={([value]) => setCurveOffset(value)}
            min={-50}
            max={50}
            step={1}
            className="w-32"
          />
          <p className="text-xs text-gray-500">Curvature: {curveOffset}px</p>
        </div>
      )}
    </div>
  );
};

export default LineStyleSelector; 