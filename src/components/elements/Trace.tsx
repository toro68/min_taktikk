import React from 'react';
import { TraceElement } from '../../@types/elements';
import { extractPathEndpoints } from '../../lib/line-utils';

interface TraceProps {
  element: TraceElement;
  isSelected?: boolean;
  onClick?: (event: React.MouseEvent, trace: TraceElement) => void;
}

const Trace: React.FC<TraceProps> = ({ element, isSelected = false, onClick }) => {
  const { 
    path, 
    opacity = 0.25, 
    color = '#8b94a1', 
    thickness = 1,
    dashed = true,
    visible = true,
    marker,
    frameEnd,
    frameStart
  } = element;
  
  if (!visible) return null;
  const endpoints = extractPathEndpoints(path);
  const endPoint = endpoints?.end;
  
  const strokeDasharray = dashed ? '4,4' : 'none';
  const strokeWidth = isSelected ? thickness + 1 : thickness;
  const markerEnd = marker ? `url(#${marker})` : undefined;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick?.(event, element);
  };
  
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
        markerEnd={markerEnd}
        data-testid="trace-path"
        onClick={handleClick}
        style={{
          cursor: 'pointer',
          transition: 'opacity 0.3s ease-out'
        }}
      />
      
      {/* Direction indicator for longer traces - use actual path end-point */}
      {frameEnd !== undefined && frameStart !== undefined && endPoint &&
       (frameEnd - frameStart) > 2 && (
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="2"
          fill={color}
          fillOpacity={opacity * 0.6}
          data-testid="trace-endpoint"
          onClick={handleClick}
        />
      )}
    </g>
  );
};

export default Trace;
