import React from 'react';
import { Element } from '../../@types/elements';
import Player from './Player';
import Opponent from './Opponent';
import Ball from './Ball';
import Cone from './Cone';
import Line from './Line';
import Text from './Text';
import Markers from './Markers';

interface ElementRendererProps {
  elements: Element[];
  selectedElementId: string | null;
  onPlayerDoubleClick?: (element: Element, event: React.MouseEvent<SVGGElement>) => void;
  onTextDoubleClick?: (element: Element, event: React.MouseEvent<SVGTextElement>) => void;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({
  elements,
  selectedElementId,
  onPlayerDoubleClick,
  onTextDoubleClick
}) => {
  // Sorter elementer slik at linjer vises først, deretter kjegler, baller, spillere og til slutt tekst
  const sortedElements = [...elements].sort((a, b) => {
    const typeOrder: Record<string, number> = {
      line: 1,
      cone: 2,
      ball: 3,
      player: 4,
      opponent: 5,
      text: 6
    };
    
    return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
  });
  
  return (
    <>
      <Markers />
      
      {sortedElements.map((element) => {
        const isSelected = element.id === selectedElementId;
        
        switch (element.type) {
          case 'player':
            return (
              <Player
                key={element.id}
                element={element}
                isSelected={isSelected}
                onDoubleClick={onPlayerDoubleClick ? (e) => onPlayerDoubleClick(element, e) : undefined}
              />
            );
            
          case 'opponent':
            return (
              <Opponent
                key={element.id}
                element={element}
                isSelected={isSelected}
                onDoubleClick={onPlayerDoubleClick ? (e) => onPlayerDoubleClick(element, e) : undefined}
              />
            );
            
          case 'ball':
            return (
              <Ball
                key={element.id}
                element={element}
                isSelected={isSelected}
              />
            );
            
          case 'cone':
            return (
              <Cone
                key={element.id}
                element={element}
                isSelected={isSelected}
              />
            );
            
          case 'line':
            return (
              <Line
                key={element.id}
                element={element}
                isSelected={isSelected}
              />
            );
            
          case 'text':
            return (
              <Text
                key={element.id}
                element={element}
                isSelected={isSelected}
                onDoubleClick={onTextDoubleClick ? (e) => onTextDoubleClick(element, e) : undefined}
              />
            );
            
          default:
            return null;
        }
      })}
    </>
  );
};

export default ElementRenderer; 