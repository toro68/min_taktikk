import React, { useEffect } from 'react';
import { PitchType } from '../../@types/elements';
import { getPitchDimensions } from '../../lib/svg-utils';

interface BlankPitchProps {
  pitchType: PitchType;
}

const BlankPitch: React.FC<BlankPitchProps> = ({ pitchType }) => {
  const { width, height } = getPitchDimensions(pitchType);
  const isPortrait = pitchType === 'blankPortrait';
  
  useEffect(() => {
    console.log(`BlankPitch montert med type: ${pitchType}`);
    console.log(`Er portrett: ${isPortrait}, dimensjoner: ${width}x${height}`);
    
    // Alertbox for å sikre at koden kjøres
    if (isPortrait) {
      alert('Blank Portrait bane lastet!');
    }
  }, [pitchType, isPortrait, width, height]);
  
  // EKSTREME farger og stiler for å sikre synlighet
  const outerStrokeWidth = isPortrait ? 10 : 2; 
  const innerStrokeWidth = isPortrait ? 5 : 1;
  const outerStrokeColor = isPortrait ? "#ff0000" : "#000000"; // Rød
  const innerStrokeColor = isPortrait ? "#ffff00" : "#000000"; // Gul
  
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ border: isPortrait ? '3px dashed #ff00ff' : 'none' }} // Magenta border på selve SVG-elementet
    >
      {/* Bakgrunn - ikke helt hvit for portrett */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill={isPortrait ? "#f0f0f0" : "white"} // Litt gråere bakgrunn for portrett
        stroke="none"
      />
      
      {/* Ytre ramme */}
      <rect
        x="20"
        y="20"
        width={width - 40}
        height={height - 40}
        fill="none"
        stroke={outerStrokeColor}
        strokeWidth={outerStrokeWidth}
      />
      
      {/* Indre ramme */}
      <rect
        x="40"
        y="40"
        width={width - 80}
        height={height - 80}
        fill="none"
        stroke={innerStrokeColor}
        strokeWidth={innerStrokeWidth}
      />
      
      {/* Tydelig tekst for debugging */}
      {isPortrait && (
        <>
          <text
            x={width / 2}
            y={height / 2 - 20}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ff0000"
            fontSize="24"
            fontWeight="bold"
          >
            BLANK PORTRETT
          </text>
          <text
            x={width / 2}
            y={height / 2 + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#0000ff"
            fontSize="18"
          >
            {width}x{height}
          </text>
        </>
      )}
      
      {/* Hjørnemarkører */}
      {isPortrait && (
        <>
          <circle cx="20" cy="20" r="10" fill="#ff0000" />
          <circle cx={width-20} cy="20" r="10" fill="#ff0000" />
          <circle cx="20" cy={height-20} r="10" fill="#ff0000" />
          <circle cx={width-20} cy={height-20} r="10" fill="#ff0000" />
        </>
      )}
    </svg>
  );
};

export default BlankPitch; 