import React from 'react';
import { OpponentElement } from '../../@types/elements';

interface OpponentProps {
  element: OpponentElement;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

const Opponent: React.FC<OpponentProps> = ({ 
  element, 
  isSelected = false, 
  onClick, 
  onMouseDown, 
  onTouchStart,
  onDoubleClick 
}) => {
  const { x = 0, y = 0, number = '1', color = '#ff0000', visible = true } = element;
  
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
      {/* Motstander-sirkel */}
      <circle
        r="15"
        fill={color}
        stroke={isSelected ? '#0000ff' : '#000000'}
        strokeWidth={isSelected ? 3 : 2}
      />
      
      {/* Motstander-nummer */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        {number}
      </text>
    </g>
  );
};

export default Opponent;