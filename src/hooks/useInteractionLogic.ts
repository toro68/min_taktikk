import { useState, useCallback, useRef } from 'react';
import { LineElement } from '../@types/elements';
import { LineStyle } from '../types';
import { getLineProperties, createLinePathMemoized } from '../lib/line-utils';
import { getSVGCoordinates } from '../lib/svg-utils';
import { generateId } from '../lib/utils';
import { debugLog } from '../lib/debug';

interface UseInteractionLogicProps {
  addElementToCurrentFrame: (element: LineElement) => void;
  selectedLineStyle: LineStyle;
  setSelectedLineStyle: (style: LineStyle) => void;
  lineColor: string;
  setLineColor: (color: string) => void;
  curveOffset: number;
  setCurveOffset: (offset: number) => void;
}

export const useInteractionLogic = (props: UseInteractionLogicProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentLineStart, setCurrentLineStart] = useState<{ x: number; y: number } | null>(null);
  const [previewLine, setPreviewLine] = useState<LineElement | null>(null);
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);
  
  // Use passed-in values instead of local state
  const { selectedLineStyle, setSelectedLineStyle, lineColor, setLineColor, curveOffset, setCurveOffset } = props;
  
  const recordedSVGRef = useRef<SVGSVGElement>(null);

  const handleLineToolClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    const coordinates = getSVGCoordinates(event.clientX, event.clientY, event.currentTarget);
    
    if (!currentLineStart) {
      // Start ny linje
      setCurrentLineStart(coordinates);
      setPreviewLine(null);
    } else {
      debugLog('🖱️ Line tool creating line with style:', selectedLineStyle);
      
      const lineProperties = getLineProperties(selectedLineStyle, lineColor, curveOffset);
      const path = createLinePathMemoized(currentLineStart, coordinates, selectedLineStyle, curveOffset);
      
      debugLog('✏️ Created line element:', {
        style: selectedLineStyle,
        properties: lineProperties,
        path,
        curveOffset
      });
      
      const lineElement: LineElement = {
        id: generateId(),
        type: 'line',
        path,
        style: selectedLineStyle,
        modifiers: {}, // Add empty modifiers
        dashed: lineProperties.dashed,
        marker: lineProperties.marker,
        color: lineProperties.strokeColor,
        curveOffset,
        visible: true
      };
      
      // Legg til linje i current frame
      props.addElementToCurrentFrame(lineElement);
      
      // Reset line state
      setCurrentLineStart(null);
      setPreviewLine(null);
    }
  }, [currentLineStart, selectedLineStyle, lineColor, curveOffset, props.addElementToCurrentFrame]);

  const handleLineMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (currentLineStart) {
      const coordinates = getSVGCoordinates(event.clientX, event.clientY, event.currentTarget);
      const previewPath = createLinePathMemoized(currentLineStart, coordinates, selectedLineStyle, curveOffset);
      
      setPreviewLine({
        id: 'line-preview',
        type: 'line',
        path: previewPath,
        style: selectedLineStyle,
        modifiers: {}, // Add empty modifiers
        color: 'gray',
        visible: true
      });
    }
  }, [currentLineStart, selectedLineStyle, curveOffset]);

  const resetLineTool = useCallback(() => {
    setCurrentLineStart(null);
    setPreviewLine(null);
  }, []);

  return {
    isRecording,
    setIsRecording,
    recordedSVGRef,
    currentLineStart,
    previewLine,
    isHelpExpanded,
    setIsHelpExpanded,
    selectedLineStyle,
    setSelectedLineStyle,
    lineColor,
    setLineColor,
    curveOffset,
    setCurveOffset,
    handleLineToolClick,
    handleLineMouseMove,
    resetLineTool
  };
};

export default useInteractionLogic;