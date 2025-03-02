import React from 'react';
import { LineElement } from '../../@types/elements';
import { getLineProperties } from '../../lib/line-utils';

interface LineProps {
  element: LineElement;
  isSelected: boolean;
}

const Line: React.FC<LineProps> = ({ element, isSelected }) => {
  const { path, dashed, marker, color = 'black', visible = true } = element;
  
  if (!visible) return null;
  
  // Bestem markør-ID basert på markørtype
  const getMarkerId = () => {
    if (!marker) return undefined;
    return `url(#${marker})`;
  };
  
  // Bestem strektype basert på dashed-flagget
  const getStrokeDasharray = () => {
    return dashed ? '5,5' : 'none';
  };
  
  return (
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={isSelected ? 3 : 2}
      strokeDasharray={getStrokeDasharray()}
      markerEnd={getMarkerId()}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default Line; 