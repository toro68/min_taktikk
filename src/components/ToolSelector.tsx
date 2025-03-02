import React from 'react';
import { Button } from './ui/button';
import { 
  MousePointer, 
  User, 
  Users, 
  Volleyball, 
  Cone, 
  PenTool, 
  SquareSplitHorizontal, 
  Type 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import LineStyleSelector, { LineStyle } from './LineStyleSelector';
import ColorSelector from './ColorSelector';
import { getLineProperties } from '../lib/line-utils';

type Tool = 'select' | 'player' | 'opponent' | 'ball' | 'cone' | 'line' | 'text';
type PitchType = 'full' | 'offensive' | 'defensive' | 'handball' | 'fullLandscape' | 'blankPortrait' | 'blankLandscape';

interface ToolSelectorProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  pitch: PitchType;
  handleTogglePitch: () => void;
  selectedLineStyle: LineStyle;
  setSelectedLineStyle: (style: LineStyle) => void;
  curveOffset: number;
  setCurveOffset: (offset: number) => void;
  lineColor: string;
  setLineColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

// Linjestil-alternativer
const lineStyleOptions = [
  {
    value: 'solidCurved' as LineStyle,
    label: 'Kurvet',
    preview: <svg width="30" height="20" viewBox="0 0 30 20">
      <path d="M 5 15 Q 15 5, 25 15" stroke="black" fill="none" strokeWidth="2" />
    </svg>
  },
  {
    value: 'dashedCurved' as LineStyle,
    label: 'Stiplet kurvet',
    preview: <svg width="30" height="20" viewBox="0 0 30 20">
      <path d="M 5 15 Q 15 5, 25 15" stroke="black" fill="none" strokeWidth="2" strokeDasharray="2,2" />
    </svg>
  },
  {
    value: 'solidStraight' as LineStyle,
    label: 'Rett',
    preview: <svg width="30" height="20" viewBox="0 0 30 20">
      <path d="M 5 15 L 25 15" stroke="black" fill="none" strokeWidth="2" />
    </svg>
  },
  {
    value: 'dashedStraight' as LineStyle,
    label: 'Stiplet rett',
    preview: <svg width="30" height="20" viewBox="0 0 30 20">
      <path d="M 5 15 L 25 15" stroke="black" fill="none" strokeWidth="2" strokeDasharray="2,2" />
    </svg>
  },
  {
    value: 'curvedArrow' as LineStyle,
    label: 'Kurvet pil',
    preview: <svg width="30" height="20" viewBox="0 0 30 20">
      <path d="M 5 15 Q 15 5, 25 15" stroke="black" fill="none" strokeWidth="2" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
        </marker>
      </defs>
    </svg>
  },
  {
    value: 'straightArrow' as LineStyle,
    label: 'Rett pil',
    preview: <svg width="30" height="20" viewBox="0 0 30 20">
      <path d="M 5 15 L 25 15" stroke="black" fill="none" strokeWidth="2" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
        </marker>
      </defs>
    </svg>
  },
  {
    value: 'dashedCurvedArrow' as LineStyle,
    label: 'Kurvet stiplet pil',
    preview: <svg width="30" height="20" viewBox="0 0 30 20">
      <path d="M 5 15 Q 15 5, 25 15" stroke="black" fill="none" strokeWidth="2" strokeDasharray="2,2" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
        </marker>
      </defs>
    </svg>
  },
  {
    value: 'dashedStraightArrow' as LineStyle,
    label: 'Rett stiplet pil',
    preview: <svg width="30" height="20" viewBox="0 0 30 20">
      <path d="M 5 15 L 25 15" stroke="black" fill="none" strokeWidth="2" strokeDasharray="2,2" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
        </marker>
      </defs>
    </svg>
  }
];

const ToolSelector: React.FC<ToolSelectorProps> = ({
  selectedTool,
  setSelectedTool,
  pitch,
  handleTogglePitch,
  selectedLineStyle,
  setSelectedLineStyle,
  curveOffset,
  setCurveOffset,
  lineColor,
  setLineColor,
  customColor,
  setCustomColor
}) => {
  // Stil for aktiv knapp - forbedret for synlighet
  const activeButtonStyle = "bg-blue-600 text-white font-bold border-2 border-blue-700 shadow-md shadow-blue-300";
  
  return (
    <div className="flex flex-col bg-white p-2 mb-4">
      <TooltipProvider delayDuration={0}>
        {/* Fjerner de dupliserte knappene her */}
        
        {/* Viser kun linjestil-velgeren og innstillinger for valgt verktøy */}
        {selectedTool === 'line' && (
          <div className="mt-4">
            <LineStyleSelector
              lineStyleOptions={lineStyleOptions}
              selectedLineStyle={selectedLineStyle}
              setSelectedLineStyle={setSelectedLineStyle}
              curveOffset={curveOffset}
              setCurveOffset={setCurveOffset}
              getLineProperties={(style) => {
                const props = getLineProperties(style);
                // Normaliser marker for å sikre at den kun er 'arrow', 'endline', 'plus', 'xmark' eller null
                const normalizedMarker = (props.marker === 'redArrow' || props.marker === 'blueArrow' || props.marker === 'greenArrow' || props.marker === 'orangeArrow' || props.marker === 'purpleArrow') ? 'arrow' : props.marker;
                return { curved: props.curved, dashed: props.dashed, marker: normalizedMarker };
              }}
              tool={selectedTool}
            />
            
            <ColorSelector
              selectedColor={lineColor}
              setSelectedColor={setLineColor}
              customColor={customColor}
              setCustomColor={setCustomColor}
            />
          </div>
        )}
      </TooltipProvider>
    </div>
  );
};

export default ToolSelector; 