import { useState, useCallback } from 'react';
import { Tool, PitchType, FootballElement } from '../@types/elements';
import { LineStyle } from '../types';

export const useToolLogic = () => {
  const [tool, setTool] = useState<Tool>('select');
  const [pitch, setPitch] = useState<PitchType>('offensive');
  const [selectedElement, setSelectedElement] = useState<FootballElement | null>(null);
  const [showGuidelines, setShowGuidelines] = useState<false | 'lines' | 'colors' | 'full'>(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentNumber, setCurrentNumber] = useState<string>("1");
  
  // Line-specific states - oppdatert default til 'solidStraight' for konsistens
  const [selectedLineStyle, setSelectedLineStyleInternal] = useState<LineStyle>('solidStraight');
  const [curveOffset, setCurveOffset] = useState<number>(0);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [customColor, setCustomColor] = useState<string>('#ff0000');
  
  // Wrapper to log style changes
  const setSelectedLineStyle = useCallback((style: LineStyle) => {
    setSelectedLineStyleInternal(style);
  }, []);

  const handleTogglePitch = useCallback(() => {
    if (pitch === 'full') {
      setPitch('fullLandscape');
    } else if (pitch === 'fullLandscape') {
      setPitch('offensive');
    } else if (pitch === 'offensive') {
      setPitch('defensive');
    } else if (pitch === 'defensive') {
      setPitch('handball');
    } else {
      setPitch('full');
    }
  }, [pitch]);

  const handleToggleGuidelines = useCallback(() => {
    setShowGuidelines(prev => {
      if (prev === false) return 'lines';
      if (prev === 'lines') return 'colors';
      if (prev === 'colors') return 'full';
      return false;
    });
  }, []);

  const handleResetNumbers = useCallback(() => {
    setCurrentNumber("1");
  }, []);

  const incrementCurrentNumber = useCallback(() => {
    setCurrentNumber(prev => {
      const nextNum = parseInt(prev) + 1;
      return nextNum.toString();
    });
  }, []);

  return {
    tool,
    setTool,
    pitch,
    setPitch,
    selectedElement,
    setSelectedElement,
    showGuidelines,
    setShowGuidelines,
    zoomLevel,
    setZoomLevel,
    currentNumber,
    setCurrentNumber,
    selectedLineStyle,
    setSelectedLineStyle,
    curveOffset,
    setCurveOffset,
    lineColor,
    setLineColor,
    customColor,
    setCustomColor,
    handleTogglePitch,
    handleToggleGuidelines,
    handleResetNumbers,
    incrementCurrentNumber
  };
};

export default useToolLogic;