import React from 'react';
import { ConeElement } from '../../@types/elements';

interface ConeProps {
  element: ConeElement;
  isSelected: boolean;
}

const Cone: React.FC<ConeProps> = ({ element, isSelected }) => {
  const { x = 0, y = 0, visible = true } = element;
  
  if (!visible) return null;
  
  // Kjegle-dimensjoner
  const coneWidth = 10;
  const coneHeight = 12;
  
  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: 'pointer' }}>
      {/* Kjegle (forenklet trekant) */}
      <polygon
        points={`0,-${coneHeight/2} ${coneWidth/2},${coneHeight/2} -${coneWidth/2},${coneHeight/2}`}
        fill="#ff9900"
        stroke={isSelected ? '#ff0000' : '#000000'}
        strokeWidth={isSelected ? 2 : 1}
      />
    </g>
  );
};

export default Cone; 