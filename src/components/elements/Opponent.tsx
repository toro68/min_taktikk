import React from 'react';
import { SVG_ATTRIBUTES } from '../../constants/svg';
import { OpponentElement, PLAYER_RADIUS } from '../../@types/elements';

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
  const selectionStroke = SVG_ATTRIBUTES.stroke.blue;
  
  if (!visible) return null;

  return (
    <g
      data-testid="opponent-element"
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'move' }}
    >
      {isSelected && (
        <circle
          r={PLAYER_RADIUS + 4}
          fill={SVG_ATTRIBUTES.fill.none}
          stroke={selectionStroke}
          strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
          strokeDasharray="2,2"
          opacity="0.85"
        />
      )}

      {/* Motstander-sirkel */}
      <circle
        data-testid="opponent-main-circle"
        r={PLAYER_RADIUS}
        fill={color}
        stroke={isSelected ? selectionStroke : SVG_ATTRIBUTES.stroke.black}
        strokeWidth={isSelected ? SVG_ATTRIBUTES.strokeWidth.thick : SVG_ATTRIBUTES.strokeWidth.normal}
      />
      
      {/* Motstander-nummer */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={SVG_ATTRIBUTES.fill.white}
        stroke={SVG_ATTRIBUTES.stroke.black}
        strokeOpacity="0.35"
        strokeWidth="0.5"
        paintOrder="stroke"
        fontSize="11"
        fontWeight="bold"
      >
        {number}
      </text>
    </g>
  );
};

export default Opponent;