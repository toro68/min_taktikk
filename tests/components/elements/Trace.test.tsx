import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Trace from '../../../src/components/elements/Trace';
import { TraceElement } from '../../../src/@types/elements';

describe('Trace element', () => {
  it('renders direction indicator at path endpoint (not stale x/y)', () => {
    const trace: TraceElement = {
      id: 'trace-1',
      type: 'trace',
      elementId: 'player-1',
      elementType: 'player',
      path: 'M 0 0 L 10 0',
      opacity: 0.5,
      dashed: false,
      visible: true,
      frameStart: 0,
      frameEnd: 3,
      // stale values that should NOT be used for the marker position
      x: 0,
      y: 0,
    };

    const { container } = render(<svg><Trace element={trace} /></svg>);
    const dot = container.querySelector('circle');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute('cx', '10');
    expect(dot).toHaveAttribute('cy', '0');
  });
});

