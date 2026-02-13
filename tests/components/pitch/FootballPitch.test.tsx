import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FootballPitch from '../../../src/components/pitch/FootballPitch';
import TacticsBoard from '../../../src/components/core/TacticsBoard';
import { FootballElement } from '../../../src/@types/elements';

// Mock props for TacticsBoard
const defaultProps = {
  svgRef: { current: null },
  pitch: 'fullLandscape' as const,
  zoomLevel: 1,
  showGuidelines: false as const,
  elements: [] as FootballElement[],
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

describe('FootballPitch component', () => {
    test('renders full landscape pitch correctly', () => {
        const { container } = render(
            <svg>
                <FootballPitch pitchType="fullLandscape" />
            </svg>
        );
        
        // Should have main pitch rectangle
        const pitchRect = container.querySelector('rect[width="1050"][height="680"]');
        expect(pitchRect).toBeInTheDocument();
        
        // Should have center circle
        const centerCircle = container.querySelector('circle[cx="525"][cy="340"]');
        expect(centerCircle).toBeInTheDocument();
    });

    test('renders handball pitch correctly', () => {
        const { container } = render(
            <svg>
                <FootballPitch pitchType="handball" />
            </svg>
        );
        
        // Should have handball pitch dimensions
        const handballRect = container.querySelector('rect[width="680"][height="340"]');
        expect(handballRect).toBeInTheDocument();
    });

    test('renders guidelines when enabled', () => {
        const { container } = render(
            <svg>
                <FootballPitch pitchType="fullLandscape" showGuidelines="full" />
            </svg>
        );
        
        // Should have guideline elements
        const guidelines = container.querySelectorAll('line[stroke-dasharray="5,5"]');
        expect(guidelines.length).toBeGreaterThan(0);
    });

    test('does not render guidelines when disabled', () => {
        const { container } = render(
            <svg>
                <FootballPitch pitchType="fullLandscape" showGuidelines={false} />
            </svg>
        );
        
        // Should not have dashed guideline elements
        const guidelines = container.querySelectorAll('line[stroke-dasharray="5,5"]');
        expect(guidelines.length).toBe(0);
    });

    test('renders penalty arc outside 16m on offensive half (goal up)', () => {
      const { container } = render(
        <svg>
          <FootballPitch pitchType="offensive" />
        </svg>
      );

      // Expect a path using the 9.15m arc radius (scaled: 91.5)
      const arc = container.querySelector('path[d*="A 91.5 91.5"]');
      expect(arc).toBeInTheDocument();
    });

    test('renders penalty arc outside 16m on defensive half (goal down)', () => {
      const { container } = render(
        <svg>
          <FootballPitch pitchType="defensive" />
        </svg>
      );

      // Expect a path using the 9.15m arc radius (scaled: 91.5)
      const arc = container.querySelector('path[d*="A 91.5 91.5"]');
      expect(arc).toBeInTheDocument();
    });
});

describe('Zoom Level', () => {
  it('should apply zoom level correctly', () => {
    const zoomLevels = [0.5, 1, 1.5, 2];
    
    zoomLevels.forEach(zoom => {
      const { container, unmount } = render(<TacticsBoard {...defaultProps} zoomLevel={zoom} />);
      
      const tacticsBoard = container.querySelector('[data-testid="tactics-board-container"]');
      expect(tacticsBoard).toBeInTheDocument();
      expect(tacticsBoard).toHaveStyle(`transform: scale(${zoom})`);
      
      // Unmount to avoid conflicts
      unmount();
    });
  });
});

describe('Error Handling', () => {
  it('should handle invalid elements gracefully', () => {
    const invalidElements = [
      null,
      undefined,
      { id: null, type: 'player' },
      { id: 'valid-1', type: null },
      { id: 'valid-2', type: 'player', x: 100, y: 100, number: '1', visible: true }
    ] as any[];

    expect(() => {
      render(<TacticsBoard {...defaultProps} elements={invalidElements} />);
    }).not.toThrow();
  });

  it('should handle missing SVG ref', () => {
    const { container } = render(<TacticsBoard {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});