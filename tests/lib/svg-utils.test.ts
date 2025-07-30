import { 
    calculateDistance, 
    isPointInCircle, 
    generateId,
    getSVGCoordinates,
    getPitchDimensions 
} from '../../src/lib/svg-utils';

// Mock SVG element for testing
const createMockSVGElement = (options: {
  width: number;
  height: number;
  left?: number;
  top?: number;
  viewBox?: string;
  hasCreateSVGPoint?: boolean;
}) => {
  const {
    width,
    height,
    left = 0,
    top = 0,
    viewBox = `0 0 ${width} ${height}`,
    hasCreateSVGPoint = false
  } = options;

  const mockElement = {
    getBoundingClientRect: jest.fn().mockReturnValue({
      width,
      height,
      left,
      top,
      right: left + width,
      bottom: top + height
    }),
    getAttribute: jest.fn().mockReturnValue(viewBox),
    createSVGPoint: hasCreateSVGPoint ? jest.fn() : undefined,
    getScreenCTM: hasCreateSVGPoint ? jest.fn().mockReturnValue(null) : undefined
  } as unknown as SVGSVGElement;

  return mockElement;
};

describe('SVG Utilities', () => {
    describe('calculateDistance', () => {
        test('calculates distance between two points correctly', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: 3, y: 4 };
            
            const distance = calculateDistance(point1, point2);
            expect(distance).toBe(5);
        });

        test('calculates distance for same point', () => {
            const point = { x: 5, y: 5 };
            
            const distance = calculateDistance(point, point);
            expect(distance).toBe(0);
        });

        test('calculates distance for negative coordinates', () => {
            const point1 = { x: -3, y: -4 };
            const point2 = { x: 0, y: 0 };
            
            const distance = calculateDistance(point1, point2);
            expect(distance).toBe(5);
        });
    });

    describe('isPointInCircle', () => {
        test('returns true when point is inside circle', () => {
            const point = { x: 5, y: 5 };
            const circle = { x: 0, y: 0, radius: 10 };
            
            expect(isPointInCircle(point, circle)).toBe(true);
        });

        test('returns false when point is outside circle', () => {
            const point = { x: 15, y: 15 };
            const circle = { x: 0, y: 0, radius: 10 };
            
            expect(isPointInCircle(point, circle)).toBe(false);
        });

        test('returns true when point is on circle edge', () => {
            const point = { x: 10, y: 0 };
            const circle = { x: 0, y: 0, radius: 10 };
            
            expect(isPointInCircle(point, circle)).toBe(true);
        });
    });

    describe('generateId', () => {
        test('generates a string id', () => {
            const id = generateId();
            expect(typeof id).toBe('string');
            expect(id.length).toBeGreaterThan(0);
        });

        test('generates unique ids', () => {
            const id1 = generateId();
            const id2 = generateId();
            expect(id1).not.toBe(id2);
        });
    });

    describe('getSVGCoordinates', () => {
        it('should return (0,0) for invalid input', () => {
            const result1 = getSVGCoordinates(100, 100, null);
            expect(result1).toEqual({ x: 0, y: 0 });

            const mockSVG = createMockSVGElement({ width: 800, height: 600 });
            const result2 = getSVGCoordinates(NaN, 100, mockSVG);
            expect(result2).toEqual({ x: 0, y: 0 });

            const result3 = getSVGCoordinates(100, Infinity, mockSVG);
            expect(result3).toEqual({ x: 0, y: 0 });
        });

        it('should handle zero dimensions', () => {
            const mockSVG = createMockSVGElement({ width: 0, height: 0 });
            const result = getSVGCoordinates(100, 100, mockSVG);
            expect(result).toEqual({ x: 100, y: 100 });
        });

        it('should transform coordinates correctly for 1:1 scale', () => {
            // SVG dimensions match viewBox exactly
            const mockSVG = createMockSVGElement({
                width: 1050,
                height: 680,
                viewBox: '0 0 1050 680'
            });

            const result = getSVGCoordinates(525, 340, mockSVG);
            expect(result.x).toBeCloseTo(525, 1);
            expect(result.y).toBeCloseTo(340, 1);
        });

        it('should transform coordinates correctly for scaled viewBox', () => {
            // SVG is 800x520 but viewBox is 1050x680 (scale factor: 1.3125, 1.3077)
            const mockSVG = createMockSVGElement({
                width: 800,
                height: 520,
                left: 0,
                top: 0,
                viewBox: '0 0 1050 680'
            });

            // Center of SVG element should map to center of viewBox
            const centerResult = getSVGCoordinates(400, 260, mockSVG);
            expect(centerResult.x).toBeCloseTo(525, 1); // 400 * (1050/800) = 525
            expect(centerResult.y).toBeCloseTo(340, 1); // 260 * (680/520) = 340

            // Top-left corner
            const topLeftResult = getSVGCoordinates(0, 0, mockSVG);
            expect(topLeftResult.x).toBeCloseTo(0, 1);
            expect(topLeftResult.y).toBeCloseTo(0, 1);

            // Bottom-right corner  
            const bottomRightResult = getSVGCoordinates(800, 520, mockSVG);
            expect(bottomRightResult.x).toBeCloseTo(1050, 1);
            expect(bottomRightResult.y).toBeCloseTo(680, 1);
        });

        it('should handle offset SVG elements', () => {
            const mockSVG = createMockSVGElement({
                width: 800,
                height: 520,
                left: 100,
                top: 50,
                viewBox: '0 0 1050 680'
            });

            // Click at absolute position (500, 310) which is (400, 260) relative to SVG
            const result = getSVGCoordinates(500, 310, mockSVG);
            expect(result.x).toBeCloseTo(525, 1);
            expect(result.y).toBeCloseTo(340, 1);
        });

        it('should handle viewBox with offset', () => {
            const mockSVG = createMockSVGElement({
                width: 400,
                height: 300,
                viewBox: '100 50 800 600'
            });

            // Center of element should map to center of viewBox
            const result = getSVGCoordinates(200, 150, mockSVG);
            expect(result.x).toBeCloseTo(500, 1); // 100 + 200 * (800/400) = 500
            expect(result.y).toBeCloseTo(350, 1); // 50 + 150 * (600/300) = 350
        });

        it('should handle missing or invalid viewBox', () => {
            const mockSVGNoViewBox = {
                getBoundingClientRect: jest.fn().mockReturnValue({
                    width: 800,
                    height: 600,
                    left: 0,
                    top: 0
                }),
                getAttribute: jest.fn().mockReturnValue(null)
            } as unknown as SVGSVGElement;

            const result = getSVGCoordinates(400, 300, mockSVGNoViewBox);
            expect(result.x).toBeCloseTo(400, 1);
            expect(result.y).toBeCloseTo(300, 1);
        });
    });

    describe('Performance', () => {
        it('should handle rapid coordinate transformations', () => {
            const mockSVG = createMockSVGElement({
                width: 800,
                height: 520,
                viewBox: '0 0 1050 680'
            });

            const startTime = performance.now();
            
            // Perform 1000 coordinate transformations
            for (let i = 0; i < 1000; i++) {
                const x = Math.random() * 800;
                const y = Math.random() * 520;
                getSVGCoordinates(x, y, mockSVG);
            }
            
            const endTime = performance.now();
            expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
        });
    });

    describe('getPitchDimensions', () => {
        test('returns correct dimensions for full pitch', () => {
            const dimensions = getPitchDimensions('full');
            expect(dimensions).toEqual({
                width: 680,
                height: 1050,
                viewBox: "0 0 680 1050"
            });
        });

        test('returns correct dimensions for fullLandscape pitch', () => {
            const dimensions = getPitchDimensions('fullLandscape');
            expect(dimensions).toEqual({
                width: 1050,
                height: 680,
                viewBox: "0 0 1050 680"
            });
        });

        test('returns correct dimensions for handball pitch', () => {
            const dimensions = getPitchDimensions('handball');
            expect(dimensions).toEqual({
                width: 680,
                height: 340,
                viewBox: "0 0 680 340"
            });
        });

        test('returns correct dimensions for offensive pitch', () => {
            const dimensions = getPitchDimensions('offensive');
            expect(dimensions).toEqual({
                width: 680,
                height: 525,
                viewBox: "0 0 680 525"
            });
        });

        test('returns correct dimensions for defensive pitch', () => {
            const dimensions = getPitchDimensions('defensive');
            expect(dimensions).toEqual({
                width: 680,
                height: 525,
                viewBox: "0 0 680 525"
            });
        });

        test('handles invalid pitch type gracefully', () => {
            const dimensions = getPitchDimensions('invalid' as any);
            expect(dimensions).toEqual({
                width: 680,
                height: 525,
                viewBox: "0 0 680 525"
            });
        });
    });
