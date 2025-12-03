import { useState, useRef, useCallback } from 'react';
import { FootballElement, PlayerElement, OpponentElement, TextElement, LineElement, Tool, Frame } from '../@types/elements';
import { createLinePath, createLinePathMemoized, getLineProperties, isPointNearLine } from '../lib/line-utils';
import { LineStyle } from '../types';

// Updated interface to match the simple usage pattern
export const useElementActions = (
  frames: Frame[],
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>,
  currentFrame: number,
  lineStyleParams?: {
    selectedLineStyle: LineStyle;
    lineColor: string;
    customColor: string;
    curveOffset: number;
  }
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{x: number; y: number} | null>(null);
  const [lineStart, setLineStart] = useState<{x: number, y: number} | null>(null);
  const [previewLine, setPreviewLine] = useState<LineElement | null>(null);
  const [draggedElement, setDraggedElement] = useState<FootballElement | null>(null);

  // Use the standardized coordinate function from svg-utils
  const getElementCoordinates = useCallback((event: React.MouseEvent<SVGSVGElement> | { clientX: number, clientY: number }, svgElement: SVGSVGElement | null) => {
    if (!svgElement) {
      console.warn('SVG element is not available');
      return { x: 0, y: 0 };
    }
    // Import and use the standardized function
    const { getSVGCoordinates } = require('../lib/svg-utils');
    return getSVGCoordinates(event.clientX, event.clientY, svgElement);
  }, []);

  // Helper function to translate path
  const translatePath = useCallback((d: string, dx: number, dy: number): string => {
    let index = 0;
    return d.replace(/-?\d+(\.\d+)?/g, match => {
      const num = parseFloat(match);
      const newValue = (index % 2 === 0) ? num + dx : num + dy;
      index++;
      return newValue.toString();
    });
  }, []);

  // Update frame element - fix the setFrames call
  const updateFrameElement = useCallback((frameIndex: number, elementId: string, newProps: Partial<FootballElement>) => {
    setFrames(prevFrames => {
      const updatedFrames = [...prevFrames];
      if (updatedFrames[frameIndex]) {
        updatedFrames[frameIndex].elements = updatedFrames[frameIndex].elements.map((el: FootballElement) =>
          el.id === elementId ? ({ ...el, ...newProps } as FootballElement) : el
        );
      }
      return updatedFrames;
    });
  }, [setFrames]);

  // Add element to current frame - fix the setFrames call
  const addElementToCurrentFrame = useCallback((element: FootballElement) => {
    setFrames(prevFrames => {
      const updatedFrames = [...prevFrames];
      if (updatedFrames[currentFrame]) {
        updatedFrames[currentFrame].elements.push(element);
      } else {
        // Create frame if it doesn't exist
        updatedFrames[currentFrame] = {
          elements: [element],
          duration: 1
        };
      }
      return updatedFrames;
    });
  }, [setFrames, currentFrame]);

  // Mouse down handler - fix to use standardized coordinates
  const handleMouseDown = useCallback((event: React.MouseEvent<SVGSVGElement>, tool: Tool, setSelectedElement: (el: FootballElement | null) => void, pitch: string) => {
    const coords = getElementCoordinates(event, event.currentTarget);
    
    if (tool === 'line') {
      setLineStart(coords);
      setIsDragging(true);
      setIsDrawing(true);
      setStartPoint(coords);
    } else if (tool === 'select') {
      // Find clicked element
      const clickedElement = frames[currentFrame]?.elements.find(el => {
        if (el.type === 'line') {
          // Check if click is near line using isPointNearLine function
          const lineElement = el as LineElement;
          return isPointNearLine(coords, lineElement.path, 15); // 15px tolerance
        }
        // Check if click is near other elements
        if (el.x !== undefined && el.y !== undefined) {
          const dx = coords.x - el.x;
          const dy = coords.y - el.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < 30; // Click tolerance
        }
        return false;
      });

      if (clickedElement) {
        setSelectedElement(clickedElement);
      } else {
        setSelectedElement(null);
      }
    }
  }, [frames, currentFrame, getElementCoordinates]);

  // Mouse move handler - fix to use standardized coordinates
  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>, pitch: string) => {
    const coords = getElementCoordinates(event, event.currentTarget);

    if (isDragging && startPoint && draggedElement) {
      // Calculate new position based on mouse movement
      const dx = coords.x - startPoint.x;
      const dy = coords.y - startPoint.y;

      // Only update position for elements that have x,y coordinates
      if (draggedElement.x !== undefined && draggedElement.y !== undefined) {
        const newX = draggedElement.x + dx;
        const newY = draggedElement.y + dy;
        
        // Update the element's position in the current frame
        updateFrameElement(currentFrame, draggedElement.id, { x: newX, y: newY });
        
        // Update the dragged element reference
        setDraggedElement({ ...draggedElement, x: newX, y: newY });
        
        // Update the start point for smooth dragging
        setStartPoint(coords);
      }
    }

    if (isDrawing && lineStart) {
      const selectedLineStyle = lineStyleParams?.selectedLineStyle || 'straight';
      
      const lineProperties = getLineProperties(selectedLineStyle, lineStyleParams?.lineColor || '#000000', lineStyleParams?.curveOffset || 0);
      
      const { curved, dashed, marker, strokeColor } = lineProperties;
      const path = createLinePathMemoized(lineStart, coords, selectedLineStyle, lineStyleParams?.curveOffset);
      
      setPreviewLine({
        id: 'preview-line',
        type: 'line',
        path,
        style: selectedLineStyle,
        modifiers: {}, // Add empty modifiers
        dashed,
        marker,
        color: strokeColor
      });
    }
  }, [isDragging, startPoint, draggedElement, isDrawing, lineStart, getElementCoordinates, lineStyleParams, currentFrame, updateFrameElement]);

  // Mouse up handler - fix to use standardized coordinates
  const handleMouseUp = useCallback((event: React.MouseEvent<SVGSVGElement>, pitch: string) => {
    const coords = getElementCoordinates(event, event.currentTarget);
    
    if (isDrawing && lineStart && lineStyleParams) {
      console.log('🏁 Creating line with params:', {
        lineStyleParams,
        selectedLineStyle: lineStyleParams.selectedLineStyle,
        lineColor: lineStyleParams.lineColor,
        curveOffset: lineStyleParams.curveOffset
      });
      
      const { selectedLineStyle, lineColor, curveOffset } = lineStyleParams;
      
      const { dashed, marker, strokeColor } = getLineProperties(selectedLineStyle, lineColor, curveOffset);
      const finalizedPath = createLinePathMemoized(lineStart, coords, selectedLineStyle, curveOffset);
      
      const dx = coords.x - lineStart.x;
      const dy = coords.y - lineStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        const newLine: LineElement = {
          id: 'line-' + Date.now(),
          type: 'line',
          path: finalizedPath,
          style: selectedLineStyle,
          modifiers: {}, // Add empty modifiers
          dashed,
          marker,
          color: strokeColor,
          curveOffset,
        };

        setFrames(prevFrames => {
          const newFrames = [...prevFrames];
          if (newFrames[currentFrame]) {
            newFrames[currentFrame].elements.push(newLine);
          }
          return newFrames;
        });
      }
    }
    
    // Clear all drag/draw states
    setIsDragging(false);
    setIsDrawing(false);
    setLineStart(null);
    setStartPoint(null);
    setPreviewLine(null);
    setDraggedElement(null);
  }, [isDrawing, lineStart, getElementCoordinates, lineStyleParams, setFrames, currentFrame]);

  // Click handler - fix to accept pitch parameter and ensure frame exists
  const handleClick = useCallback((event: React.MouseEvent<SVGSVGElement>, tool: Tool, currentNumber: number, incrementCurrentNumber: () => void, setSelectedElement: (el: FootballElement | null) => void, pitch: string = 'offensive') => {
    // Ensure frame exists before proceeding
    if (!frames[currentFrame]) {
      console.log('Creating new frame at index:', currentFrame);
      setFrames(prevFrames => {
        const newFrames = [...prevFrames];
        newFrames[currentFrame] = { elements: [], duration: 1 };
        return newFrames;
      });
    }

    const coords = getElementCoordinates(event, event.currentTarget);

    if (tool !== 'select' && tool !== 'line') {
      const baseElement = {
        id: `${tool}-${Date.now()}`,
        x: coords.x,
        y: coords.y,
      };

      let newElement: FootballElement;
      
      switch (tool) {
        case 'player':
        case 'opponent':
          newElement = {
            ...baseElement,
            type: tool,
            number: currentNumber.toString(),
            visible: true
          };
          incrementCurrentNumber();
          break;
        case 'ball':
          newElement = {
            ...baseElement,
            type: 'ball',
            visible: true
          };
          break;
        case 'cone':
          newElement = {
            ...baseElement,
            type: 'cone',
            visible: true
          };
          break;
        case 'text':
          const content = prompt('Skriv inn tekst:');
          if (!content) return;
          newElement = {
            ...baseElement,
            type: 'text',
            content,
            fontSize: 16,
            visible: true
          };
          break;
        default:
          return;
      }

      setFrames(prevFrames => {
        const newFrames = [...prevFrames];
        newFrames[currentFrame].elements.push(newElement);
        return newFrames;
      });
    }
  }, [frames, currentFrame, getElementCoordinates, setFrames]);

  // Touch handlers
  const handleTouchStart = useCallback((event: React.TouchEvent<SVGSVGElement>, tool: Tool, setSelectedElement: (el: FootballElement | null) => void, pitch: string) => {
    const touch = event.touches[0];
    if (!touch) return;
    
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => event.preventDefault(),
      stopPropagation: () => event.stopPropagation(),
      currentTarget: event.currentTarget
    } as React.MouseEvent<SVGSVGElement>;
    
    // Delegate to mouse down handler
    handleMouseDown(mouseEvent, tool, setSelectedElement, pitch);
  }, [handleMouseDown]);

  const handleTouchEnd = useCallback((event: React.TouchEvent<SVGSVGElement>, pitch: string) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => event.preventDefault(),
      stopPropagation: () => event.stopPropagation(),
      currentTarget: event.currentTarget
    } as React.MouseEvent<SVGSVGElement>;
    
    // Delegate to mouse up handler
    handleMouseUp(mouseEvent, pitch);
  }, [handleMouseUp]);

  // Element click handler
  const handleElementClick = useCallback((event: React.MouseEvent, element: FootballElement) => {
    event.stopPropagation();
    // This function now expects to be wrapped with setSelectedElement
    // The wrapper will handle calling setSelectedElement(element)
  }, []);

  // Element drag start handler
  const handleElementDragStart = useCallback((event: React.MouseEvent, element: FootballElement, svgRef: React.RefObject<SVGSVGElement>, pitch: string) => {
    event.preventDefault();
    event.stopPropagation();
    
    const coords = getElementCoordinates(event, svgRef.current);
    setIsDragging(true);
    setDraggedElement(element);
    setStartPoint(coords);
  }, [getElementCoordinates]);

  // Delete element handler
  const handleDeleteElement = useCallback(() => {
    // Implement delete logic
  }, []);

  // Double click handlers - fix parameter types
  const handlePlayerNumberDoubleClick = useCallback((event: React.MouseEvent<Element>, element: FootballElement) => {
    event.stopPropagation();
    if (element.type === 'player' || element.type === 'opponent') {
      const playerElement = element as PlayerElement | OpponentElement;
      const newNumber = prompt('Endre nummer:', playerElement.number);
      if (newNumber !== null) {
        updateFrameElement(currentFrame, element.id, { number: newNumber });
      }
    }
  }, [currentFrame, updateFrameElement]);

  const handleTextDoubleClick = useCallback((event: React.MouseEvent<Element>, element: FootballElement) => {
    event.stopPropagation();
    if (element.type === 'text') {
      const textElement = element as TextElement;
      const newContent = prompt('Rediger tekst:', textElement.content);
      if (newContent !== null) {
        updateFrameElement(currentFrame, element.id, { content: newContent });
      }
    }
  }, [currentFrame, updateFrameElement]);

  const handleAreaDoubleClick = useCallback((event: React.MouseEvent<Element>, element: FootballElement) => {
    event.stopPropagation();
    // Implement area double click
  }, []);

  return {
    isDragging,
    isDrawing,
    startPoint,
    lineStart,
    previewLine,
    addElementToCurrentFrame,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClick,
    handleTouchStart,
    handleTouchEnd,
    handleElementClick,
    handleElementDragStart,
    handleDeleteElement,
    handlePlayerNumberDoubleClick,
    handleTextDoubleClick,
    handleAreaDoubleClick,
    updateFrameElement
  };
};