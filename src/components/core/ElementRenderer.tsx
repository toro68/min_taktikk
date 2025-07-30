import React from 'react';
import { FootballElement, AreaElement, LineElement, TraceElement, BallElement } from '../../@types/elements';
import { BaseLineStyle } from '../../types';
import Player from '../elements/Player';
import Opponent from '../elements/Opponent';
import Ball from '../elements/Ball';
import Cone from '../elements/Cone';
// Line component removed - handled inline
import Text from '../elements/Text';
import Area from '../elements/Area';

export interface ElementRendererProps {
  element: FootballElement;
  isSelected: boolean;
  onElementClick: (event: React.MouseEvent, element: FootballElement) => void;
  onElementDragStart: (event: React.MouseEvent, element: FootballElement) => void;
  onPlayerNumberDoubleClick?: (e: React.MouseEvent, element: FootballElement) => void;
  onTextDoubleClick?: (e: React.MouseEvent, element: FootballElement) => void;
  onAreaDoubleClick?: (e: React.MouseEvent, element: AreaElement) => void;
  onLineEndpointDrag?: (endpointType: 'start' | 'end', x: number, y: number) => void;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  onElementClick,
  onElementDragStart,
  onPlayerNumberDoubleClick,
  onTextDoubleClick,
  onAreaDoubleClick,
  onLineEndpointDrag
}) => {
  switch (element.type) {
    case 'player':
      return (
        <Player
          element={element as any}
          isSelected={isSelected}
          onClick={(e: React.MouseEvent) => onElementClick(e, element)}
          onMouseDown={(e: React.MouseEvent) => onElementDragStart(e, element)}
          onTouchStart={(e: React.TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
              clientX: touch.clientX,
              clientY: touch.clientY,
              preventDefault: () => {},
              stopPropagation: () => {}
            } as React.MouseEvent;
            onElementDragStart(mouseEvent, element);
          }}
          onDoubleClick={(e: React.MouseEvent) => onPlayerNumberDoubleClick?.(e, element)}
        />
      );

    case 'opponent':
      return (
        <Opponent
          element={element as any}
          isSelected={isSelected}
          onClick={(e: React.MouseEvent) => onElementClick(e, element)}
          onMouseDown={(e: React.MouseEvent) => onElementDragStart(e, element)}
          onTouchStart={(e: React.TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
              clientX: touch.clientX,
              clientY: touch.clientY,
              preventDefault: () => {},
              stopPropagation: () => {}
            } as React.MouseEvent;
            onElementDragStart(mouseEvent, element);
          }}
          onDoubleClick={(e: React.MouseEvent) => onPlayerNumberDoubleClick?.(e, element)}
        />
      );

    case 'ball':
      return (
        <Ball
          element={element as BallElement}
          isSelected={isSelected}
          onClick={(e: React.MouseEvent) => onElementClick(e, element)}
          onMouseDown={(e: React.MouseEvent) => onElementDragStart(e, element)}
          onTouchStart={(e: React.TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
              clientX: touch.clientX,
              clientY: touch.clientY,
              preventDefault: () => {},
              stopPropagation: () => {}
            } as React.MouseEvent;
            onElementDragStart(mouseEvent, element);
          }}
        />
      );

    case 'cone':
      return (
        <Cone
          element={element as any}
          isSelected={isSelected}
          onClick={(e: React.MouseEvent) => onElementClick(e, element)}
          onMouseDown={(e: React.MouseEvent) => onElementDragStart(e, element)}
          onTouchStart={(e: React.TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
              clientX: touch.clientX,
              clientY: touch.clientY,
              preventDefault: () => {},
              stopPropagation: () => {}
            } as React.MouseEvent;
            onElementDragStart(mouseEvent, element);
          }}
        />
      );

    case 'line':
      return (
        <g>
          <path
            d={(element as LineElement).path}
            stroke={(element as LineElement).color || '#000000'}
            strokeWidth={2}
            fill="none"
            strokeDasharray={(element as LineElement).dashed ? '5,5' : 'none'}
            markerEnd={(element as LineElement).marker ? `url(#${(element as LineElement).marker})` : 'none'}
            onClick={(e: React.MouseEvent) => onElementClick(e, element)}
            onMouseDown={(e: React.MouseEvent) => onElementDragStart(e, element)}
            style={{ cursor: 'pointer' }}
          />
        </g>
      );

    case 'text':
      return (
        <Text
          element={element as any}
          isSelected={isSelected}
          onClick={(e: React.MouseEvent) => onElementClick(e, element)}
          onMouseDown={(e: React.MouseEvent) => onElementDragStart(e, element)}
          onTouchStart={(e: React.TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
              clientX: touch.clientX,
              clientY: touch.clientY,
              preventDefault: () => {},
              stopPropagation: () => {}
            } as React.MouseEvent;
            onElementDragStart(mouseEvent, element);
          }}
          onDoubleClick={(e: React.MouseEvent) => onTextDoubleClick?.(e, element)}
        />
      );

    case 'area':
      return (
        <Area
          area={element as AreaElement}
          isSelected={isSelected}
          onClick={(e: React.MouseEvent) => onElementClick(e, element)}
          onMouseDown={(e: React.MouseEvent) => onElementDragStart(e, element)}
          onTouchStart={(e: React.TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
              clientX: touch.clientX,
              clientY: touch.clientY,
              preventDefault: () => {},
              stopPropagation: () => {}
            } as React.MouseEvent;
            onElementDragStart(mouseEvent, element);
          }}
          onDoubleClick={onAreaDoubleClick ? (e: React.MouseEvent) => onAreaDoubleClick(e, element as AreaElement) : undefined}
        />
      );

    case 'trace':
      const traceElement = element as TraceElement;
      return (
        <path
          d={traceElement.path}
          stroke={traceElement.color || '#000000'}
          strokeWidth={2}
          fill="none"
          strokeDasharray="5,5"
          markerEnd="url(#arrow)"
          style={{ cursor: 'pointer', opacity: 0.7 }}
        />
      );

    default:
      // Type assertion to avoid TypeScript errors in default case
      const unknownElement = element as FootballElement;
      console.warn('❌ Unknown element type:', unknownElement.type, unknownElement);
      return (
        <g key={unknownElement.id}>
          <text 
            x={unknownElement.x || 0} 
            y={unknownElement.y || 0} 
            fill="red" 
            fontSize="12"
          >
            UNKNOWN: {unknownElement.type}
          </text>
        </g>
      );
  }
};

export default ElementRenderer;