describe('getSVGCoordinates - Edge Cases and Error Handling', () => {
  it('should handle invalid viewBox strings gracefully', () => {
    const mockSVG = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        width: 800,
        height: 600,
        left: 0,
        top: 0
      }),
      getAttribute: jest.fn().mockReturnValue('invalid viewbox string')
    } as unknown as SVGSVGElement;

    const result = getSVGCoordinates(400, 300, mockSVG);
    expect(result.x).toBeCloseTo(400, 1);
    expect(result.y).toBeCloseTo(300, 1);
  });

  it('should handle viewBox with insufficient values', () => {
    const mockSVG = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        width: 800,
        height: 600,
        left: 0,
        top: 0
      }),
      getAttribute: jest.fn().mockReturnValue('0 0 800')
    } as unknown as SVGSVGElement;

    const result = getSVGCoordinates(400, 300, mockSVG);
    expect(result.x).toBeCloseTo(400, 1);
    expect(result.y).toBeCloseTo(300, 1);
  });

  it('should handle viewBox with zero dimensions', () => {
    const mockSVG = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        width: 800,
        height: 600,
        left: 0,
        top: 0
      }),
      getAttribute: jest.fn().mockReturnValue('0 0 0 0')
    } as unknown as SVGSVGElement;

    const result = getSVGCoordinates(400, 300, mockSVG);
    expect(result.x).toBeCloseTo(400, 1);
    expect(result.y).toBeCloseTo(300, 1);
  });

  it('should handle viewBox with NaN values', () => {
    const mockSVG = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        width: 800,
        height: 600,
        left: 0,
        top: 0
      }),
      getAttribute: jest.fn().mockReturnValue('NaN invalid 800 600')
    } as unknown as SVGSVGElement;

    const result = getSVGCoordinates(400, 300, mockSVG);
    expect(result.x).toBeCloseTo(400, 1);
    expect(result.y).toBeCloseTo(300, 1);
  });

  it('should handle createSVGPoint with invalid CTM', () => {
    const mockPoint = {
      x: 0,
      y: 0,
      matrixTransform: jest.fn().mockReturnValue({ x: NaN, y: NaN })
    };

    const mockSVG = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        width: 800,
        height: 600,
        left: 0,
        top: 0
      }),
      getAttribute: jest.fn().mockReturnValue('0 0 800 600'),
      createSVGPoint: jest.fn().mockReturnValue(mockPoint),
      getScreenCTM: jest.fn().mockReturnValue({
        inverse: jest.fn().mockReturnValue({})
      })
    } as unknown as SVGSVGElement;

    const result = getSVGCoordinates(400, 300, mockSVG);
    // Should fall back to manual calculation
    expect(result.x).toBeCloseTo(400, 1);
    expect(result.y).toBeCloseTo(300, 1);
  });

  it('should handle createSVGPoint throwing an error', () => {
    const mockSVG = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        width: 800,
        height: 600,
        left: 0,
        top: 0
      }),
      getAttribute: jest.fn().mockReturnValue('0 0 800 600'),
      createSVGPoint: jest.fn().mockImplementation(() => {
        throw new Error('SVG Point creation failed');
      }),
      getScreenCTM: jest.fn().mockReturnValue(null)
    } as unknown as SVGSVGElement;

    const result = getSVGCoordinates(400, 300, mockSVG);
    // Should fall back to manual calculation
    expect(result.x).toBeCloseTo(400, 1);
    expect(result.y).toBeCloseTo(300, 1);
  });

  it('should handle extreme coordinate values', () => {
    const mockSVG = createMockSVGElement({
      width: 800,
      height: 600,
      viewBox: '0 0 800 600'
    });

    // Very large values
    const result1 = getSVGCoordinates(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, mockSVG);
    expect(isFinite(result1.x)).toBe(true);
    expect(isFinite(result1.y)).toBe(true);

    // Very small values
    const result2 = getSVGCoordinates(-Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER, mockSVG);
    expect(isFinite(result2.x)).toBe(true);
    expect(isFinite(result2.y)).toBe(true);
  });

  it('should handle fractional coordinates precisely', () => {
    const mockSVG = createMockSVGElement({
      width: 800,
      height: 600,
      viewBox: '0 0 1600 1200'
    });

    const result = getSVGCoordinates(123.456, 789.123, mockSVG);
    expect(result.x).toBeCloseTo(246.912, 2); // 123.456 * 2
    expect(result.y).toBeCloseTo(1578.246, 2); // 789.123 * 2
  });

  it('should handle non-standard viewBox spacing', () => {
    const mockSVG = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        width: 800,
        height: 600,
        left: 0,
        top: 0
      }),
      getAttribute: jest.fn().mockReturnValue('  0   0   1600   1200  ')
    } as unknown as SVGSVGElement;

    const result = getSVGCoordinates(400, 300, mockSVG);
    expect(result.x).toBeCloseTo(800, 1); // 400 * (1600/800)
    expect(result.y).toBeCloseTo(600, 1); // 300 * (1200/600)
  });

  // Additional edge case tests that could be added
  it('should handle getAttribute returning undefined', () => {
    const mockSVG = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        width: 800,
        height: 600,
        left: 0,
        top: 0
      }),
      getAttribute: jest.fn().mockReturnValue(undefined)
    } as unknown as SVGSVGElement;

    const result = getSVGCoordinates(400, 300, mockSVG);
    expect(result.x).toBeCloseTo(400, 1);
    expect(result.y).toBeCloseTo(300, 1);
  });

  it('should handle negative viewBox dimensions', () => {
    const mockSVG = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        width: 800,
        height: 600,
        left: 0,
        top: 0
      }),
      getAttribute: jest.fn().mockReturnValue('0 0 -800 -600')
    } as unknown as SVGSVGElement;

    const result = getSVGCoordinates(400, 300, mockSVG);
    expect(result.x).toBeCloseTo(400, 1);
    expect(result.y).toBeCloseTo(300, 1);
  });
});

