import React from 'react';
import { TraceElement } from '../../@types/elements';

interface TraceProps {
  element: TraceElement;
  isSelected?: boolean;
}

const Trace: React.FC<TraceProps> = ({ element, isSelected = false }) => {
  const { 
    path, 
    opacity = 0.25, 
    color = '#8b94a1', 
    thickness = 1,
    dashed = true,
    visible = true,
    x,
    y,
    frameEnd,
    frameStart
  } = element;
  
  if (!visible) return null;
  
  const strokeDasharray = dashed ? '4,4' : 'none';
  const strokeWidth = isSelected ? thickness + 1 : thickness;
  
  return (
    <g>
      {/* Main trace line - removed glow effect for more discrete appearance */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          cursor: 'pointer',
          transition: 'opacity 0.3s ease-out'
        }}
      />
      
      {/* Direction indicator for longer traces - only if we have valid coordinates */}
      {frameEnd && frameStart && x && y && 
       (frameEnd - frameStart) > 2 && (
        <circle
          cx={x}
          cy={y}
          r="2"
          fill={color}
          fillOpacity={opacity * 0.6}
        />
      )}
    </g>
  );
};

export default Trace;