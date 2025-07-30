import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Ball from '../../../src/components/elements/Ball';
import { BallElement } from '../../../src/@types/elements';

describe('Ball component', () => {
    const mockBallElement: BallElement = {
        id: 'ball1',
        type: 'ball',
        x: 50,
        y: 50,
        visible: true
    };

    const mockProps = {
        element: mockBallElement,
        isSelected: false,
        onClick: jest.fn(),
        onMouseDown: jest.fn(),
        onTouchStart: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders ball at correct position via group transform', () => {
        const { container } = render(
            <svg>
                <Ball {...mockProps} />
            </svg>
        );
        
        const ballGroup = container.querySelector('g');
        expect(ballGroup).toHaveAttribute('transform', 'translate(50, 50)');
    });

    test('renders ball with main circle and decorative elements', () => {
        const { container } = render(
            <svg>
                <Ball {...mockProps} />
            </svg>
        );
        
        // Main ball circle
        const mainCircle = container.querySelector('circle[r="8"]');
        expect(mainCircle).toBeInTheDocument();
        expect(mainCircle).toHaveAttribute('fill', '#ffffff');
        expect(mainCircle).toHaveAttribute('stroke', '#333333');
        
        // Decorative path (pentagon pattern)
        const path = container.querySelector('path');
        expect(path).toBeInTheDocument();
        expect(path).toHaveAttribute('fill', '#000000');
        
        // Decorative dots
        const dots = container.querySelectorAll('circle[r="1.5"], circle[r="1.2"]');
        expect(dots.length).toBeGreaterThan(0);
    });

    test('applies selected styling with blue stroke', () => {
        const { container } = render(
            <svg>
                <Ball {...mockProps} isSelected={true} />
            </svg>
        );
        
        const mainCircle = container.querySelector('circle[r="8"]');
        expect(mainCircle).toHaveAttribute('stroke', '#0000ff');
        expect(mainCircle).toHaveAttribute('stroke-width', '3');
    });

    test('applies default styling when not selected', () => {
        const { container } = render(
            <svg>
                <Ball {...mockProps} isSelected={false} />
            </svg>
        );
        
        const mainCircle = container.querySelector('circle[r="8"]');
        expect(mainCircle).toHaveAttribute('stroke', '#333333');
        expect(mainCircle).toHaveAttribute('stroke-width', '1.5');
    });

    test('has move cursor styling', () => {
        const { container } = render(
            <svg>
                <Ball {...mockProps} />
            </svg>
        );
        
        const ballGroup = container.querySelector('g');
        expect(ballGroup).toHaveStyle('cursor: move');
    });

    test('calls event handlers when clicked', () => {
        const { container } = render(
            <svg>
                <Ball {...mockProps} />
            </svg>
        );
        
        const ballGroup = container.querySelector('g');
        if (ballGroup) {
            fireEvent.click(ballGroup);
            expect(mockProps.onClick).toHaveBeenCalled();
        }
    });

    test('calls onMouseDown when mouse is pressed', () => {
        const { container } = render(
            <svg>
                <Ball {...mockProps} />
            </svg>
        );
        
        const ballGroup = container.querySelector('g');
        if (ballGroup) {
            fireEvent.mouseDown(ballGroup);
            expect(mockProps.onMouseDown).toHaveBeenCalled();
        }
    });

    test('calls onTouchStart when touched', () => {
        const { container } = render(
            <svg>
                <Ball {...mockProps} />
            </svg>
        );
        
        const ballGroup = container.querySelector('g');
        if (ballGroup) {
            fireEvent.touchStart(ballGroup);
            expect(mockProps.onTouchStart).toHaveBeenCalled();
        }
    });

    test('does not render when element is not visible', () => {
        const invisibleBallElement: BallElement = {
            ...mockBallElement,
            visible: false
        };
        
        const { container } = render(
            <svg>
                <Ball {...mockProps} element={invisibleBallElement} />
            </svg>
        );
        
        expect(container.querySelector('g')).toBeNull();
    });

    test('ball position updates when element coordinates change', () => {
        const { container, rerender } = render(
            <svg>
                <Ball {...mockProps} />
            </svg>
        );
        
        const updatedElement: BallElement = {
            ...mockBallElement,
            x: 100,
            y: 150
        };
        
        rerender(
            <svg>
                <Ball {...mockProps} element={updatedElement} />
            </svg>
        );
        
        const ballGroup = container.querySelector('g');
        expect(ballGroup).toHaveAttribute('transform', 'translate(100, 150)');
    });
});