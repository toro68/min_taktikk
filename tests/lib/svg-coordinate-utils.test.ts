import { getSVGCoordinates } from '../../src/lib/svg-utils';

describe('SVG Coordinate Transformation Debug', () => {
  // Create a more realistic mock that matches browser behavior
  const createRealisticMockSVG = (options: {
    width: number;
    height: number;
    left?: number;
    top?: number;
    viewBox?: string;
  }) => {
    const { width, height, left = 0, top = 0, viewBox = `0 0 ${width} ${height}` } = options;

    const mockSVG = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        width,
        height,
        left,
        top,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top
      }),
      getAttribute: jest.fn((attr: string) => {
        if (attr === 'viewBox') return viewBox;
        return null;
      }),
      // Simulate missing createSVGPoint in test environment
      createSVGPoint: undefined,
      getScreenCTM: undefined
    } as unknown as SVGSVGElement;

    return mockSVG;
  };

  it('should debug coordinate transformation step by step', () => {
    const mockSVG = createRealisticMockSVG({
      width: 800,
      height: 520,
      left: 0,
      top: 0,
      viewBox: '0 0 1050 680'
    });

    console.log('=== DEBUGGING COORDINATE TRANSFORMATION ===');
    
    // Test center point
    const clientX = 400; // Center of 800px width
    const clientY = 260; // Center of 520px height
    
    console.log('Input:', { clientX, clientY });
    console.log('Expected SVG coords:', { x: 525, y: 340 }); // Center of 1050x680 viewBox
    
    const result = getSVGCoordinates(clientX, clientY, mockSVG);
    console.log('Actual result:', result);
    
    // Manual calculation for verification
    const rect = mockSVG.getBoundingClientRect();
    const viewBoxAttr = mockSVG.getAttribute('viewBox');
    const [vbX, vbY, vbWidth, vbHeight] = viewBoxAttr!.split(' ').map(Number);
    
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;
    const scaleX = vbWidth / rect.width;
    const scaleY = vbHeight / rect.height;
    const expectedX = vbX + (relativeX * scaleX);
    const expectedY = vbY + (relativeY * scaleY);
    
    console.log('Manual calculation:');
    console.log('  rect:', rect);
    console.log('  viewBox:', { vbX, vbY, vbWidth, vbHeight });
    console.log('  relative:', { relativeX, relativeY });
    console.log('  scale:', { scaleX, scaleY });
    console.log('  expected:', { expectedX, expectedY });
    
    expect(result.x).toBeCloseTo(expectedX, 1);
    expect(result.y).toBeCloseTo(expectedY, 1);
  });

  it('should handle simple 1:1 mapping', () => {
    const mockSVG = createRealisticMockSVG({
      width: 1050,
      height: 680,
      viewBox: '0 0 1050 680'
    });

    const result = getSVGCoordinates(525, 340, mockSVG);
    expect(result.x).toBeCloseTo(525, 1);
    expect(result.y).toBeCloseTo(340, 1);
  });

  it('should handle scaling correctly', () => {
    const mockSVG = createRealisticMockSVG({
      width: 400,  // Half of viewBox width
      height: 340, // Half of viewBox height  
      viewBox: '0 0 800 680'
    });

    // Click at center of element (200, 170) should map to center of viewBox (400, 340)
    const result = getSVGCoordinates(200, 170, mockSVG);
    expect(result.x).toBeCloseTo(400, 1);
    expect(result.y).toBeCloseTo(340, 1);
  });
});