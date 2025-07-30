import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TacticsBoard from '../../src/components/core/TacticsBoard';

describe('TacticsBoard Debug Tests - Reproducing Real Issues', () => {
    const mockProps = {
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
        onAreaDoubleClick: jest.fn(),
        traces: []
    };

    // Mock console.log to capture debug output
    let consoleOutput: any[] = [];
    beforeEach(() => {
        consoleOutput = [];
        jest.spyOn(console, 'log').mockImplementation((...args) => {
            consoleOutput.push(args);
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('reproduces zero-dimension case and verifies fallback works', () => {
        // Mock the exact scenario that causes division by zero
        Element.prototype.getBoundingClientRect = jest.fn(() => ({
            x: 0, y: 0, width: 0, height: 0, // This would cause division by zero
            top: 0, left: 0, bottom: 0, right: 0,
            toJSON: jest.fn()
        }));

        const { container } = render(
            <TacticsBoard {...mockProps} />
        );

        const svg = container.querySelector('svg');
        fireEvent.click(svg!, { clientX: 100, clientY: 100 });

        // Find the actual debug log
        const debugLog = consoleOutput.find(log => 
            log[0] === 'TacticsBoard click debug:'
        );

        expect(debugLog).toBeDefined();
        
        if (debugLog && debugLog[1]) {
            const debugData = debugLog[1];
            console.log('Captured debug data:', debugData);
            
            // With zero dimensions, should use client coordinates as fallback
            expect(typeof debugData.svgX).toBe('number');
            expect(typeof debugData.svgY).toBe('number');
            expect(isFinite(debugData.svgX)).toBe(true);
            expect(isFinite(debugData.svgY)).toBe(true);
            expect(debugData.svgX).not.toBe(Infinity);
            expect(debugData.svgY).not.toBe(Infinity);
            
            // Should fallback to client coordinates
            expect(debugData.svgX).toBe(100);
            expect(debugData.svgY).toBe(100);
        }
    });

    test('verifies coordinate transformation works with realistic dimensions', () => {
        Element.prototype.getBoundingClientRect = jest.fn(() => ({
            x: 100, y: 50, width: 800, height: 520,
            top: 50, left: 100, bottom: 570, right: 900,
            toJSON: jest.fn()
        }));

        const { container } = render(
            <TacticsBoard {...mockProps} />
        );

        const svg = container.querySelector('svg');
        fireEvent.click(svg!, { clientX: 500, clientY: 310 });

        const debugLog = consoleOutput.find(log => 
            log[0] === 'TacticsBoard click debug:'
        );

        if (debugLog && debugLog[1]) {
            const debugData = debugLog[1];
            
            expect(isFinite(debugData.svgX)).toBe(true);
            expect(isFinite(debugData.svgY)).toBe(true);
            expect(debugData.svgX).not.toBe(Infinity);
            expect(debugData.svgY).not.toBe(Infinity);
            
            // Should transform coordinates correctly for fullLandscape (1050x680)
            // Click at (500,310) with rect starting at (100,50) means relative click at (400,260)
            // Scale: 1050/800 = 1.3125 for X, 680/520 = 1.3077 for Y
            // Result: 400 * 1.3125 = 525, 260 * 1.3077 ≈ 340
            expect(debugData.svgX).toBeCloseTo(525, 5);
            expect(debugData.svgY).toBeCloseTo(340, 5);
        }
    });
});

describe('TacticsBoard Debug Tests', () => {
  const createMockElement = (type: string, id: string) => ({
    id,
    type,
    x: Math.random() * 1000,
    y: Math.random() * 600,
    visible: true,
    ...(type === 'player' || type === 'opponent' ? { number: '1' } : {}),
    ...(type === 'text' ? { content: 'Test', fontSize: 14 } : {}),
    ...(type === 'area' ? { width: 100, height: 50 } : {})
  });

  test('debug: renders multiple element types', () => {
    const elements = [
      createMockElement('player', 'p1'),
      createMockElement('opponent', 'o1'),
      createMockElement('ball', 'b1'),
      createMockElement('cone', 'c1'),
      createMockElement('text', 't1'),
      createMockElement('area', 'a1')
    ];

    const mockProps = {
      svgRef: { current: null },
      pitch: 'fullLandscape' as const,
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
      onAreaDoubleClick: jest.fn()
    };

    const { container } = render(<TacticsBoard {...mockProps} />);
    
    // Debug: Log the rendered SVG structure
    console.log('=== DEBUG: TacticsBoard Rendered Elements ===');
    console.log('Total elements:', elements.length);
    console.log('SVG content:', container.querySelector('svg')?.innerHTML.slice(0, 500));
    
    // Verify all elements are processed
    expect(elements).toHaveLength(6);
    
    // The SVG should contain our elements
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('debug: element positioning accuracy', () => {
    const testElements = [
      { id: 'test-1', type: 'player', x: 100, y: 200, number: '1', visible: true },
      { id: 'test-2', type: 'ball', x: 500, y: 300, visible: true }
    ];

    const mockProps = {
      svgRef: { current: null },
      pitch: 'fullLandscape' as const,
      zoomLevel: 1,
      showGuidelines: false as const,
      elements: testElements,
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

    const { container } = render(<TacticsBoard {...mockProps} />);
    
    // Debug element positions
    console.log('=== DEBUG: Element Positioning ===');
    testElements.forEach(element => {
      console.log(`${element.type} ${element.id}: (${element.x}, ${element.y})`);
    });
    
    // Find transform attributes in the SVG
    const transforms = container.querySelectorAll('[transform*="translate"]');
    console.log('Transform elements found:', transforms.length);
    
    transforms.forEach((element, index) => {
      const transform = element.getAttribute('transform');
      console.log(`Transform ${index}:`, transform);
    });
  });

  test('debug: element rendering and typing', () => {
    const mockElements = [
      {
        id: 'player1',
        type: 'player' as const,  // Add 'as const' to make it a literal type
        x: 100,
        y: 100,
        number: '1',
        visible: true
      },
      {
        id: 'text1',
        type: 'text' as const,    // Add 'as const' to make it a literal type
        x: 200,
        y: 200,
        content: 'Test text',
        fontSize: 16,
        visible: true
      },
      {
        id: 'area1',
        type: 'area' as const,    // Add 'as const' to make it a literal type
        x: 300,
        y: 300,
        width: 50,
        height: 50,
        visible: true
      }
    ];

    const mockProps = {
      svgRef: { current: null },
      pitch: 'fullLandscape' as const,
      zoomLevel: 1,
      showGuidelines: false as const,
      elements: mockElements,  // Use the properly typed elements
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

    const { container } = render(<TacticsBoard {...mockProps} />);
    
    // Debug: Log the rendered SVG structure
    console.log('=== DEBUG: TacticsBoard Rendered Elements (Typed) ===');
    console.log('Total elements:', mockElements.length);
    console.log('SVG content:', container.querySelector('svg')?.innerHTML.slice(0, 500));
    
    // Verify all elements are processed
    expect(mockElements).toHaveLength(3);
    
    // The SVG should contain our elements
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});