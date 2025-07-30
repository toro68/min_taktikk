import { renderHook, act } from '@testing-library/react';
import { useDragOffset } from '../../src/hooks/useDragOffset';

describe('useDragOffset', () => {
  describe('Initial State', () => {
    it('should start with isDragging false and zero offset', () => {
      const { result } = renderHook(() => useDragOffset());
      
      expect(result.current.isDragging).toBe(false);
      expect(result.current.dragOffset).toEqual({ x: 0, y: 0 });
    });
  });

  describe('Drag State Management', () => {
    it('should start dragging from specified position', () => {
      const { result } = renderHook(() => useDragOffset());
      
      act(() => {
        result.current.startDrag(100, 100);
      });

      expect(result.current.isDragging).toBe(true);
      expect(result.current.dragOffset).toEqual({ x: 0, y: 0 });
    });

    it('should calculate drag offset during movement', () => {
      const { result } = renderHook(() => useDragOffset());
      
      act(() => {
        result.current.startDrag(100, 100);
      });
      
      act(() => {
        result.current.updateDrag(150, 150);
      });

      expect(result.current.isDragging).toBe(true);
      expect(result.current.dragOffset).toEqual({ x: 50, y: 50 });
    });
  });

  describe('Drag Scenarios', () => {
    it('should handle horizontal drag', () => {
      const { result } = renderHook(() => useDragOffset());
      
      act(() => {
        result.current.startDrag(0, 0);
      });
      
      act(() => {
        result.current.updateDrag(100, 0);
      });

      expect(result.current.dragOffset).toEqual({ x: 100, y: 0 });
    });

    it('should handle vertical drag', () => {
      const { result } = renderHook(() => useDragOffset());
      
      act(() => {
        result.current.startDrag(0, 0);
      });
      
      act(() => {
        result.current.updateDrag(0, 100);
      });

      expect(result.current.dragOffset).toEqual({ x: 0, y: 100 });
    });

    it('should handle diagonal drag', () => {
      const { result } = renderHook(() => useDragOffset());
      
      act(() => {
        result.current.startDrag(0, 0);
      });
      
      act(() => {
        result.current.updateDrag(50, 50);
      });

      expect(result.current.dragOffset).toEqual({ x: 50, y: 50 });
    });

    it('should handle negative drag (moving backwards)', () => {
      const { result } = renderHook(() => useDragOffset());
      
      act(() => {
        result.current.startDrag(100, 100);
      });
      
      act(() => {
        result.current.updateDrag(50, 50);
      });

      expect(result.current.dragOffset).toEqual({ x: -50, y: -50 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small movements', () => {
      const { result } = renderHook(() => useDragOffset());
      
      act(() => {
        result.current.startDrag(0, 0);
      });
      
      act(() => {
        result.current.updateDrag(0.1, 0.1);
      });

      expect(result.current.dragOffset.x).toBeCloseTo(0.1, 1);
      expect(result.current.dragOffset.y).toBeCloseTo(0.1, 1);
    });

    it('should handle very large movements', () => {
      const { result } = renderHook(() => useDragOffset());
      
      act(() => {
        result.current.startDrag(0, 0);
      });
      
      act(() => {
        result.current.updateDrag(10000, 10000);
      });

      expect(result.current.dragOffset).toEqual({ x: 10000, y: 10000 });
    });
  });

  describe('Multiple Drag Sessions', () => {
    it('should handle consecutive drag sessions', () => {
      const { result } = renderHook(() => useDragOffset());
      
      // First drag session
      act(() => {
        result.current.startDrag(0, 0);
      });
      
      act(() => {
        result.current.updateDrag(50, 50);
      });

      expect(result.current.isDragging).toBe(true);
      expect(result.current.dragOffset).toEqual({ x: 50, y: 50 });
    });

    it('should reset between drag sessions', () => {
      const { result } = renderHook(() => useDragOffset());
      
      // First drag session
      act(() => {
        result.current.startDrag(0, 0);
      });
      
      act(() => {
        result.current.updateDrag(50, 50);
      });
      
      act(() => {
        result.current.endDrag();
      });

      expect(result.current.isDragging).toBe(false);
      expect(result.current.dragOffset).toEqual({ x: 0, y: 0 });

      // Second drag session from different position
      act(() => {
        result.current.startDrag(100, 100);
      });
      
      act(() => {
        result.current.updateDrag(150, 150);
      });

      // Should calculate offset from new start position
      expect(result.current.dragOffset).toEqual({ x: 50, y: 50 });
    });
  });
});