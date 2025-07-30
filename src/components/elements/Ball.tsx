import React from 'react';
import { SVG_ATTRIBUTES } from '../../constants/svg';
import { BallElement } from '../../@types/elements';

interface BallProps {
  element: BallElement;
  isSelected: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

const Ball: React.FC<BallProps> = ({ element, isSelected, onClick, onMouseDown, onTouchStart }) => {
  const { x, y, visible = true } = element;
  
  if (!visible) return null;

  return (
    <g
      data-testid="ball-element"
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{ cursor: 'move' }}
    >
      {/* Ball circle with white base */}
      <circle
        r="8"
        fill="#ffffff"
        stroke={isSelected ? SVG_ATTRIBUTES.stroke.blue : '#333333'}
        strokeWidth={isSelected ? SVG_ATTRIBUTES.strokeWidth.thick : 1.5}
      />
      
      {/* Football pattern - black pentagons */}
      <path
        d="M 0,-4 L -2,-1 L -1,2 L 1,2 L 2,-1 Z"
        fill="#000000"
        opacity="0.8"
      />
      
      {/* Smaller pentagon patterns */}
      <circle cx="-3" cy="0" r="1.5" fill="#000000" opacity="0.6" />
      <circle cx="3" cy="0" r="1.5" fill="#000000" opacity="0.6" />
      <circle cx="0" cy="4" r="1.2" fill="#000000" opacity="0.5" />
    </g>
  );
};

export default Ball;