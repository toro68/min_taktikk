import React from 'react';
import { TextElement } from '../../@types/elements';

interface TextProps {
  element: TextElement;
  isSelected: boolean;
  onDoubleClick?: (event: React.MouseEvent<SVGTextElement>) => void;
}

const Text: React.FC<TextProps> = ({ element, isSelected, onDoubleClick }) => {
  const { x = 0, y = 0, content, fontSize, rotation = 0, visible = true } = element;
  
  if (!visible) return null;
  
  return (
    <text
      x={x}
      y={y}
      fontSize={fontSize}
      fontFamily="Arial, sans-serif"
      textAnchor="middle"
      dominantBaseline="central"
      fill="#000000"
      stroke={isSelected ? '#ff0000' : 'none'}
      strokeWidth={1}
      style={{ cursor: 'pointer' }}
      transform={rotation ? `rotate(${rotation} ${x} ${y})` : undefined}
      onDoubleClick={onDoubleClick}
    >
      {content}
    </text>
  );
};

export default Text; 