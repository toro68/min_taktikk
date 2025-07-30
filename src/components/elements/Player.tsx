import React from 'react';
import { SVG_ATTRIBUTES } from '../../constants/svg';
import { PlayerElement } from '../../@types/elements';

interface PlayerProps {
  element: PlayerElement;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

const Player: React.FC<PlayerProps> = ({ 
  element, 
  isSelected = false, 
  onClick, 
  onMouseDown, 
  onTouchStart,
  onDoubleClick 
}) => {
  const { x = 0, y = 0, number = '1', color = '#0066cc', visible = true } = element;
  
  if (!visible) return null;

  return (
    <g
      data-testid="player-element"
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'move' }}
    >
      {/* Selection indicator (behind) */}
      {isSelected && (
        <circle
          r="20"
          fill={SVG_ATTRIBUTES.fill.none}
          stroke="#0066ff"
          strokeWidth="3"
          strokeDasharray="5,5"
          opacity="0.8"
        />
      )}
      
      {/* Player circle */}
      <circle
        r="15"
        fill={color}
        stroke={isSelected ? SVG_ATTRIBUTES.stroke.white : SVG_ATTRIBUTES.stroke.black}
        strokeWidth={isSelected ? SVG_ATTRIBUTES.strokeWidth.thick : SVG_ATTRIBUTES.strokeWidth.normal}
      />
      {/* Inner circle if needed */}
      {isSelected && (
        <circle
          r="8"
          fill={SVG_ATTRIBUTES.fill.none}
          stroke={SVG_ATTRIBUTES.stroke.white}
          strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
        />
      )}
      
      {/* Player number */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        pointerEvents="none"
      >
        {number}
      </text>
    </g>
  );
};

export default Player;