import { useState, useCallback } from 'react';
import { Tool, Element } from '../@types/elements';
import { LineStyle } from '../components/LineStyleSelector';

interface ToolState {
  selectedTool: Tool;
  selectedElementId: string | null;
  selectedLineStyle: LineStyle;
  curveOffset: number;
  lineColor: string;
  customColor: string;
}

interface UseToolStateReturn {
  selectedTool: Tool;
  selectedElementId: string | null;
  selectedLineStyle: LineStyle;
  curveOffset: number;
  lineColor: string;
  customColor: string;
  setSelectedTool: (tool: Tool) => void;
  setSelectedElementId: (id: string | null) => void;
  setSelectedLineStyle: (style: LineStyle) => void;
  setCurveOffset: (offset: number) => void;
  setLineColor: (color: string) => void;
  setCustomColor: (color: string) => void;
  isElementSelected: (element: Element) => boolean;
}

export const useToolState = (initialTool: Tool = 'select'): UseToolStateReturn => {
  const [state, setState] = useState<ToolState>({
    selectedTool: initialTool,
    selectedElementId: null,
    selectedLineStyle: 'solidCurved',
    curveOffset: 50,
    lineColor: 'black',
    customColor: '#ff0000'
  });
  
  // Sett valgt verktøy
  const setSelectedTool = useCallback((tool: Tool) => {
    setState(prev => ({
      ...prev,
      selectedTool: tool,
      // Fjern valgt element når vi bytter verktøy
      selectedElementId: tool === 'select' ? prev.selectedElementId : null
    }));
  }, []);
  
  // Sett valgt element-ID
  const setSelectedElementId = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedElementId: id,
      // Bytt til valgverktøyet når vi velger et element
      selectedTool: id ? 'select' : prev.selectedTool
    }));
  }, []);
  
  // Sett valgt linjestil
  const setSelectedLineStyle = useCallback((style: LineStyle) => {
    setState(prev => ({
      ...prev,
      selectedLineStyle: style
    }));
  }, []);
  
  // Sett kurveforskyvning
  const setCurveOffset = useCallback((offset: number) => {
    setState(prev => ({
      ...prev,
      curveOffset: offset
    }));
  }, []);
  
  // Sett linjefarge
  const setLineColor = useCallback((color: string) => {
    setState(prev => ({
      ...prev,
      lineColor: color
    }));
  }, []);
  
  // Sett egendefinert farge
  const setCustomColor = useCallback((color: string) => {
    setState(prev => ({
      ...prev,
      customColor: color
    }));
  }, []);
  
  // Sjekk om et element er valgt
  const isElementSelected = useCallback((element: Element) => {
    return element.id === state.selectedElementId;
  }, [state.selectedElementId]);
  
  return {
    selectedTool: state.selectedTool,
    selectedElementId: state.selectedElementId,
    selectedLineStyle: state.selectedLineStyle,
    curveOffset: state.curveOffset,
    lineColor: state.lineColor,
    customColor: state.customColor,
    setSelectedTool,
    setSelectedElementId,
    setSelectedLineStyle,
    setCurveOffset,
    setLineColor,
    setCustomColor,
    isElementSelected
  };
}; 