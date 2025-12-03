import { useState, useCallback } from 'react';
import { AreaElement } from '../@types/elements';
import { getSVGCoordinates } from '../lib/svg-utils';
import { generateId } from '../lib/utils';
import { debugLog } from '../lib/debug';

interface UseAreaToolProps {
  addElementToCurrentFrame: (element: AreaElement) => void;
}

export const useAreaTool = (props: UseAreaToolProps) => {
  const [areaStartPoint, setAreaStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [areaPreview, setAreaPreview] = useState<AreaElement | null>(null);

  const resetAreaTool = useCallback(() => {
    setAreaStartPoint(null);
    setAreaPreview(null);
  }, []);

  const handleAreaClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    const coordinates = getSVGCoordinates(event.clientX, event.clientY, event.currentTarget);
    
    debugLog('Area tool click:', { coordinates, areaStartPoint });
    
    if (!areaStartPoint) {
      // Start nytt område
      setAreaStartPoint(coordinates);
      setAreaPreview(null);
      debugLog('Started new area at:', coordinates);
    } else {
      // Fullfør område
      const width = Math.abs(coordinates.x - areaStartPoint.x);
      const height = Math.abs(coordinates.y - areaStartPoint.y);
      const x = Math.min(areaStartPoint.x, coordinates.x);
      const y = Math.min(areaStartPoint.y, coordinates.y);
      
      const areaElement: AreaElement = {
        id: generateId(),
        type: 'area',
        x,
        y,
        width,
        height,
        color: 'rgba(255, 255, 0, 0.3)',
        visible: true
      };
      
      debugLog('Completing area:', areaElement);
      
      // Legg til område i current frame
      props.addElementToCurrentFrame(areaElement);
      
      // Reset area state
      setAreaStartPoint(null);
      setAreaPreview(null);
    }
  }, [areaStartPoint, props.addElementToCurrentFrame]);

  const handleAreaMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (areaStartPoint) {
      const coordinates = getSVGCoordinates(event.clientX, event.clientY, event.currentTarget);
      
      const width = Math.abs(coordinates.x - areaStartPoint.x);
      const height = Math.abs(coordinates.y - areaStartPoint.y);
      const x = Math.min(areaStartPoint.x, coordinates.x);
      const y = Math.min(areaStartPoint.y, coordinates.y);
      
      setAreaPreview({
        id: 'area-preview',
        type: 'area',
        x,
        y,
        width,
        height,
        color: 'rgba(255, 255, 0, 0.2)',
        visible: true
      });
    }
  }, [areaStartPoint]);

  return {
    areaStartPoint,
    areaPreview,
    handleAreaClick,
    handleAreaMouseMove,
    resetAreaTool
  };
};

export default useAreaTool;