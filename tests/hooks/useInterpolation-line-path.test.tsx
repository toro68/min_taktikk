import React, { useEffect, useState } from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useInterpolation } from '../../src/hooks/useInterpolation';
import { Frame } from '../../src/@types/elements';
import { extractPathEndpoints } from '../../src/lib/line-utils';

const EMPTY_TRACES: never[] = [];

const LineHarness: React.FC<{
  currentFrame: number;
  progress: number;
  frames: Frame[];
  onPath: (path: string) => void;
}> = ({ currentFrame, progress, frames, onPath }) => {
  const [interpolatedElements, setInterpolatedElements] = useState<any[]>([]);

  useInterpolation({
    currentFrame,
    progress,
    frames,
    setInterpolatedElements,
    interpolationType: 'linear',
    showTraces: false,
    traces: EMPTY_TRACES,
    traceCurveOffset: 0,
    enablePathFollowing: false,
  });

  useEffect(() => {
    const line = interpolatedElements.find((el) => el.id === 'line-1' && el.type === 'line');
    if (line?.path) {
      onPath(line.path);
    }
  }, [interpolatedElements, onPath]);

  return null;
};

describe('useInterpolation line path interpolation', () => {
  it('moves whole line smoothly between keyframes', async () => {
    const frames: Frame[] = [
      {
        duration: 1,
        elements: [
          {
            id: 'line-1',
            type: 'line',
            path: 'M 0 0 L 100 0',
            style: 'solidStraight',
            modifiers: {},
            color: '#000000',
            curveOffset: 0,
          } as any,
        ],
      },
      {
        duration: 1,
        elements: [
          {
            id: 'line-1',
            type: 'line',
            path: 'M 100 100 L 200 100',
            style: 'solidStraight',
            modifiers: {},
            color: '#000000',
            curveOffset: 0,
          } as any,
        ],
      },
    ];

    let interpolatedPath: string | null = null;

    render(
      <LineHarness
        currentFrame={0}
        progress={0.5}
        frames={frames}
        onPath={(path) => {
          interpolatedPath = path;
        }}
      />
    );

    await waitFor(() => {
      expect(interpolatedPath).toBeTruthy();
    });

    const endpoints = extractPathEndpoints(interpolatedPath!);
    expect(endpoints).not.toBeNull();
    expect(endpoints!.start.x).toBeCloseTo(50, 3);
    expect(endpoints!.start.y).toBeCloseTo(50, 3);
    expect(endpoints!.end.x).toBeCloseTo(150, 3);
    expect(endpoints!.end.y).toBeCloseTo(50, 3);
  });
});
