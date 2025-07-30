import React from 'react';
import { SVG_ATTRIBUTES } from '../../constants/svg';

interface BlankPitchProps {
  width: number;
  height: number;
  isPortrait?: boolean;
}

const BlankPitch: React.FC<BlankPitchProps> = ({ width, height, isPortrait = false }) => {
  const outerStrokeColor = isPortrait ? SVG_ATTRIBUTES.stroke.red : SVG_ATTRIBUTES.stroke.black;
  const innerStrokeColor = isPortrait ? "#ffff00" : SVG_ATTRIBUTES.stroke.black; // Gul kan være egen konstant senere
  
  return (
    <div 
      className="flex items-center justify-center bg-gray-100" 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        border: isPortrait ? '3px dashed #ff00ff' : 'none' // Magenta kan være egen konstant
      }}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="border-2"
        style={{ borderColor: outerStrokeColor }}
      >
        <rect
          x="2"
          y="2"
          width={width - 4}
          height={height - 4}
          fill={isPortrait ? "#f0f0f0" : SVG_ATTRIBUTES.fill.white}
          stroke={outerStrokeColor}
          strokeWidth={SVG_ATTRIBUTES.strokeWidth.normal}
        />
        
        <rect
          x="20"
          y="20"
          width={width - 40}
          height={height - 40}
          fill={SVG_ATTRIBUTES.fill.none}
          stroke={innerStrokeColor}
          strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
        />
        
        {isPortrait ? (
          <text
            x={width / 2}
            y={height / 2 - 20}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={SVG_ATTRIBUTES.stroke.red}
            fontSize="24"
            fontWeight="bold"
          >
            BLANK PORTRETT
          </text>
        ) : (
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={SVG_ATTRIBUTES.stroke.black}
            fontSize="32"
            fontWeight="bold"
          >
            BLANK LANDSKAP
          </text>
        )}
      </svg>
    </div>
  );
};

export default BlankPitch;