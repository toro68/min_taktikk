import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Opponent from '../../../src/components/elements/Opponent';
import { OpponentElement } from '../../../src/@types/elements';

describe('Opponent component', () => {
  const mockOpponent: OpponentElement = {
    id: 'opponent1',
    type: 'opponent',
    x: 80,
    y: 120,
    number: '7',
    visible: true
  };

  test('renders at correct position', () => {
    const { container } = render(
      <svg>
        <Opponent element={mockOpponent} />
      </svg>
    );

    const group = container.querySelector('[data-testid="opponent-element"]');
    expect(group).toHaveAttribute('transform', 'translate(80, 120)');
  });

  test('renders number and main circle', () => {
    const { container } = render(
      <svg>
        <Opponent element={mockOpponent} />
      </svg>
    );

    const circle = container.querySelector('[data-testid="opponent-main-circle"]');
    const text = container.querySelector('text');
    expect(circle).toBeInTheDocument();
    expect(text).toHaveTextContent('7');
  });

  test('shows selected stroke when selected', () => {
    const { container } = render(
      <svg>
        <Opponent element={mockOpponent} isSelected={true} />
      </svg>
    );

    const circle = container.querySelector('[data-testid="opponent-main-circle"]');
    expect(circle).toHaveAttribute('stroke', '#0000ff');
  });

  test('does not render when not visible', () => {
    const { container } = render(
      <svg>
        <Opponent element={{ ...mockOpponent, visible: false }} />
      </svg>
    );

    expect(container.querySelector('[data-testid="opponent-element"]')).toBeNull();
  });
});
