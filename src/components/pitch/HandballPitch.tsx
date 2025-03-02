import React from 'react';
import { getPitchDimensions } from '../../lib/svg-utils';

const HandballPitch: React.FC = () => {
  const { width, height } = getPitchDimensions('handball');
  
  return (
    <g>
      {/* Hovedbane */}
      <rect
        x="0"
        y="0"
        width="680"
        height="340"
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
      
      {/* Midtlinje */}
      <line
        x1="340"
        y1="0"
        x2="340"
        y2="340"
        stroke="black"
        strokeWidth="2"
      />
      
      {/* Venstre målfelt (straffeområde) - 6m bue fra dødlinje */}
      <path 
        d="M 0,51 A 102,102 1 0 1 0,289" 
        fill="none" 
        stroke="black" 
        strokeWidth="2"
      />
      
      {/* Høyre målfelt (straffeområde) - 6m bue fra dødlinje */}
      <path 
        d="M 680,51 A 102,102 1 0 0 680,289" 
        fill="none" 
        stroke="black" 
        strokeWidth="2"
      />
      
      {/* Venstre 9-meter (stiplet) - parallell med 6-meteren */}
      <path 
        d="M 0,0 A 153,153 1 0 1 0,340" 
        fill="none" 
        stroke="black" 
        strokeWidth="2" 
        strokeDasharray="5,5"
      />
      
      {/* Høyre 9-meter (stiplet) - parallell med 6-meteren */}
      <path 
        d="M 680,0 A 153,153 1 0 0 680,340" 
        fill="none" 
        stroke="black" 
        strokeWidth="2" 
        strokeDasharray="5,5"
      />
      
      {/* Venstre mål */}
      <rect
        x="-15"
        y="120"
        width="15"
        height="100"
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
      
      {/* Høyre mål */}
      <rect
        x="680"
        y="120"
        width="15"
        height="100"
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
    </g>
  );
};

export default HandballPitch; 