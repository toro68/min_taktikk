import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ElementRenderer from '../../src/components/core/ElementRenderer';
import { BallElement, FootballElement } from '../../src/@types/elements';

// Mock child components to focus testing on ElementRenderer logic
jest.mock('../../src/components/elements/Ball', () => (props: any) => (
  <g data-testid="ball-element" onClick={props.onClick} onMouseDown={props.onMouseDown} onTouchStart={props.onTouchStart}>
    <circle r="10" />
  </g>
));
jest.mock('../../src/components/elements/Player', () => () => <g data-testid="player-element" />);
jest.mock('../../src/components/elements/Opponent', () => () => <g data-testid="opponent-element" />);
jest.mock('../../src/components/elements/Cone', () => () => <g data-testid="cone-element" />);
jest.mock('../../src/components/elements/Text', () => () => <g data-testid="text-element" />);
jest.mock('../../src/components/elements/Area', () => () => <g data-testid="area-element" />);

describe('ElementRenderer for BallElement', () => {
  const mockOnElementClick = jest.fn();
  const mockOnElementDragStart = jest.fn();

  const ballElement: BallElement = {
    id: 'ball1',
    type: 'ball',
    x: 50,
    y: 50,
    visible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (element: FootballElement = ballElement) => {
    render(
      <svg>
        <ElementRenderer
          element={element}
          isSelected={false}
          onElementClick={mockOnElementClick}
          onElementDragStart={mockOnElementDragStart}
        />
      </svg>
    );
  };

  it('should call onElementDragStart on mousedown', () => {
    renderComponent();
    const ball = screen.getByTestId('ball-element');
    fireEvent.mouseDown(ball, { clientX: 10, clientY: 10 });

    expect(mockOnElementDragStart).toHaveBeenCalledTimes(1);
    expect(mockOnElementDragStart).toHaveBeenCalledWith(expect.anything(), ballElement);
    expect(mockOnElementClick).not.toHaveBeenCalled();
  });

  it('should call onElementDragStart on touchstart', () => {
    renderComponent();
    const ball = screen.getByTestId('ball-element');
    fireEvent.touchStart(ball, { touches: [{ clientX: 10, clientY: 10 }] });

    expect(mockOnElementDragStart).toHaveBeenCalledTimes(1);
    expect(mockOnElementDragStart).toHaveBeenCalledWith(
      expect.objectContaining({
        clientX: 10,
        clientY: 10,
      }),
      ballElement
    );
    expect(mockOnElementClick).not.toHaveBeenCalled();
  });

  it('should call onElementClick on click', () => {
    renderComponent();
    const ball = screen.getByTestId('ball-element');
    fireEvent.click(ball, { clientX: 10, clientY: 10 });

    expect(mockOnElementClick).toHaveBeenCalledTimes(1);
    expect(mockOnElementClick).toHaveBeenCalledWith(expect.anything(), ballElement);
    expect(mockOnElementDragStart).not.toHaveBeenCalled();
  });
});