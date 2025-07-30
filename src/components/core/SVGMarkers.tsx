import React from 'react';
import { SVG_ATTRIBUTES } from '../../constants/svg';

export const SVGMarkers: React.FC = () => {
  return (
    <defs>
      {/* Standard arrow marker (black) - improved design */}
      <marker 
        id="arrow" 
        viewBox="0 0 12 12" 
        refX="9" 
        refY="6" 
        markerWidth="6" 
        markerHeight="6" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 2 2 L 10 6 L 2 10 L 4 6 z" fill={SVG_ATTRIBUTES.stroke.black} />
      </marker>

      {/* Colored arrow markers - improved design */}
      <marker 
        id="redArrow" 
        viewBox="0 0 12 12" 
        refX="9" 
        refY="6" 
        markerWidth="6" 
        markerHeight="6" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 2 2 L 10 6 L 2 10 L 4 6 z" fill={SVG_ATTRIBUTES.stroke.red} />
      </marker>

      <marker 
        id="blueArrow" 
        viewBox="0 0 12 12" 
        refX="9" 
        refY="6" 
        markerWidth="6" 
        markerHeight="6" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 2 2 L 10 6 L 2 10 L 4 6 z" fill={SVG_ATTRIBUTES.stroke.blue} />
      </marker>

      <marker 
        id="greenArrow" 
        viewBox="0 0 12 12" 
        refX="9" 
        refY="6" 
        markerWidth="6" 
        markerHeight="6" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 2 2 L 10 6 L 2 10 L 4 6 z" fill={SVG_ATTRIBUTES.stroke.green} />
      </marker>

      <marker 
        id="orangeArrow" 
        viewBox="0 0 12 12" 
        refX="9" 
        refY="6" 
        markerWidth="6" 
        markerHeight="6" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 2 2 L 10 6 L 2 10 L 4 6 z" fill={SVG_ATTRIBUTES.stroke.orange} />
      </marker>

      <marker 
        id="purpleArrow" 
        viewBox="0 0 12 12" 
        refX="9" 
        refY="6" 
        markerWidth="6" 
        markerHeight="6" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 2 2 L 10 6 L 2 10 L 4 6 z" fill={SVG_ATTRIBUTES.stroke.purple} />
      </marker>

      {/* End line marker - improved positioning */}
      <marker 
        id="endline" 
        viewBox="0 0 6 12" 
        refX="3" 
        refY="6" 
        markerWidth="6" 
        markerHeight="12" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line 
          x1="3" 
          y1="1" 
          x2="3" 
          y2="11" 
          stroke={SVG_ATTRIBUTES.stroke.black} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </marker>

      {/* Plus marker - improved design */}
      <marker 
        id="plus" 
        viewBox="0 0 12 12" 
        refX="6" 
        refY="6" 
        markerWidth="8" 
        markerHeight="8" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line 
          x1="6" 
          y1="2" 
          x2="6" 
          y2="10" 
          stroke={SVG_ATTRIBUTES.stroke.black} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <line 
          x1="2" 
          y1="6" 
          x2="10" 
          y2="6" 
          stroke={SVG_ATTRIBUTES.stroke.black} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </marker>

      {/* X mark marker - improved design */}
      <marker 
        id="xmark" 
        viewBox="0 0 12 12" 
        refX="6" 
        refY="6" 
        markerWidth="8" 
        markerHeight="8" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line 
          x1="3" 
          y1="3" 
          x2="9" 
          y2="9" 
          stroke={SVG_ATTRIBUTES.stroke.black} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <line 
          x1="9" 
          y1="3" 
          x2="3" 
          y2="9" 
          stroke={SVG_ATTRIBUTES.stroke.black} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </marker>

      {/* Professional football tactics markers */}
      
      {/* Target marker for shots */}
      <marker 
        id="target" 
        viewBox="0 0 16 16" 
        refX="8" 
        refY="8" 
        markerWidth="10" 
        markerHeight="10" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle 
          cx="8" 
          cy="8" 
          r="6" 
          fill="none" 
          stroke={SVG_ATTRIBUTES.stroke.black} 
          strokeWidth="2"
        />
        <circle 
          cx="8" 
          cy="8" 
          r="3" 
          fill="none" 
          stroke={SVG_ATTRIBUTES.stroke.black} 
          strokeWidth="1.5"
        />
        <circle 
          cx="8" 
          cy="8" 
          r="1" 
          fill={SVG_ATTRIBUTES.stroke.black}
        />
      </marker>

      {/* Circle marker for headers */}
      <marker 
        id="circle" 
        viewBox="0 0 12 12" 
        refX="6" 
        refY="6" 
        markerWidth="8" 
        markerHeight="8" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle 
          cx="6" 
          cy="6" 
          r="4" 
          fill="none" 
          stroke={SVG_ATTRIBUTES.stroke.black} 
          strokeWidth="2"
        />
      </marker>

      {/* Small arrow for short passes */}
      <marker 
        id="smallArrow" 
        viewBox="0 0 8 8" 
        refX="6" 
        refY="4" 
        markerWidth="4" 
        markerHeight="4" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 1 1 L 6 4 L 1 7 L 2.5 4 z" fill={SVG_ATTRIBUTES.stroke.black} />
      </marker>

      {/* Double arrow for pressing lines */}
      <marker 
        id="doubleArrow" 
        viewBox="0 0 18 12" 
        refX="15" 
        refY="6" 
        markerWidth="8" 
        markerHeight="6" 
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 2 2 L 8 6 L 2 10 L 3.5 6 z" fill={SVG_ATTRIBUTES.stroke.black} />
        <path d="M 8 2 L 14 6 L 8 10 L 9.5 6 z" fill={SVG_ATTRIBUTES.stroke.black} />
      </marker>
    </defs>
  );
};

export default SVGMarkers;