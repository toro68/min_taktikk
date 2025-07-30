import { getSVGCoordinates, Coordinates } from '../../src/lib/svg-utils';

describe('SVG Coordinate Utils - Browser-like Tests', () => {
  describe('Real Browser Scenarios', () => {
    it('should simulate mouse click on player position', () => {
      // Simulate a real browser scenario where user clicks to place a player
      const svgElement = global.testUtils.mockSVGElement({
        width: 800,
        height: 520,
        left: 50,
        top: 100
      });

      // User clicks at screen position (400, 300) - should be roughly center
      const mouseEvent = {
        clientX: 400,
        clientY: 300
      };

      const svgCoords = getSVGCoordinates(mouseEvent.clientX, mouseEvent.clientY, svgElement);
      
      // Should return valid coordinates within pitch bounds
      expect(svgCoords.x).toBeGreaterThanOrEqual(0);
      expect(svgCoords.x).toBeLessThanOrEqual(1050);
      expect(svgCoords.y).toBeGreaterThanOrEqual(0);
      expect(svgCoords.y).toBeLessThanOrEqual(680);
    });

    it('should handle touch events on mobile', () => {
      // Simulate mobile viewport
      const mobileSVG = global.testUtils.mockSVGElement({
        width: 375,
        height: 243,
        left: 0,
        top: 50
      });

      const touchEvent = {
        clientX: 187.5, // Center X
        clientY: 171.5  // Center Y
      };

      const result = getSVGCoordinates(touchEvent.clientX, touchEvent.clientY, mobileSVG);
      
      expect(result).toEqual(expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number)
      }));
    });

    it('should handle rapid drag operations', () => {
      const svgElement = global.testUtils.mockSVGElement();
      const dragPath = [];
      
      // Simulate dragging a player across the pitch
      for (let i = 0; i <= 10; i++) {
        const x = 100 + (i * 85); // Move from left to right
        const y = 340 + Math.sin(i * 0.5) * 50; // Slight curve
        
        const coords = getSVGCoordinates(x, y, svgElement);
        dragPath.push(coords);
      }

      // All coordinates should be valid
      dragPath.forEach(coord => {
        expect(Number.isFinite(coord.x)).toBe(true);
        expect(Number.isFinite(coord.y)).toBe(true);
        expect(coord.x).toBeGreaterThanOrEqual(0);
        expect(coord.y).toBeGreaterThanOrEqual(0);
      });

      // Path should show progression
      expect(dragPath[0].x).toBeLessThan(dragPath[dragPath.length - 1].x);
    });
  });

  describe('Performance Under Load', () => {
    it('should handle coordinate transformations during animation', () => {
      const svgElement = global.testUtils.mockSVGElement();
      const startTime = performance.now();
      
      // Simulate 60fps animation for 1 second (60 frames)
      for (let frame = 0; frame < 60; frame++) {
        for (let element = 0; element < 22; element++) { // 22 players
          const x = Math.random() * 1050;
          const y = Math.random() * 680;
          getSVGCoordinates(x, y, svgElement);
        }
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete in reasonable time (less than 100ms for 1320 transformations)
      expect(duration).toBeLessThan(100);
    });

    it('should maintain accuracy under stress', () => {
      const svgElement = global.testUtils.mockSVGElement();
      
      // Test known reference points multiple times
      const referencePoints = [
        { x: 0, y: 0 },       // Top-left
        { x: 525, y: 340 },   // Center
        { x: 1050, y: 680 }   // Bottom-right
      ];

      referencePoints.forEach(point => {
        const results = [];
        
        // Transform same point 100 times
        for (let i = 0; i < 100; i++) {
          results.push(getSVGCoordinates(point.x, point.y, svgElement));
        }

        // All results should be identical (deterministic)
        const firstResult = results[0];
        results.forEach(result => {
          expect(result.x).toBeCloseTo(firstResult.x, 5);
          expect(result.y).toBeCloseTo(firstResult.y, 5);
        });
      });
    });
  });

  describe('Error Recovery', () => {
    it('should recover from corrupted SVG state', () => {
      const corruptedSVG = {
        getBoundingClientRect: () => ({
          width: NaN,
          height: undefined,
          left: null,
          top: 'invalid'
        }),
        getAttribute: () => null
      };

      const result = getSVGCoordinates(100, 100, corruptedSVG as any);
      
      // Should fallback gracefully
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should handle missing SVG methods', () => {
      const incompleteSVG = {
        getBoundingClientRect: () => ({ 
          width: 800, 
          height: 600,
          left: 0,
          top: 0,
          right: 800,
          bottom: 600,
          x: 0,
          y: 0
        }),
        getAttribute: jest.fn().mockReturnValue('0 0 1050 680')
        // Missing other methods like createSVGPoint
      };

      const result = getSVGCoordinates(100, 100, incompleteSVG as any);
      expect(result).toEqual(expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number)
      }));
    });
  });

  describe('SVG Coordinate Real-world Cases', () => {
    // Test the actual failing case from the logs
    it('should handle the failing test case correctly', () => {
      const mockSVGElement = {
        getBoundingClientRect: jest.fn().mockReturnValue({
          width: 800,
          height: 520,
          left: 0,
          top: 0,
          right: 800,
          bottom: 520,
          x: 0,
          y: 0
        }),
        getAttribute: jest.fn().mockImplementation((attr: string) => {
          if (attr === 'viewBox') return '0 0 1050 680';
          return null;
        }),
        // No createSVGPoint in test environment (simulates JSDOM)
        createSVGPoint: undefined,
        getScreenCTM: undefined
      } as unknown as SVGSVGElement;

      // This should NOT return { x: 100, y: 100 }
      const result = getSVGCoordinates(525, 340, mockSVGElement);
      
      // Expected calculation:
      // relativeX = 525 - 0 = 525
      // relativeY = 340 - 0 = 340  
      // scaleX = 1050 / 800 = 1.3125
      // scaleY = 680 / 520 = 1.3077
      // transformedX = 0 + (525 * 1.3125) = 689.0625
      // transformedY = 0 + (340 * 1.3077) = 444.615
      
      expect(result.x).toBeCloseTo(689.0625, 1);
      expect(result.y).toBeCloseTo(444.615, 1);
      expect(result.x).not.toBe(100);
      expect(result.y).not.toBe(100);
    });

    it('should handle various scaling scenarios', () => {
      const scenarios = [
        {
          name: 'Double scale',
          svgDimensions: { width: 400, height: 300 },
          viewBox: '0 0 800 600',
          input: { x: 200, y: 150 },
          expected: { x: 400, y: 300 }
        },
        {
          name: 'Half scale', 
          svgDimensions: { width: 800, height: 600 },
          viewBox: '0 0 400 300',
          input: { x: 400, y: 300 },
          expected: { x: 200, y: 150 }
        },
        {
          name: 'Offset viewBox',
          svgDimensions: { width: 400, height: 300 },
          viewBox: '100 50 400 300',
          input: { x: 200, y: 150 },
          expected: { x: 300, y: 200 }
        }
      ];

      scenarios.forEach(scenario => {
        const mockSVG = {
          getBoundingClientRect: jest.fn().mockReturnValue({
            width: scenario.svgDimensions.width,
            height: scenario.svgDimensions.height,
            left: 0,
            top: 0
          }),
          getAttribute: jest.fn().mockReturnValue(scenario.viewBox)
        } as unknown as SVGSVGElement;

        const result = getSVGCoordinates(scenario.input.x, scenario.input.y, mockSVG);
        
        expect(result.x).toBeCloseTo(scenario.expected.x, 1);
        expect(result.y).toBeCloseTo(scenario.expected.y, 1);
      });
    });

    it('should not return hardcoded values', () => {
      // Create multiple different scenarios and ensure we don't get the same result
      const results = [];
      
      for (let i = 0; i < 5; i++) {
        const mockSVG = {
          getBoundingClientRect: jest.fn().mockReturnValue({
            width: 800 + i * 100,
            height: 600 + i * 50,
            left: 0,
            top: 0
          }),
          getAttribute: jest.fn().mockReturnValue('0 0 1000 800')
        } as unknown as SVGSVGElement;

        const result = getSVGCoordinates(100 + i * 50, 100 + i * 30, mockSVG);
        results.push(result);
      }

      // All results should be different (not hardcoded to same value)
      const uniqueXValues = new Set(results.map(r => r.x));
      const uniqueYValues = new Set(results.map(r => r.y));
      
      expect(uniqueXValues.size).toBeGreaterThan(1);
      expect(uniqueYValues.size).toBeGreaterThan(1);
      
      // None should be exactly { x: 100, y: 100 }
      results.forEach(result => {
        expect(result.x === 100 && result.y === 100).toBe(false);
      });
    });
  });
});