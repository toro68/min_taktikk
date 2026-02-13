import React, { useEffect, useState } from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useInterpolation } from '../../src/hooks/useInterpolation';
import { Frame, TraceElement } from '../../src/@types/elements';

const Harness: React.FC<{
  currentFrame: number;
  progress: number;
  frames: Frame[];
  enablePathFollowing: boolean;
  traces: TraceElement[];
  onUpdate: (x: number, y: number) => void;
}> = ({ currentFrame, progress, frames, enablePathFollowing, traces, onUpdate }) => {
  const [interpolatedElements, setInterpolatedElements] = useState<any[]>([]);

  useInterpolation({
    currentFrame,
    progress,
    frames,
    setInterpolatedElements,
    enablePathFollowing,
    traces,
    traceCurveOffset: 0,
    interpolationType: 'linear',
    showTraces: true,
  });

  useEffect(() => {
    const tracked = interpolatedElements.find((el) => el.id === 'player1' || el.id === 'ball1');
    if (tracked && typeof tracked.x === 'number' && typeof tracked.y === 'number') {
      onUpdate(tracked.x, tracked.y);
    }
  }, [interpolatedElements, onUpdate]);

  return null;
};

describe('useInterpolation path-following', () => {
  const frames: Frame[] = [
    { duration: 1, elements: [{ id: 'player1', type: 'player', x: 0, y: 0, number: 8 }] as any },
    { duration: 1, elements: [{ id: 'player1', type: 'player', x: 100, y: 0, number: 8 }] as any },
    { duration: 1, elements: [{ id: 'player1', type: 'player', x: 200, y: 0, number: 8 }] as any },
  ];

  const curvedTrace: TraceElement = {
    id: 'trace-player-0-1',
    type: 'trace',
    elementId: 'player1',
    elementType: 'player',
    path: 'M 0 0 Q 50 35 100 0',
    frameStart: 0,
    frameEnd: 1,
    curveOffset: 35,
    curveType: 'arc-right',
    visible: true,
  } as TraceElement;

  it('follows trace path during playback interpolation', async () => {
    let last: { x: number; y: number } | null = null;

    render(
      <Harness
        currentFrame={0}
        progress={0.5}
        frames={frames}
        enablePathFollowing={true}
        traces={[curvedTrace]}
        onUpdate={(x, y) => {
          last = { x, y };
        }}
      />
    );

    await waitFor(() => {
      expect(last).not.toBeNull();
    });

    expect(last!.x).toBeCloseTo(50, 3);
    expect(last!.y).toBeGreaterThan(0);
  });

  it('keeps trace position in sync when scrubbing progress', async () => {
    const updates: Array<{ x: number; y: number }> = [];

    const view = render(
      <Harness
        currentFrame={0}
        progress={0.25}
        frames={frames}
        enablePathFollowing={true}
        traces={[curvedTrace]}
        onUpdate={(x, y) => {
          updates.push({ x, y });
        }}
      />
    );

    await waitFor(() => {
      expect(updates.length).toBeGreaterThan(0);
    });

    view.rerender(
      <Harness
        currentFrame={0}
        progress={0.75}
        frames={frames}
        enablePathFollowing={true}
        traces={[curvedTrace]}
        onUpdate={(x, y) => {
          updates.push({ x, y });
        }}
      />
    );

    await waitFor(() => {
      const last = updates[updates.length - 1];
      expect(last.x).toBeCloseTo(75, 3);
      expect(last.y).toBeGreaterThan(0);
    });
  });

  it('falls back to regular interpolation when no trace exists', async () => {
    let last: { x: number; y: number } | null = null;

    render(
      <Harness
        currentFrame={0}
        progress={0.5}
        frames={frames}
        enablePathFollowing={true}
        traces={[]}
        onUpdate={(x, y) => {
          last = { x, y };
        }}
      />
    );

    await waitFor(() => {
      expect(last).not.toBeNull();
    });

    expect(last).toEqual({ x: 50, y: 0 });
  });

  it('does not fall back to a trace from another frame', async () => {
    const localFrames: Frame[] = [
      { duration: 1, elements: [{ id: 'ball1', type: 'ball', x: 0, y: 0 }] as any },
      { duration: 1, elements: [{ id: 'ball1', type: 'ball', x: 10, y: 0 }] as any },
      { duration: 1, elements: [{ id: 'ball1', type: 'ball', x: 20, y: 0 }] as any },
    ];

    // Only a trace for frame 0 -> 1 exists (none for 1 -> 2)
    const traces: TraceElement[] = [
      {
        id: 'trace-ball-0-1',
        type: 'trace',
        elementId: 'ball1',
        elementType: 'ball',
        path: 'M 0 0 L 10 0',
        frameStart: 0,
        frameEnd: 1,
        visible: true,
      } as TraceElement,
    ];

    let last: { x: number; y: number } | null = null;
    render(
      <Harness
        currentFrame={1}
        progress={0.5}
        frames={localFrames}
        enablePathFollowing={true}
        traces={traces}
        onUpdate={(x, y) => {
          last = { x, y };
        }}
      />
    );

    await waitFor(() => {
      expect(last).not.toBeNull();
    });

    // Should interpolate between frame 1 and 2 (10 -> 20), not follow the old trace (0 -> 10)
    expect(last).toEqual({ x: 15, y: 0 });
  });
});

