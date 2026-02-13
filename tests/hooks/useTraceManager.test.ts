import { getEffectiveCurveOffset } from '../../src/hooks/useTraceManager';

describe('getEffectiveCurveOffset', () => {
  it('prioriterer curveType over alt annet', () => {
    expect(getEffectiveCurveOffset('straight', 123, 456)).toBe(0);
    expect(getEffectiveCurveOffset('arc-left', 0, 0)).toBeLessThan(0);
    expect(getEffectiveCurveOffset('arc-right', 0, 0)).toBeGreaterThan(0);
  });

  it('bruker individuelt curveOffset når satt', () => {
    expect(getEffectiveCurveOffset(undefined, 15, 5)).toBe(15);
    expect(getEffectiveCurveOffset(undefined, -20, 5)).toBe(-20);
  });

  it('faller tilbake til globalCurveOffset', () => {
    expect(getEffectiveCurveOffset(undefined, undefined, 7)).toBe(7);
    expect(getEffectiveCurveOffset(undefined, 0, 7)).toBe(7);
  });
});

