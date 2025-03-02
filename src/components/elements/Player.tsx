import React from 'react';
import { PlayerElement } from '../../@types/elements';
import { PLAYER_RADIUS } from '../../@types/elements';

interface PlayerProps {
  element: PlayerElement;
  isSelected: boolean;
  onDoubleClick?: (event: React.MouseEvent<SVGGElement>) => void;
}

const Player: React.FC<PlayerProps> = ({ element, isSelected, onDoubleClick }) => {
  const { x = 0, y = 0, number, visible = true } = element;
  
  if (!visible) return null;
  
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Spiller-sirkel */}
      <circle
        r={PLAYER_RADIUS}
        fill="#0000ff"
        stroke={isSelected ? '#ff0000' : 'none'}
        strokeWidth={2}
      />
      
      {/* Spillernummer */}
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

export default Player; 