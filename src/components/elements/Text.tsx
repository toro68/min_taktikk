import React from 'react';
import { TextElement } from '../../@types/elements';

interface TextProps {
  element: TextElement;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

const Text: React.FC<TextProps> = ({ 
  element, 
  isSelected = false, 
  onClick, 
  onMouseDown, 
  onTouchStart,
  onDoubleClick 
}) => {
  const { 
    x = 0, 
    y = 0, 
    content = '', 
    fontSize = 16, 
    color = 'black',
    fontWeight = 'normal',
    textAlign = 'left',
    backgroundColor,
    padding = 4,
    rotation = 0,
    visible = true 
  } = element;
  
  if (!visible) return null;

  const textAnchor = textAlign === 'center' ? 'middle' : textAlign === 'right' ? 'end' : 'start';

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Background rectangle if backgroundColor is set */}
      {backgroundColor && (
        <rect
          x={textAlign === 'center' ? -(content.length * fontSize * 0.3) : textAlign === 'right' ? -(content.length * fontSize * 0.6) : -padding}
          y={-fontSize - padding}
          width={content.length * fontSize * 0.6 + (padding * 2)}
          height={fontSize + (padding * 2)}
          fill={backgroundColor}
          rx={2}
        />
      )}
      
      {/* Text content */}
      <text
        textAnchor={textAnchor}
        dominantBaseline="central"
        fill={color}
        fontSize={fontSize}
        fontWeight={fontWeight}
        stroke={isSelected ? '#0000ff' : 'none'}
        strokeWidth={isSelected ? 1 : 0}
      >
        {content}
      </text>
    </g>
  );
};

export default Text;