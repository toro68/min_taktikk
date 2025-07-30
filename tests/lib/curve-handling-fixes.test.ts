import { createLinePath } from '../../src/lib/line-utils';

describe('Curve handling fixes', () => {
  const start = { x: 100, y: 100 };
  const end = { x: 200, y: 200 };

  test('curved line with offset 0 should use default offset and not be straight', () => {
    const curvedPath = createLinePath(start, end, 'solidCurved', 0);
    
    // Should contain a quadratic curve (Q command) not just a line (L command)
    expect(curvedPath).toContain('Q');
    expect(curvedPath).toContain('M 100 100');
    expect(curvedPath).toContain('200 200');
    
    // Should not be a straight line
    expect(curvedPath).not.toEqual('M 100 100 L 200 200');
  });

  test('curved line with explicit offset should use that offset', () => {
    const curvedPath = createLinePath(start, end, 'solidCurved', 75);
    
    // Should contain a quadratic curve (Q command)
    expect(curvedPath).toContain('Q');
    expect(curvedPath).toContain('M 100 100');
    expect(curvedPath).toContain('200 200');
  });

  test('hook line with offset 0 should use default offset and not be straight', () => {
    const hookPath = createLinePath(start, end, 'hookStart', 0);
    
    // Should contain a quadratic curve (Q command)
    expect(hookPath).toContain('Q');
    expect(hookPath).toContain('M 100 100');
    expect(hookPath).toContain('200 200');
    
    // Should not be a straight line
    expect(hookPath).not.toEqual('M 100 100 L 200 200');
  });

  test('straight line should remain straight regardless of offset', () => {
    const straightPath = createLinePath(start, end, 'solidStraight', 0);
    
    // Should be a straight line (L command)
    expect(straightPath).toEqual('M 100 100 L 200 200');
    expect(straightPath).not.toContain('Q');
  });

  test('sine wave with offset 0 should use default amplitude', () => {
    const sineWavePath = createLinePath(start, end, 'sineWave', 0);
    
    // Should contain line commands (L command) for sine wave segments
    expect(sineWavePath).toContain('L');
    expect(sineWavePath).toContain('M 100 100');
    
    // Should end near the target point (allow some floating point variance)
    expect(sineWavePath).toMatch(/L\s+\d+\.\d+\s+\d+\.\d+$/);
    
    // Should not be a straight line
    expect(sineWavePath).not.toEqual('M 100 100 L 200 200');
  });
});
