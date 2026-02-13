import React from 'react';
import { LineElement } from '../../@types/elements';
import { extractPathEndpoints } from '../../lib/line-utils';

interface LineEndpointsProps {
  line: LineElement;
  isSelected: boolean;
  onEndpointDrag?: (endpointType: 'start' | 'end', x: number, y: number) => void;
}

const LineEndpoints: React.FC<LineEndpointsProps> = ({
  line,
  isSelected,
  onEndpointDrag
}) => {
  if (!isSelected || !onEndpointDrag) return null;

  const endpoints = extractPathEndpoints(line.path);
  if (!endpoints) return null;

  const handleMouseDown = (endpointType: 'start' | 'end', event: React.MouseEvent) => {
    event.stopPropagation();
    
    const handleMouseMove = (e: MouseEvent) => {
      const svg = (event.target as Element).closest('svg');
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * svg.viewBox.baseVal.width;
      const y = ((e.clientY - rect.top) / rect.height) * svg.viewBox.baseVal.height;
      
      onEndpointDrag(endpointType, x, y);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <g>
      {/* Start endpoint */}
      <circle
        cx={endpoints.start.x}
        cy={endpoints.start.y}
        r="6"
        fill="rgba(59, 130, 246, 0.8)"
        stroke="white"
        strokeWidth="2"
        style={{ cursor: 'grab' }}
        data-testid="line-endpoint-start"
        onMouseDown={(e) => handleMouseDown('start', e)}
      />
      
      {/* End endpoint */}
      <circle
        cx={endpoints.end.x}
        cy={endpoints.end.y}
        r="6"
        fill="rgba(239, 68, 68, 0.8)"
        stroke="white"
        strokeWidth="2"
        style={{ cursor: 'grab' }}
        data-testid="line-endpoint-end"
        onMouseDown={(e) => handleMouseDown('end', e)}
      />
    </g>
  );
};

export default LineEndpoints;
