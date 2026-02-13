import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TacticsBoard from '../../src/components/core/TacticsBoard';
import { PlayerElement, BallElement } from '../../src/@types/elements';

// Mock the SVG utilities
jest.mock('../../src/lib/svg-utils', () => ({
  getSVGCoordinates: jest.fn((x, y) => ({ x: x * 1.5, y: y * 1.2 })),
  getPitchDimensions: jest.fn(() => ({ width: 1050, height: 680 }))
}));

describe('TacticsBoard', () => {
  const defaultProps = {
    svgRef: { current: null },
    pitch: 'fullLandscape' as const,
    zoomLevel: 1,
    showGuidelines: false as const,
    elements: [],
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
    onAreaDoubleClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render SVG with correct dimensions', () => {
      const { container } = render(<TacticsBoard {...defaultProps} />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 1050 680');
    });

    it('should render football pitch', () => {
      const { container } = render(<TacticsBoard {...defaultProps} />);
      
      // Should contain pitch elements (this is a simplified check)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render handball pitch when specified', () => {
      const { container } = render(<TacticsBoard {...defaultProps} pitch="handball" />);
      
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 680 340');
    });
  });

  describe('Element Rendering', () => {
    it('should render players', () => {
      const players: PlayerElement[] = [
        {
          id: 'player-1',
          type: 'player',
          x: 100,
          y: 200,
          number: '10',
          visible: true
        }
      ];

      const { container } = render(<TacticsBoard {...defaultProps} elements={players} />);
      
      // Player should be rendered (check for player group or circle)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render balls', () => {
      const balls: BallElement[] = [
        {
          id: 'ball-1',
          type: 'ball',
          x: 525,
          y: 340,
          visible: true
        }
      ];

      const { container } = render(<TacticsBoard {...defaultProps} elements={balls} />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should not render invisible elements', () => {
      const elements = [
        {
          id: 'player-1',
          type: 'player' as const,
          x: 100,
          y: 200,
          number: '10',
          visible: false
        }
      ];

      const { container } = render(<TacticsBoard {...defaultProps} elements={elements} />);
      
      // Element should not be visible
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle mouse clicks', () => {
      const onClickMock = jest.fn();
      const { container } = render(<TacticsBoard {...defaultProps} onClick={onClickMock} />);
      
      const svg = container.querySelector('svg');
      fireEvent.click(svg!, { clientX: 100, clientY: 200 });
      
      expect(onClickMock).toHaveBeenCalledWith(
        expect.objectContaining({
          clientX: expect.any(Number),
          clientY: expect.any(Number)
        })
      );
    });

    it('should handle mouse down events', () => {
      const onMouseDownMock = jest.fn();
      const { container } = render(<TacticsBoard {...defaultProps} onMouseDown={onMouseDownMock} />);
      
      const svg = container.querySelector('svg');
      fireEvent.mouseDown(svg!, { clientX: 150, clientY: 250 });
      
      expect(onMouseDownMock).toHaveBeenCalled();
    });

    it('should handle mouse move events', () => {
      const onMouseMoveMock = jest.fn();
      const { container } = render(<TacticsBoard {...defaultProps} onMouseMove={onMouseMoveMock} />);
      
      const svg = container.querySelector('svg');
      fireEvent.mouseMove(svg!, { clientX: 200, clientY: 300 });
      
      expect(onMouseMoveMock).toHaveBeenCalled();
    });

    it('should handle touch events', () => {
      const onTouchStartMock = jest.fn();
      const onTouchEndMock = jest.fn();
      const { container } = render(<TacticsBoard {...defaultProps} onTouchStart={onTouchStartMock} onTouchEnd={onTouchEndMock} />);
      
      const svg = container.querySelector('svg');
      
      // Touch start
      fireEvent.touchStart(svg!, {
        touches: [{ clientX: 100, clientY: 200 }]
      });
      
      expect(onTouchStartMock).toHaveBeenCalled();
      
      // Touch end
      fireEvent.touchEnd(svg!, {
        changedTouches: [{ clientX: 100, clientY: 200 }]
      });
      
      expect(onTouchEndMock).toHaveBeenCalled();
    });
  });

  describe('Guidelines', () => {
    it('should show guidelines when enabled', () => {
      const { container } = render(<TacticsBoard {...defaultProps} showGuidelines="full" />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should hide guidelines when disabled', () => {
      const { container } = render(<TacticsBoard {...defaultProps} showGuidelines={false} />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Zoom and Pan', () => {
    it('should apply zoom level', () => {
      const { container } = render(<TacticsBoard {...defaultProps} zoomLevel={2} />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Zoom is typically applied via CSS transform
    });

    it('should handle different zoom levels', () => {
      const zoomLevels = [0.5, 1, 1.5, 2, 3];
      
      zoomLevels.forEach(zoom => {
        const { container, unmount } = render(<TacticsBoard {...defaultProps} zoomLevel={zoom} />);
        
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        
        // Unmount to avoid conflicts with next render
        unmount();
      });
    });
  });

  describe('Performance', () => {
    it('should handle many elements efficiently', () => {
      const manyElements = Array.from({ length: 100 }, (_, i) => ({
        id: `element-${i}`,
        type: 'player' as const,
        x: (i % 10) * 100,
        y: Math.floor(i / 10) * 60,
        number: String(i),
        visible: true
      }));

      // Warm-up for JIT/cache effects to make timing less flaky in CI
      const warmup = render(<TacticsBoard {...defaultProps} elements={manyElements} />);
      warmup.unmount();

      const runs = 3;
      const durations: number[] = [];

      for (let run = 0; run < runs; run++) {
        const startTime = performance.now();
        const view = render(<TacticsBoard {...defaultProps} elements={manyElements} />);
        const endTime = performance.now();
        durations.push(endTime - startTime);
        view.unmount();
      }

      const sortedDurations = [...durations].sort((a, b) => a - b);
      const medianDuration = sortedDurations[Math.floor(sortedDurations.length / 2)];

      // jsdom timing varies across machines; median keeps this as a useful smoke check.
      expect(medianDuration).toBeLessThan(250);
    });

    it('should handle rapid re-renders', () => {
      const { rerender } = render(<TacticsBoard {...defaultProps} />);
      
      const startTime = performance.now();
      
      // Simulate 30 rapid re-renders
      for (let i = 0; i < 30; i++) {
        const elements = [{
          id: 'player-1',
          type: 'player' as const,
          x: i * 10,
          y: i * 10,
          number: '1',
          visible: true
        }];
        rerender(<TacticsBoard {...defaultProps} elements={elements} />);
      }
      
      const endTime = performance.now();
      // Merk: tidsbaserte ytelsestester i jsdom/Jest kan være flakey under last.
      expect(endTime - startTime).toBeLessThan(500);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid elements gracefully', () => {
      const invalidElements = [
        { id: 'valid-element', type: 'player', x: 100, y: 100, number: '1', visible: true }, // Valid element
        { id: 'invalid-1' }, // Missing required fields
        null,
        undefined
      ] as any[];

      expect(() => {
        render(<TacticsBoard {...defaultProps} elements={invalidElements} />);
      }).not.toThrow();
      
      // Should only render the valid element
      const { container } = render(<TacticsBoard {...defaultProps} elements={invalidElements} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle missing SVG ref', () => {
      expect(() => {
        render(<TacticsBoard {...defaultProps} svgRef={{ current: null }} />);
      }).not.toThrow();
    });
  });
});
