import React from 'react';
import { AreaElement } from '../../@types/elements';

interface AreaProps {
  area: AreaElement;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent<Element>) => void;
  onMouseDown?: (e: React.MouseEvent<Element>) => void;
  onTouchStart?: (e: React.TouchEvent<Element>) => void;
  onDoubleClick?: (e: React.MouseEvent<Element>) => void;
}

const Area: React.FC<AreaProps> = ({ 
  area, 
  isSelected = false, 
  onClick, 
  onMouseDown, 
  onTouchStart, 
  onDoubleClick 
}) => {
  const { 
    x, 
    y, 
    width, 
    height, 
    color = 'rgba(0, 0, 255, 0.3)', 
    opacity = 0.3,
    visible = true 
  } = area;
  
  if (!visible) return null;
  
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      fillOpacity={opacity}
      stroke={isSelected ? '#0066cc' : 'rgba(0, 0, 0, 0.5)'}
      strokeWidth={isSelected ? 2 : 1}
      strokeDasharray={isSelected ? '4,4' : 'none'}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onDoubleClick={onDoubleClick}
    />
  );
};

export default Area;
export { Area };