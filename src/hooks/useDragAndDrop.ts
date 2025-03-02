import { useState, useCallback, useRef, MouseEvent } from 'react';
import { Element } from '../@types/elements';

interface Position {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  elementId: string | null;
  startPosition: Position | null;
  currentPosition: Position | null;
  offset: Position | null;
}

interface UseDragAndDropProps {
  onElementMove: (elementId: string, x: number, y: number) => void;
  getSVGCoordinates: (clientX: number, clientY: number) => Position;
}

interface UseDragAndDropReturn {
  isDragging: boolean;
  draggedElementId: string | null;
  handleMouseDown: (event: MouseEvent, elementId: string, x: number, y: number) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseUp: (event: MouseEvent) => void;
}

export const useDragAndDrop = ({
  onElementMove,
  getSVGCoordinates
}: UseDragAndDropProps): UseDragAndDropReturn => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementId: null,
    startPosition: null,
    currentPosition: null,
    offset: null
  });

  // Håndter museklikk på et element
  const handleMouseDown = useCallback((
    event: MouseEvent, 
    elementId: string, 
    x: number, 
    y: number
  ) => {
    event.stopPropagation();
    
    const svgCoords = getSVGCoordinates(event.clientX, event.clientY);
    
    setDragState({
      isDragging: true,
      elementId,
      startPosition: { x, y },
      currentPosition: { x, y },
      offset: {
        x: x - svgCoords.x,
        y: y - svgCoords.y
      }
    });
  }, [getSVGCoordinates]);

  // Håndter musebevegelse
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragState.isDragging || !dragState.elementId || !dragState.offset) return;
    
    const svgCoords = getSVGCoordinates(event.clientX, event.clientY);
    const newX = svgCoords.x + dragState.offset.x;
    const newY = svgCoords.y + dragState.offset.y;
    
    setDragState(prev => ({
      ...prev,
      currentPosition: { x: newX, y: newY }
    }));
    
    onElementMove(dragState.elementId, newX, newY);
  }, [dragState, getSVGCoordinates, onElementMove]);

  // Håndter museknapp slippes
  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (!dragState.isDragging) return;
    
    setDragState({
      isDragging: false,
      elementId: null,
      startPosition: null,
      currentPosition: null,
      offset: null
    });
  }, [dragState.isDragging]);

  return {
    isDragging: dragState.isDragging,
    draggedElementId: dragState.elementId,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}; 