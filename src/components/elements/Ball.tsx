import React from 'react';
import { SVG_ATTRIBUTES } from '../../constants/svg';
import { BallElement, BALL_RADIUS } from '../../@types/elements';

interface BallProps {
  element: BallElement;
  isSelected: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

const Ball: React.FC<BallProps> = ({ element, isSelected, onClick, onMouseDown, onTouchStart }) => {
  const { x, y, visible = true } = element;
  const seamStroke = SVG_ATTRIBUTES.stroke.black;
  const seamOpacity = 0.65;
  
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
      {isSelected && (
        <circle
          r={BALL_RADIUS + 2}
          fill={SVG_ATTRIBUTES.fill.none}
          stroke={SVG_ATTRIBUTES.stroke.blue}
          strokeWidth={SVG_ATTRIBUTES.strokeWidth.thin}
          strokeDasharray="2,2"
          opacity="0.85"
        />
      )}

      <circle
        data-testid="ball-main-circle"
        r={BALL_RADIUS}
        fill={SVG_ATTRIBUTES.fill.white}
        stroke={isSelected ? SVG_ATTRIBUTES.stroke.blue : seamStroke}
        strokeWidth={isSelected ? SVG_ATTRIBUTES.strokeWidth.thick : 1.5}
      />

      <path
        data-testid="ball-center-panel"
        d="M 0,-3 L -1.5,-0.75 L -0.75,1.5 L 0.75,1.5 L 1.5,-0.75 Z"
        fill={seamStroke}
        opacity="0.8"
      />

      <path
        d="M -1.4 -0.6 L -3.9 -2.1 M 1.4 -0.6 L 3.9 -2.1 M -0.7 1.4 L -2.9 3.6 M 0.7 1.4 L 2.9 3.6 M -3.9 -2.1 Q 0 -4.6 3.9 -2.1 M -2.9 3.6 Q 0 4.8 2.9 3.6"
        stroke={seamStroke}
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={seamOpacity}
      />

      <circle cx="-2.25" cy="0" r="1" fill={seamStroke} opacity="0.5" />
      <circle cx="2.25" cy="0" r="1" fill={seamStroke} opacity="0.5" />
      <circle cx="0" cy="3" r="0.85" fill={seamStroke} opacity="0.45" />
    </g>
  );
};

export default Ball;