describe('getSVGCoordinates - Real-world Scenarios', () => {
  it('should handle fullLandscape pitch dimensions correctly', () => {
    const mockSVG = createMockSVGElement({
      width: 800,
      height: 520,
      viewBox: '0 0 1050 680'
    });

    // Test corner points
    const topLeft = getSVGCoordinates(0, 0, mockSVG);
    expect(topLeft.x).toBeCloseTo(0, 1);
    expect(topLeft.y).toBeCloseTo(0, 1);

    const bottomRight = getSVGCoordinates(800, 520, mockSVG);
    expect(bottomRight.x).toBeCloseTo(1050, 1);
    expect(bottomRight.y).toBeCloseTo(680, 1);

    // Test center point
    const center = getSVGCoordinates(400, 260, mockSVG);
    expect(center.x).toBeCloseTo(525, 1);
    expect(center.y).toBeCloseTo(340, 1);
  });

  it('should handle handball pitch dimensions correctly', () => {
    const mockSVG = createMockSVGElement({
      width: 680,
      height: 340,
      viewBox: '0 0 680 340'
    });

    // 1:1 scale, coordinates should match exactly
    const result = getSVGCoordinates(340, 170, mockSVG);
    expect(result.x).toBeCloseTo(340, 1);
    expect(result.y).toBeCloseTo(170, 1);
  });

  it('should handle responsive scaling scenarios', () => {
    // Small mobile viewport
    const mobileSVG = createMockSVGElement({
      width: 320,
      height: 207,
      viewBox: '0 0 1050 680'
    });

    const mobileResult = getSVGCoordinates(160, 103.5, mobileSVG);
    expect(mobileResult.x).toBeCloseTo(525, 1);
    expect(mobileResult.y).toBeCloseTo(340, 1);

    // Large desktop viewport
    const desktopSVG = createMockSVGElement({
      width: 1600,
      height: 1037,
      viewBox: '0 0 1050 680'
    });

    const desktopResult = getSVGCoordinates(800, 518.5, desktopSVG);
    expect(desktopResult.x).toBeCloseTo(525, 1);
    expect(desktopResult.y).toBeCloseTo(340, 1);
  });
});

describe('getSVGCoordinates - Performance and Validation', () => {
  it('should validate and sanitize output coordinates', () => {
    const mockSVG = createMockSVGElement({
      width: 800,
      height: 600,
      viewBox: '0 0 800 600'
    });

    const result = getSVGCoordinates(400, 300, mockSVG);
    expect(typeof result.x).toBe('number');
    expect(typeof result.y).toBe('number');
    expect(isFinite(result.x)).toBe(true);
    expect(isFinite(result.y)).toBe(true);
  });

  it('should handle concurrent coordinate calculations', () => {
    const mockSVG = createMockSVGElement({
      width: 800,
      height: 600,
      viewBox: '0 0 1050 680'
    });

    const promises = [];
    
    for (let i = 0; i < 100; i++) {
      promises.push(
        Promise.resolve().then(() => {
          const x = Math.random() * 800;
          const y = Math.random() * 600;
          return getSVGCoordinates(x, y, mockSVG);
        })
      );
    }

    return Promise.all(promises).then(results => {
      expect(results).toHaveLength(100);
      results.forEach(result => {
        expect(isFinite(result.x)).toBe(true);
        expect(isFinite(result.y)).toBe(true);
      });
    });
  });
});  // Close the nested describe block
}); // Close the main describe block