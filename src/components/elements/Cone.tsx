import React from 'react';
import { ConeElement } from '../../@types/elements';

interface ConeProps {
  element: ConeElement;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

const Cone: React.FC<ConeProps> = ({ 
  element, 
  isSelected = false, 
  onClick, 
  onMouseDown, 
  onTouchStart,
  onDoubleClick 
}) => {
  const { x = 0, y = 0, visible = true } = element;
  
  if (!visible) return null;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Main cone polygon */}
      <polygon
        points="0,-8 -6,8 6,8"
        fill="#ffa500"
        stroke="#000000"
        strokeWidth="2"
      />
      
      {/* Inner white outline */}
      <polygon
        points="0,-6 -4,6 4,6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
      />
    </g>
  );
};

export default Cone;