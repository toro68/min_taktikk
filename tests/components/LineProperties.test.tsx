import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LineProperties from '../../src/components/properties/LineProperties';
import { LineElement } from '../../src/@types/elements';

// Mock line element for testing
const mockLine: LineElement = {
  id: 'test-line-1',
  type: 'line',
  path: 'M 10 10 L 50 50',
  style: 'solidStraight',
  color: '#000000',
  dashed: false,
  marker: null,
  curveOffset: 0,
  visible: true
};

describe('LineProperties', () => {
  const mockUpdateElement = jest.fn();

  beforeEach(() => {
    mockUpdateElement.mockClear();
  });

  test('renders line properties panel', () => {
    render(<LineProperties line={mockLine} updateElement={mockUpdateElement} />);
    
    expect(screen.getByText('Linjeegenskaper')).toBeInTheDocument();
    expect(screen.getByText('Linjestil')).toBeInTheDocument();
    expect(screen.getByText('Linjefarge')).toBeInTheDocument();
    expect(screen.getByText('Slutt-markør')).toBeInTheDocument();
  });

  test('handles style change', () => {
    render(<LineProperties line={mockLine} updateElement={mockUpdateElement} />);
    
    const curvedStyleButton = screen.getByText('Kurvet linje');
    fireEvent.click(curvedStyleButton);
    
    expect(mockUpdateElement).toHaveBeenCalledWith(expect.objectContaining({
      style: 'solidCurved',
      dashed: false,
      marker: null,
      path: expect.any(String)
    }));
  });

  test('handles color change', () => {
    render(<LineProperties line={mockLine} updateElement={mockUpdateElement} />);
    
    const colorInput = screen.getByDisplayValue('#000000');
    fireEvent.change(colorInput, { target: { value: '#ff0000' } });
    
    expect(mockUpdateElement).toHaveBeenCalledWith({
      color: '#ff0000'
    });
  });

  test('handles dashed toggle', () => {
    render(<LineProperties line={mockLine} updateElement={mockUpdateElement} />);
    
    const dashedToggle = screen.getByText('Av');
    fireEvent.click(dashedToggle);
    
    expect(mockUpdateElement).toHaveBeenCalledWith({
      dashed: true
    });
  });

  test('shows curve offset slider for curved lines', () => {
    const curvedLine: LineElement = {
      ...mockLine,
      style: 'solidCurved'
    };

    render(<LineProperties line={curvedLine} updateElement={mockUpdateElement} />);
    
    expect(screen.getByText('Kurvatur')).toBeInTheDocument();
  });

  test('handles visibility toggle', () => {
    render(<LineProperties line={mockLine} updateElement={mockUpdateElement} />);
    
    const visibilityToggle = screen.getByRole('button', { name: 'Synlig' });
    fireEvent.click(visibilityToggle);
    
    expect(mockUpdateElement).toHaveBeenCalledWith({
      visible: false
    });
  });
});
