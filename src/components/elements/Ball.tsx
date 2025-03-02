import React from 'react';
import { BallElement } from '../../@types/elements';
import { BALL_RADIUS } from '../../@types/elements';

interface BallProps {
  element: BallElement;
  isSelected: boolean;
}

const Ball: React.FC<BallProps> = ({ element, isSelected }) => {
  const { x = 0, y = 0, visible = true } = element;
  
  if (!visible) return null;
  
  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: 'pointer' }}>
      {/* Ball-sirkel */}
      <circle
        r={BALL_RADIUS}
        fill="#ffffff"
        stroke={isSelected ? '#ff0000' : '#000000'}
        strokeWidth={isSelected ? 2 : 1}
      />
      
      {/* Ball-mønster (forenklet) */}
      <path
        d="M0,-5 L0,5 M-5,0 L5,0"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
      />
    </g>
  );
};

export default Ball; 