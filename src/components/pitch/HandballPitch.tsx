import React, { memo } from 'react';
import { SVG_ATTRIBUTES, SVG_STYLES } from '../../constants/svg';

interface HandballPitchProps {
  // Add any specific props for handball pitch
}

const HandballPitch: React.FC<HandballPitchProps> = () => {
  return (
    <g>
      {/* Hvit bakgrunn for hele baneområdet */}
      <rect
        x="0"
        y="0" 
        width="680"
        height="340"
        fill={SVG_ATTRIBUTES.fill.white}
        stroke={SVG_ATTRIBUTES.fill.none}
      />
      
      {/* Hovedbane */}
      <rect
        x="0"
        y="0"
        width="680"
        height="340"
        {...SVG_STYLES.pitchLine}
      />
      
      {/* Midtlinje */}
      <line
        x1="340"
        y1="0"
        x2="340"
        y2="340"
        {...SVG_STYLES.pitchLine}
      />
      
      {/* Venstre målfelt (straffeområde) - 6m bue fra dødlinje */}
      <path 
        d="M 0,51 A 102,102 1 0 1 0,289" 
        {...SVG_STYLES.pitchLine}
      />
      
      {/* Høyre målfelt (straffeområde) - 6m bue fra dødlinje */}
      <path 
        d="M 680,51 A 102,102 1 0 0 680,289" 
        {...SVG_STYLES.pitchLine}
      />
      
      {/* Venstre 9-meter (stiplet) - parallell med 6-meteren */}
      <path 
        d="M 0,0 A 153,153 1 0 1 0,340" 
        stroke={SVG_ATTRIBUTES.stroke.black}
        strokeWidth={SVG_ATTRIBUTES.strokeWidth.normal}
        fill={SVG_ATTRIBUTES.fill.none}
        strokeDasharray="5,5"
      />
      
      {/* Høyre 9-meter (stiplet) - parallell med 6-meteren */}
      <path 
        d="M 680,0 A 153,153 1 0 0 680,340" 
        stroke={SVG_ATTRIBUTES.stroke.black}
        strokeWidth={SVG_ATTRIBUTES.strokeWidth.normal}
        fill={SVG_ATTRIBUTES.fill.none}
        strokeDasharray="5,5"
      />
      
      {/* Venstre mål */}
      <rect
        x="-15"
        y="120"
        width="15"
        height="100"
        {...SVG_STYLES.pitchLine}
      />
      
      {/* Høyre mål */}
      <rect
        x="680"
        y="120"
        width="15"
        height="100"
        {...SVG_STYLES.pitchLine}
      />
    </g>
  );
};

export default memo(HandballPitch);