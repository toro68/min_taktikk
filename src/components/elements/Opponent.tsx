import React from 'react';
import { OpponentElement } from '../../@types/elements';
import { PLAYER_RADIUS } from '../../@types/elements';

interface OpponentProps {
  element: OpponentElement;
  isSelected: boolean;
  onDoubleClick?: (event: React.MouseEvent<SVGGElement>) => void;
}

const Opponent: React.FC<OpponentProps> = ({ element, isSelected, onDoubleClick }) => {
  const { x = 0, y = 0, number, visible = true } = element;
  
  if (!visible) return null;
  
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Motstander-sirkel */}
      <circle
        r={PLAYER_RADIUS}
        fill="#ff0000"
        stroke={isSelected ? '#0000ff' : 'none'}
        strokeWidth={2}
      />
      
      {/* Motstander-nummer */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        {number}
      </text>
    </g>
  );
};

export default Opponent; 