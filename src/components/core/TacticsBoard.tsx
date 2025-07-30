import React, { useCallback } from 'react';
import { PitchType, FootballElement, LineElement, AreaElement, Tool } from '../../@types/elements';
import FootballPitch from '../pitch/FootballPitch';
import ElementRenderer from './ElementRenderer';
import SVGMarkers from './SVGMarkers';
import Trace from '../elements/Trace';
import { TraceElement } from '../../@types/elements';
import { getSVGCoordinates } from '../../lib/svg-utils';

interface TacticsBoardProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  pitch: PitchType;
  zoomLevel: number;
  showGuidelines: false | 'lines' | 'colors' | 'full';
  elements: FootballElement[];
  selectedElement: FootballElement | null;
  tool: Tool;
  previewLine: LineElement | null;
  areaPreview: AreaElement | null;
  onMouseDown: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseUp: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseMove: (event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => void;
  onClick: (event: React.MouseEvent<SVGSVGElement>) => void;
  onTouchStart: (event: React.TouchEvent<SVGSVGElement>) => void;
  onTouchEnd: (event: React.TouchEvent<SVGSVGElement>) => void;
  onElementClick: (event: React.MouseEvent, element: FootballElement) => void;
  onElementDragStart: (event: React.MouseEvent, element: FootballElement) => void;
  onPlayerNumberDoubleClick: (event: React.MouseEvent, element: FootballElement) => void;
  onTextDoubleClick: (event: React.MouseEvent, element: FootballElement) => void;
  onAreaDoubleClick: (event: React.MouseEvent, element: AreaElement) => void;
  onLineEndpointDrag?: (lineId: string, endpointType: 'start' | 'end', x: number, y: number) => void;
  traces?: TraceElement[];
}

