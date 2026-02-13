import { createSCurvePath, extractPathEndpoints } from '../../src/lib/line-utils';

const approx = (actual: number, expected: number, eps = 1e-6) => {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(eps);
};

describe('createSCurvePath', () => {
  it('lager en cubic Bezier med motsatt offset på cp2 (S-form)', () => {
    const start = { x: 0, y: 0 };
    const end = { x: 100, y: 0 };
    const path = createSCurvePath(start, end, 10);

    // M x y C cp1x cp1y cp2x cp2y ex ey
    const nums = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
    expect(nums).toBeTruthy();
    const [sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey] = nums as number[];

    approx(sx, 0);
    approx(sy, 0);
    approx(cp1x, 33);
    approx(cp1y, 10);
    approx(cp2x, 66);
    approx(cp2y, -10);
    approx(ex, 100);
    approx(ey, 0);

    expect(extractPathEndpoints(path)).toEqual({ start, end });
  });
});

