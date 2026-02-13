import React from 'react';
import { SVG_ATTRIBUTES } from '../../constants/svg';
import { PlayerElement, PLAYER_RADIUS } from '../../@types/elements';

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
  const selectionStroke = SVG_ATTRIBUTES.stroke.blue;
  
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
          r={PLAYER_RADIUS + 5}
          fill={SVG_ATTRIBUTES.fill.none}
          stroke={selectionStroke}
          strokeWidth="3"
          strokeDasharray="5,5"
          opacity="0.8"
        />
      )}
      
      {/* Player circle */}
      <circle
        data-testid="player-main-circle"
        r={PLAYER_RADIUS}
        fill={color}
        stroke={isSelected ? SVG_ATTRIBUTES.stroke.white : SVG_ATTRIBUTES.stroke.black}
        strokeWidth={isSelected ? SVG_ATTRIBUTES.strokeWidth.thick : SVG_ATTRIBUTES.strokeWidth.normal}
      />
      {/* Inner circle if needed */}
      {isSelected && (
        <circle
          r={PLAYER_RADIUS - 6}
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
        stroke={SVG_ATTRIBUTES.stroke.black}
        strokeOpacity="0.35"
        strokeWidth="0.5"
        paintOrder="stroke"
        fontSize="11"
        fontWeight="bold"
        pointerEvents="none"
      >
        {number}
      </text>
    </g>
  );
};

export default Player;