const TacticsBoard: React.FC<TacticsBoardProps> = ({
  svgRef,
  pitch,
  zoomLevel,
  showGuidelines,
  elements,
  selectedElement,
  previewLine,
  areaPreview,
  onMouseDown,
  onMouseUp,
  onMouseMove,
  onClick,
  onTouchStart,
  onTouchEnd,
  onElementClick,
  onElementDragStart,
  onPlayerNumberDoubleClick,
  onTextDoubleClick,
  onAreaDoubleClick,
  onLineEndpointDrag,
  traces = []
}) => {
  // Få dimensjonene først
  const getPitchDimensions = useCallback(() => {
    switch (pitch) {
      case 'full':
        return { width: 1050, height: 1050 };
      case 'fullLandscape':
        return { width: 1050, height: 680 };
      case 'handball':
        return { width: 680, height: 340 };
      case 'blankPortrait':
        return { width: 680, height: 1050 };
      case 'blankLandscape':
        return { width: 1050, height: 680 };
      case 'offensive':
        return { width: 680, height: 525 };
      case 'defensive':
        return { width: 680, height: 525 };
      default:
        return { width: 680, height: 525 };
    }
  }, [pitch]);

  const pitchDimensions = getPitchDimensions();

  const getViewBox = useCallback(() => {
    return `0 0 ${pitchDimensions.width} ${pitchDimensions.height}`;
  }, [pitchDimensions]);

  const getSVGDimensions = useCallback(() => {
    const baseWidth = pitchDimensions.width;
    const baseHeight = pitchDimensions.height;
    
    // Øk skala for å gjøre banen større og mer synlig
    const scale = 1.0;
    return {
      width: baseWidth * scale,
      height: baseHeight * scale
    };
  }, [pitchDimensions]);

  // Filter out null/undefined elements and ensure they have required properties
  const safeElements = (elements ?? []).filter((element): element is FootballElement => {
    return element !== null && 
           element !== undefined && 
           typeof element === 'object' &&
           typeof element.id === 'string' &&
           typeof element.type === 'string';
  });

  // Deduplicate elements by ID first to avoid React key conflicts
  const uniqueElements = safeElements.reduce((acc, element) => {
    const existingIndex = acc.findIndex(el => el.id === element.id);
    if (existingIndex >= 0) {
      // Replace with the latest version of the element
      acc[existingIndex] = element;
    } else {
      acc.push(element);
    }
    return acc;
  }, [] as FootballElement[]);

  // Separate traces from other elements to avoid duplicates
  const traceElements = uniqueElements.filter(el => el.type === 'trace');
  const nonTraceElements = uniqueElements.filter(el => el.type !== 'trace');
  const visibleElements = nonTraceElements.filter(el => el.visible !== false);

  // Removed unused getSVGCoordinatesFromEvent

  const handleSVGClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    // Debug logging for tests - include coordinate transformation
    if (process.env.NODE_ENV === 'test') {
      const svg = event.currentTarget;
      const coords = getSVGCoordinates(event.clientX, event.clientY, svg);
      console.log('TacticsBoard click debug:', {
        input: { clientX: event.clientX, clientY: event.clientY },
        hasCurrentTarget: !!event.currentTarget,
        svgX: coords.x,
        svgY: coords.y
      });
    }
    
    // Pass original event - let handlers do their own coordinate transformation
    onClick(event);
  }, [onClick]);

  const handleSVGMouseDown = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    onMouseDown(event);
  }, [onMouseDown]);

  const handleSVGMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    onMouseMove(event);
  }, [onMouseMove]);

  const handleSVGMouseUp = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    onMouseUp(event);
  }, [onMouseUp]);

  const handleSVGTouchStart = useCallback((event: React.TouchEvent<SVGSVGElement>) => {
    onTouchStart(event);
  }, [onTouchStart]);

  const handleSVGTouchEnd = useCallback((event: React.TouchEvent<SVGSVGElement>) => {
    onTouchEnd(event);
  }, [onTouchEnd]);


  return (
    <div 
      className="tactics-board h-full flex items-center justify-center"
      data-testid="tactics-board-container"
      style={{ transform: `scale(${zoomLevel})` }}
    >
      <svg
        ref={svgRef}
        viewBox={getViewBox()}
        className="w-full h-auto border border-gray-300 bg-green-50"
        style={{ 
          maxHeight: '100%',
          width: 'auto'
        }}
        role="img"
        aria-label="Football tactics board"
        onMouseDown={handleSVGMouseDown}
        onMouseMove={handleSVGMouseMove}
        onMouseUp={handleSVGMouseUp}
        onMouseLeave={handleSVGMouseUp}
        onClick={handleSVGClick}
        onTouchStart={handleSVGTouchStart}
        onTouchEnd={handleSVGTouchEnd}
      >
        {/* SVG Definitions */}
        <defs>
          <SVGMarkers />
        </defs>

        {/* Render pitch */}
        <FootballPitch pitchType={pitch} showGuidelines={showGuidelines} />

        {/* Render traces BEFORE other elements so they appear behind */}
        {traceElements.map((trace) => (
          <Trace
            key={trace.id}
            element={trace as TraceElement}
            isSelected={false}
          />
        ))}

        {/* Also render traces from the traces prop if provided (for backwards compatibility), but only if not already in traceElements */}
        {traces && traces.filter(trace => !traceElements.some(existing => existing.id === trace.id)).map((trace) => (
          <Trace
            key={`prop-${trace.id}`}
            element={trace}
            isSelected={false}
          />
        ))}

        {/* Render visible elements */}
        {visibleElements.map((element) => (
          <ElementRenderer
            key={element.id}
            element={element}
            isSelected={selectedElement?.id === element.id}
            onElementClick={onElementClick}
            onElementDragStart={onElementDragStart}
            onPlayerNumberDoubleClick={onPlayerNumberDoubleClick}
            onTextDoubleClick={onTextDoubleClick}
            onAreaDoubleClick={onAreaDoubleClick}
            onLineEndpointDrag={onLineEndpointDrag ? (endpointType, x, y) => onLineEndpointDrag(element.id, endpointType, x, y) : undefined}
          />
        ))}

        {/* Preview line */}
        {previewLine && (
          <path
            d={previewLine.path}
            fill="none"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}

        {/* Area preview - fjern midlertidig for å unngå feil */}
        {areaPreview && areaPreview.x !== undefined && areaPreview.y !== undefined && areaPreview.width !== undefined && areaPreview.height !== undefined && (
          <rect
            x={areaPreview.x}
            y={areaPreview.y}
            width={areaPreview.width}
            height={areaPreview.height}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>
    </div>
  );
};

export default TacticsBoard;