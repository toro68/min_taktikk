import { useState, useCallback, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  startDrag: (startX: number, startY: number) => void;
  updateDrag: (currentX: number, currentY: number) => void;
  endDrag: () => void;
}

export const useDragOffset = (): DragState => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });

  const startDrag = useCallback((startX: number, startY: number) => {
    setIsDragging(true);
    startPosition.current = { x: startX, y: startY };
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const updateDrag = useCallback((currentX: number, currentY: number) => {
    if (!isDragging) return;
    
    const offsetX = currentX - startPosition.current.x;
    const offsetY = currentY - startPosition.current.y;
    
    setDragOffset({ x: offsetX, y: offsetY });
  }, [isDragging]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    isDragging,
    dragOffset,
    startDrag,
    updateDrag,
    endDrag
  };
};
