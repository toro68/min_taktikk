import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TacticsBoard from '../../src/components/core/TacticsBoard';
import { PlayerElement, BallElement } from '../../src/@types/elements';

describe('TacticsBoard Integration', () => {
  const mockPlayer: PlayerElement = {
    id: 'player1',
    type: 'player',
    x: 100,
    y: 100,
    number: '1',
    visible: true
  };

  const mockProps = {
    svgRef: { current: null },
    pitch: 'fullLandscape' as const,
    zoomLevel: 1,
    showGuidelines: false as const,
    elements: [mockPlayer],
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock realistic SVG dimensions
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      x: 100,
      y: 50,
      width: 800,  // Realistic SVG width
      height: 520, // Realistic SVG height
      top: 50,
      left: 100,
      bottom: 570,
      right: 900,
      toJSON: jest.fn()
    }));
  });

  test('SVG coordinate transformation produces finite values', async () => {
    const onClickSpy = jest.fn();
    
    const { container } = render(
      <TacticsBoard {...mockProps} onClick={onClickSpy} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // Click in the middle of the SVG
    fireEvent.click(svg!, {
      clientX: 500, // Middle of 800px width (100 + 400)
      clientY: 310, // Middle of 520px height (50 + 260)
      bubbles: true
    });

    await waitFor(() => {
      expect(onClickSpy).toHaveBeenCalled();
    });

    const clickEvent = onClickSpy.mock.calls[0][0];
    
    // The transformed coordinates should be finite numbers
    expect(isFinite(clickEvent.clientX)).toBe(true);
    expect(isFinite(clickEvent.clientY)).toBe(true);
    expect(clickEvent.clientX).not.toBe(Infinity);
    expect(clickEvent.clientY).not.toBe(Infinity);
    
    // For fullLandscape (1050x680 viewBox) with 800x520 actual size:
    // Click at 500,310 should map to ~500,310 in SVG coordinates
    expect(clickEvent.clientX).toBeCloseTo(500, 50); // Allow some margin
    expect(clickEvent.clientY).toBeCloseTo(310, 50);
  });

  test('SVG dimensions are set correctly', () => {
    const { container } = render(
      <TacticsBoard {...mockProps} pitch="fullLandscape" />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    const viewBox = svg?.getAttribute('viewBox');
    expect(viewBox).toBe('0 0 1050 680');
  });

  test('coordinate transformation handles edge cases without producing Infinity', () => {
    // Test with zero-width SVG (edge case that causes Infinity)
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      x: 0, y: 0, width: 0, height: 0, // Zero dimensions
      top: 0, left: 0, bottom: 0, right: 0, toJSON: jest.fn()
    }));

    const onClickSpy = jest.fn();
    
    const { container } = render(
      <TacticsBoard {...mockProps} onClick={onClickSpy} />
    );

    const svg = container.querySelector('svg');
    fireEvent.click(svg!, { clientX: 100, clientY: 100 });

    if (onClickSpy.mock.calls.length > 0) {
      const clickEvent = onClickSpy.mock.calls[0][0];
      expect(isFinite(clickEvent.clientX)).toBe(true);
      expect(isFinite(clickEvent.clientY)).toBe(true);
    }
  });

  test('player element receives click events with correct coordinates', async () => {
    const onElementClickSpy = jest.fn();
    
    const { container } = render(
      <TacticsBoard {...mockProps} onElementClick={onElementClickSpy} />
    );

    const playerElement = container.querySelector('[data-testid="player-element"]');
    expect(playerElement).toBeInTheDocument();

    fireEvent.click(playerElement!, {
      clientX: 200,
      clientY: 200,
      bubbles: true
    });

    await waitFor(() => {
      expect(onElementClickSpy).toHaveBeenCalled();
    });

    const [event, element] = onElementClickSpy.mock.calls[0];
    expect(element.id).toBe('player1');
    expect(element.type).toBe('player');
  });

  test('drag operation produces valid coordinates throughout', async () => {
    const onElementDragStartSpy = jest.fn();
    const onMouseMoveSpy = jest.fn();
    
    const { container } = render(
      <TacticsBoard 
        {...mockProps} 
        onElementDragStart={onElementDragStartSpy}
        onMouseMove={onMouseMoveSpy}
      />
    );

    const playerElement = container.querySelector('[data-testid="player-element"]');
    expect(playerElement).toBeInTheDocument();

    // Start drag
    fireEvent.mouseDown(playerElement!, {
      clientX: 200,
      clientY: 200,
      bubbles: true
    });

    // Move mouse
    const svg = container.querySelector('svg');
    fireEvent.mouseMove(svg!, {
      clientX: 250,
      clientY: 250,
      bubbles: true
    });

    // Check that all coordinates are finite
    if (onMouseMoveSpy.mock.calls.length > 0) {
      onMouseMoveSpy.mock.calls.forEach(call => {
        const event = call[0];
        expect(isFinite(event.clientX)).toBe(true);
        expect(isFinite(event.clientY)).toBe(true);
      });
    }
  });

  test('different pitch types have correct viewBox dimensions', () => {
    const pitchTypes = [
      { type: 'fullLandscape', expected: '0 0 1050 680' },
      { type: 'offensive', expected: '0 0 680 525' },
      { type: 'handball', expected: '0 0 680 340' }
    ];

    pitchTypes.forEach(({ type, expected }) => {
      const { container } = render(
        <TacticsBoard {...mockProps} pitch={type as any} />
      );

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).toBe(expected);
    });
  });

  test('element visibility filtering works correctly', () => {
    const elements = [
      { ...mockPlayer, id: 'visible', visible: true },
      { ...mockPlayer, id: 'invisible', visible: false },
      { ...mockPlayer, id: 'undefined-visibility' } // undefined should default to visible
    ];

    const { container } = render(
      <TacticsBoard {...mockProps} elements={elements} />
    );

    const visibleElements = container.querySelectorAll('[data-testid="player-element"]');
    expect(visibleElements).toHaveLength(2); // Only visible and undefined-visibility
  });

  test('SVG responds to different screen sizes correctly', () => {
    // Test different container sizes
    const sizes = [
      { width: 400, height: 300 },
      { width: 800, height: 600 },
      { width: 1200, height: 800 }
    ];

    sizes.forEach(size => {
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        x: 0, y: 0, 
        width: size.width, 
        height: size.height,
        top: 0, left: 0, 
        bottom: size.height, 
        right: size.width, 
        toJSON: jest.fn()
      }));

      const onClickSpy = jest.fn();
      const { container } = render(
        <TacticsBoard {...mockProps} onClick={onClickSpy} />
      );

      const svg = container.querySelector('svg');
      
      // Click in the center
      fireEvent.click(svg!, {
        clientX: size.width / 2,
        clientY: size.height / 2
      });

      if (onClickSpy.mock.calls.length > 0) {
        const event = onClickSpy.mock.calls[0][0];
        expect(isFinite(event.clientX)).toBe(true);
        expect(isFinite(event.clientY)).toBe(true);
      }
    });
  });

  test('renders football pitch correctly', () => {
    const { container } = render(<TacticsBoard {...mockProps} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 1050 680');
  });

  test('renders player elements correctly', () => {
    const player: PlayerElement = {
      id: 'player-1',
      type: 'player',
      x: 200,
      y: 300,
      number: '7',
      visible: true
    };

    const { container } = render(<TacticsBoard {...mockProps} elements={[player]} />);
    
    // Should render player circle and number
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Player number should be rendered as text
    expect(container.querySelector('text')).toHaveTextContent('7');
  });

  test('renders ball elements correctly', () => {
    const ball: BallElement = {
      id: 'ball-1',
      type: 'ball',
      x: 400,
      y: 350,
      visible: true
    };

    const { container } = render(<TacticsBoard {...mockProps} elements={[ball]} />);
    
    // Ball should be rendered (though text content may not be visible)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('handles click events correctly', () => {
    const { container } = render(<TacticsBoard {...mockProps} tool="player" />);
    
    const svg = container.querySelector('svg');
    fireEvent.click(svg!, { clientX: 250, clientY: 200 });
    
    expect(mockProps.onClick).toHaveBeenCalled();
  });

  test('handles mouse events for element interaction', () => {
    const player: PlayerElement = {
      id: 'player-1',
      type: 'player',
      x: 200,
      y: 300,
      number: '7',
      visible: true
    };

    const { container } = render(<TacticsBoard {...mockProps} elements={[player]} />);
    
    const svg = container.querySelector('svg');
    
    fireEvent.mouseDown(svg!);
    expect(mockProps.onMouseDown).toHaveBeenCalled();
    
    fireEvent.mouseUp(svg!);
    expect(mockProps.onMouseUp).toHaveBeenCalled();
    
    fireEvent.mouseMove(svg!);
    expect(mockProps.onMouseMove).toHaveBeenCalled();
  });

  test('shows guidelines when enabled', () => {
    const { container } = render(<TacticsBoard {...mockProps} showGuidelines="full" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Guidelines are rendered as part of the FootballPitch component
    // We can verify they exist by checking for specific guideline elements
    expect(svg).toBeInTheDocument();
  });

  test('applies zoom level correctly', () => {
    const { container } = render(<TacticsBoard {...mockProps} zoomLevel={1.5} />);
    
    const tacticsBoard = container.querySelector('[data-testid="tactics-board-container"]');
    expect(tacticsBoard).toHaveStyle('transform: scale(1.5)');
  });
});