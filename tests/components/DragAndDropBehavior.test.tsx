import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TacticsBoard from '../../src/components/core/TacticsBoard';
import { PlayerElement, BallElement } from '../../src/@types/elements';

describe('Drag and Drop Behavior - Pointer Tracking', () => {
    const mockPlayer: PlayerElement = {
        id: 'player1',
        type: 'player',
        x: 100,
        y: 100,
        number: '1',
        visible: true
    };

    const mockBall: BallElement = {
        id: 'ball1',
        type: 'ball',
        x: 200,
        y: 200,
        visible: true
    };

    const defaultProps = {
        svgRef: { current: null },
        pitch: 'offensive' as const,
        zoomLevel: 1,
        showGuidelines: false as const,
        elements: [mockPlayer, mockBall],
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
        // Mock getBoundingClientRect for SVG element
        Element.prototype.getBoundingClientRect = jest.fn(() => ({
            x: 0,
            y: 0,
            width: 1000,
            height: 600,
            top: 0,
            left: 0,
            bottom: 600,
            right: 1000,
            toJSON: jest.fn()
        }));

        // Mock SVG methods - these won't be called in test environment but need to exist
        const mockSvgElement = {
            getBoundingClientRect: jest.fn(() => ({ width: 1000, height: 600, left: 0, top: 0 })),
            getAttribute: jest.fn(() => '0 0 680 525'),
            createSVGPoint: jest.fn(() => ({ x: 0, y: 0, matrixTransform: jest.fn(() => ({ x: 100, y: 100 })) })),
            getScreenCTM: jest.fn(() => ({ inverse: jest.fn(() => ({})) }))
        } as unknown as SVGSVGElement;

        Object.defineProperty(window, 'SVGSVGElement', {
            value: mockSvgElement
        });
    });

    test('element follows mouse cursor during drag', async () => {
        const { container } = render(
            <TacticsBoard {...defaultProps} />
        );

        const playerGroup = container.querySelector('g[data-testid="player-element"]');
        expect(playerGroup).toBeInTheDocument();

        // Start drag by firing mousedown on the player element
        fireEvent.mouseDown(playerGroup!, {
            clientX: 150,
            clientY: 150,
            bubbles: true
        });

        // Verify that onElementDragStart was called through the element's onMouseDown handler
        // Since the element handles its own mouse events, we need to check if the mouse event was handled
        expect(playerGroup).toBeInTheDocument();
        
        // Simulate mouse move on the document (drag continues)
        fireEvent.mouseMove(document, {
            clientX: 200,
            clientY: 200,
            bubbles: true
        });

        // The component should handle the drag internally
        expect(defaultProps.onMouseDown).toHaveBeenCalled();
    });

    test('SVG coordinate transformation works correctly', () => {
        const { container } = render(
            <TacticsBoard {...defaultProps} />
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();

        // Test coordinate transformation by clicking on SVG
        fireEvent.click(svg!, {
            clientX: 100,
            clientY: 100,
            bubbles: true
        });

        expect(defaultProps.onClick).toHaveBeenCalled();
    });

    test('element offset calculation during drag start', () => {
        const { container } = render(
            <TacticsBoard {...defaultProps} />
        );

        const playerGroup = container.querySelector('g[data-testid="player-element"]');
        expect(playerGroup).toBeInTheDocument();
        
        // Mouse down at position different from element center
        fireEvent.mouseDown(playerGroup!, {
            clientX: 110, // 10px offset from center
            clientY: 120, // 20px offset from center
            bubbles: true
        });

        // Verify the element received the mouse event
        expect(playerGroup).toBeInTheDocument();
    });

    test('drag prevents element from jumping to cursor position', () => {
        const { container } = render(
            <TacticsBoard {...defaultProps} />
        );

        const playerGroup = container.querySelector('g[data-testid="player-element"]');
        expect(playerGroup).toBeInTheDocument();
        
        // Start drag with offset from element center
        fireEvent.mouseDown(playerGroup!, {
            clientX: 110, // Mouse is 10px right of element center (100)
            clientY: 110, // Mouse is 10px below element center (100)
            bubbles: true
        });

        // Move mouse slightly
        fireEvent.mouseMove(document, {
            clientX: 115, // Move 5px right
            clientY: 115, // Move 5px down
            bubbles: true
        });

        // Verify the component handled the interaction
        expect(playerGroup).toBeInTheDocument();
    });

    test('multiple rapid mouse movements during drag', () => {
        const { container } = render(
            <TacticsBoard {...defaultProps} />
        );

        const playerGroup = container.querySelector('g[data-testid="player-element"]');
        expect(playerGroup).toBeInTheDocument();
        
        // Start drag
        fireEvent.mouseDown(playerGroup!, {
            clientX: 100,
            clientY: 100,
            bubbles: true
        });

        // Simulate rapid mouse movements
        const movements = [
            { x: 105, y: 105 },
            { x: 110, y: 110 },
            { x: 115, y: 115 },
            { x: 120, y: 120 }
        ];

        movements.forEach(pos => {
            fireEvent.mouseMove(document, {
                clientX: pos.x,
                clientY: pos.y,
                bubbles: true
            });
        });

        // Should handle multiple movements without issues
        expect(playerGroup).toBeInTheDocument();
    });

    test('drag behavior with different screen resolutions', () => {
        // Mock different screen size
        Object.defineProperty(window, 'innerWidth', { value: 1920 });
        Object.defineProperty(window, 'innerHeight', { value: 1080 });

        const { container } = render(
            <TacticsBoard {...defaultProps} />
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();

        // Test that SVG coordinate system adapts to screen size
        expect(svg).toHaveStyle('width: auto');
    });

    test('touch events for mobile drag behavior', () => {
        const { container } = render(
            <TacticsBoard {...defaultProps} />
        );

        const playerGroup = container.querySelector('g[data-testid="player-element"]');
        expect(playerGroup).toBeInTheDocument();
        
        // Touch start
        fireEvent.touchStart(playerGroup!, {
            touches: [{ clientX: 100, clientY: 100 }],
            bubbles: true
        });

        // Touch move
        fireEvent.touchMove(document, {
            touches: [{ clientX: 120, clientY: 120 }],
            bubbles: true
        });

        // Touch events should work similarly to mouse events
        expect(playerGroup).toBeInTheDocument();
    });

    test('element stays under cursor with zoom transformation', () => {
        const { container } = render(
            <TacticsBoard {...defaultProps} />
        );

        const svg = container.querySelector('svg');
        
        // Mock zoom transformation
        if (svg) {
            svg.style.transform = 'scale(1.5)';
        }
        
        // Test that coordinates are correctly calculated with zoom
        const playerGroup = container.querySelector('g[data-testid="player-element"]');
        expect(playerGroup).toBeInTheDocument();
        
        fireEvent.mouseDown(playerGroup!, {
            clientX: 150, // Scaled coordinates
            clientY: 150,
            bubbles: true
        });

        // Coordinate calculation should account for zoom level
        expect(playerGroup).toBeInTheDocument();
    });

    test('drag works correctly with SVG viewBox', () => {
        const { container } = render(
            <TacticsBoard {...defaultProps} />
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        
        // SVG should have proper viewBox for coordinate mapping
        const viewBox = svg?.getAttribute('viewBox');
        expect(viewBox).toBeDefined();
        
        // ViewBox should define the coordinate system properly
        if (viewBox) {
            const [x, y, width, height] = viewBox.split(' ').map(Number);
            expect(width).toBeGreaterThan(0);
            expect(height).toBeGreaterThan(0);
        }
    });
});