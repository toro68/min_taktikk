import { createLinePathMemoized, clearPathCache } from '../../src/lib/line-utils';
import { getEffectiveCurveOffset } from '../../src/hooks/useTraceManager';

describe('trace curve offsets', () => {
  const start = { x: 100, y: 100 };
  const end = { x: 300, y: 220 };

  beforeEach(() => {
    clearPathCache();
  });

  it('changes the path when curveOffset changes', () => {
    const basePath = createLinePathMemoized(start, end, true, 0);
    const curvedPath = createLinePathMemoized(start, end, true, 80);

    expect(basePath).not.toEqual(curvedPath);
    expect(basePath).toContain('Q');
    expect(curvedPath).toContain('Q');
  });

  it('produces a straight path when style is straight', () => {
    const straightPath = createLinePathMemoized(start, end, false, 0);

    expect(straightPath).toContain(`M ${start.x} ${start.y}`);
    expect(straightPath).toContain(`L ${end.x} ${end.y}`);
    expect(straightPath).not.toContain('Q');
  });

  it('prefers curveType preset over offsets', () => {
    expect(getEffectiveCurveOffset('straight', 50, 100)).toBe(0);
    expect(getEffectiveCurveOffset('arc-left', 50, 100)).toBe(-35);
    expect(getEffectiveCurveOffset('arc-right', 50, 100)).toBe(35);
    expect(getEffectiveCurveOffset('s-curve', 50, 100)).toBe(25);
  });

  it('falls back to individual or global offsets when no preset', () => {
    expect(getEffectiveCurveOffset(undefined, 40, 100)).toBe(40);
    expect(getEffectiveCurveOffset(undefined, 0, 100)).toBe(100);
    expect(getEffectiveCurveOffset(undefined, undefined, 100)).toBe(100);
  });
});
