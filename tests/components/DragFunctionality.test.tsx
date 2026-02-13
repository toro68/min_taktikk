import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TacticsBoard from '../../src/components/core/TacticsBoard';
import { PlayerElement, OpponentElement, BallElement } from '../../src/@types/elements';

/**
 * Test suite to verify that the drag functionality is working correctly
 * This tests the fix for the issue where players and other elements couldn't be moved
 */
describe('Drag Functionality', () => {
  const mockPlayer: PlayerElement = {
    id: 'player1',
    type: 'player',
    x: 300,
    y: 300,
    number: '1',
    visible: true
  };

  const mockOpponent: OpponentElement = {
    id: 'opponent1',
    type: 'opponent',
    x: 150,
    y: 150,
    number: '2',
    visible: true
  };

  const mockBall: BallElement = {
    id: 'ball1',
    type: 'ball',
    x: 350,
    y: 350,
    visible: true
  };

  const createMockProps = (elements: any[] = [mockPlayer]) => ({
    svgRef: { current: null },
    pitch: 'offensive' as const,
    zoomLevel: 1,
    showGuidelines: false as const,
    elements,
    selectedElement: null,
    tool: 'select' as const,
    previewLine: null,
    areaPreview: null,
    onMouseDown: jest.fn(),
    onMouseUp: jest.fn(),
    onMouseMove: jest.fn(),
    onClick: jest.fn(),
    onTouchStart: jest.fn(),
    onTouchEnd: jest.fn(),
    onElementClick: jest.fn(),
    onElementDragStart: jest.fn(),
    onPlayerNumberDoubleClick: jest.fn(),
    onTextDoubleClick: jest.fn(),
    onAreaDoubleClick: jest.fn(),
    traces: []
  });

  test('should call onElementDragStart when element is dragged', () => {
    const props = createMockProps();
    render(<TacticsBoard {...props} />);
    
    // Find the player element container
    const playerElement = screen.getByRole('img').querySelector('[data-testid="player-element"]');
    expect(playerElement).toBeInTheDocument();
    
    if (playerElement) {
      // Simulate mouse down on the player
      fireEvent.mouseDown(playerElement, {
        clientX: 300,
        clientY: 300,
        bubbles: true
      });
      
      // Verify that onElementDragStart was called
      expect(props.onElementDragStart).toHaveBeenCalled();
    }
  });

  test('should handle drag events on different element types', () => {
    const props = createMockProps([mockPlayer, mockOpponent, mockBall]);
    render(<TacticsBoard {...props} />);
    
    // Find draggable element containers (g elements with data-testid or with cursor: move/pointer)
    const svg = screen.getByRole('img');
    const playerElement = svg.querySelector('[data-testid="player-element"]');
    const opponentElement = svg.querySelector('[data-testid="opponent-element"]');
    const ballElement = svg.querySelector('[data-testid="ball-element"]');
    
    const draggableElements = [playerElement, opponentElement, ballElement].filter(Boolean) as Element[];
    expect(draggableElements.length).toBe(3);
    
    // Test dragging each element
    draggableElements.forEach((element) => {
      fireEvent.mouseDown(element, {
        clientX: 200,
        clientY: 200,
        bubbles: true
      });
    });
    
    // Verify that onElementDragStart was called for each element
    expect(props.onElementDragStart).toHaveBeenCalledTimes(draggableElements.length);
  });

  test('should handle mouse events correctly during drag', () => {
    const props = createMockProps();
    render(<TacticsBoard {...props} />);
    
    const svg = screen.getByRole('img');
    const playerElement = svg.querySelector('[data-testid="player-element"]');
    
    if (playerElement) {
      // Start drag
      fireEvent.mouseDown(playerElement, {
        clientX: 300,
        clientY: 300,
        bubbles: true
      });
      
      // Move mouse
      fireEvent.mouseMove(svg, {
        clientX: 400,
        clientY: 400,
        bubbles: true
      });
      
      // End drag
      fireEvent.mouseUp(svg, {
        clientX: 400,
        clientY: 400,
        bubbles: true
      });
      
      // Verify event handlers were called
      expect(props.onElementDragStart).toHaveBeenCalled();
      expect(props.onMouseMove).toHaveBeenCalled();
      expect(props.onMouseUp).toHaveBeenCalled();
    }
  });
});
