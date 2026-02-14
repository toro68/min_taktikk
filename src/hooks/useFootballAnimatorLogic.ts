import { useAnimationLogic } from './useAnimationLogic';
import { useToolLogic } from './useToolLogic';
import { useInteractionLogic } from './useInteractionLogic';
import { useAreaTool } from './useAreaTool';
import { useElementActions } from './useElementActions';
import { useEnhancedExportImport } from './useEnhancedExportImport';
import { useElementLayout } from './useElementLayout';
import { useFrameActions } from './useFrameActions';
import { useToolbarActions } from './useToolbarActions';
import { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import { FootballElement, Tool } from '../@types/elements';
import { getSVGCoordinates, Coordinates } from '../lib/svg-utils';
import debug from '../lib/debug';
import { useToast } from '../providers/ToastProvider';

export const useFootballAnimatorLogic = () => {
  const { showToast } = useToast();
  
  // Remove complex drag state - let useElementActions handle it

  // Core hooks
  const animationLogic = useAnimationLogic();
  const toolLogic = useToolLogic();
  
  // Create element actions with correct parameters
  const elementActions = useElementActions(
    animationLogic.frames,
    animationLogic.setFrames,
    animationLogic.currentFrame,
    {
      selectedLineStyle: toolLogic.selectedLineStyle,
      lineColor: toolLogic.lineColor,
      customColor: toolLogic.customColor,
      curveOffset: toolLogic.curveOffset
    }
  );
  
  const interactionLogic = useInteractionLogic({
    addElementToCurrentFrame: elementActions.addElementToCurrentFrame,
    selectedLineStyle: toolLogic.selectedLineStyle,
    setSelectedLineStyle: toolLogic.setSelectedLineStyle,
    lineColor: toolLogic.lineColor,
    setLineColor: toolLogic.setLineColor,
    curveOffset: toolLogic.curveOffset,
    setCurveOffset: toolLogic.setCurveOffset
  });
  
  // SKIP PROBLEMATIC HOOKS - lage minimal implementasjon
  const frameActions = useFrameActions(
    animationLogic.frames,
    animationLogic.setFrames,
    animationLogic.currentFrame,
    animationLogic.setCurrentFrame,
    animationLogic.isPlaying,
    animationLogic.setIsPlaying,
    animationLogic.progress,
    animationLogic.setProgress
  );

  const exportImport = useEnhancedExportImport();

  const areaToolLogic = useAreaTool({
    addElementToCurrentFrame: elementActions.addElementToCurrentFrame
  });

  // Use proper toolbar actions hook
  const toolbarActions = useToolbarActions({
    frames: animationLogic.frames,
    setFrames: animationLogic.setFrames,
    setCurrentNumber: toolLogic.setCurrentNumber
  });

  // Element layout logic
  const layoutLogic = useElementLayout(
    animationLogic.frames,
    animationLogic.currentFrame,
    animationLogic.progress,
    animationLogic.interpolatedElements
  );

  // Enhanced coordinate calculation with better throttling
  const getEventCoordinates = useCallback((event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if ('touches' in event) {
      // Touch event
      const touch = event.touches[0] || event.changedTouches[0];
      if (touch) {
        return getSVGCoordinates(touch.clientX, touch.clientY, event.currentTarget);
      }
    } else {
      // Mouse event - cast to mouse event to access clientX/clientY
      const mouseEvent = event as React.MouseEvent<SVGSVGElement>;
      return getSVGCoordinates(mouseEvent.clientX, mouseEvent.clientY, mouseEvent.currentTarget);
    }
    // Fallback
    return { x: 0, y: 0 };
  }, []);

  // Simple element actions wrapper - use original functionality
  const enhancedElementActions = {
    ...elementActions,

    handleClick: useCallback((event: any, tool: string, currentNumber: number, incrementNumber: () => void, setSelectedElement: (element: any) => void, pitch: string) => {
      // Just use the original handleClick from elementActions
      try {
        elementActions.handleClick(event, tool as Tool, currentNumber, incrementNumber, setSelectedElement, pitch);
      } catch (error) {
        console.error('Error in handleClick:', error);
      }
    }, [elementActions]),

    handleMouseDown: useCallback((event: React.MouseEvent<SVGSVGElement>, tool: string, setSelectedElement: (element: any) => void, pitch: string) => {
      try {
        elementActions.handleMouseDown(event, tool as Tool, setSelectedElement, pitch);
      } catch (error) {
        console.error('Error in handleMouseDown:', error);
      }
    }, [elementActions]),

    handleMouseUp: useCallback((event: React.MouseEvent<SVGSVGElement>, pitch: string) => {
      try {
        elementActions.handleMouseUp(event, pitch);
      } catch (error) {
        console.error('Error in handleMouseUp:', error);
      }
    }, [elementActions]),

    handleMouseMove: useCallback((event: React.MouseEvent<SVGSVGElement>, pitch: string) => {
      try {
        elementActions.handleMouseMove(event, pitch);
      } catch (error) {
        console.error('Error in handleMouseMove:', error);
      }
    }, [elementActions]),

    handleElementClick: useCallback((event: React.MouseEvent<Element>, element: FootballElement) => {
      try {
        elementActions.handleElementClick(event, element);
      } catch (error) {
        console.error('Error in handleElementClick:', error);
      }
    }, [elementActions])
  };

  // Memoized logic objects to prevent unnecessary re-renders
  const animationState = useMemo(() => ({
    currentFrame: animationLogic.currentFrame,
    isPlaying: animationLogic.isPlaying,
    showTraces: animationLogic.showTraces,
    traceCurveOffset: animationLogic.traceCurveOffset,
    // Add missing properties
    playbackSpeed: animationLogic.playbackSpeed,
    setPlaybackSpeed: animationLogic.setPlaybackSpeed,
    progress: animationLogic.progress,
    setProgress: animationLogic.setProgress,
    frames: animationLogic.frames,
    setFrames: animationLogic.setFrames,
    setCurrentFrame: animationLogic.setCurrentFrame,
    setShowTraces: animationLogic.setShowTraces,
    setTraceCurveOffset: animationLogic.setTraceCurveOffset,
    interpolatedElements: animationLogic.interpolatedElements,
    setInterpolatedElements: animationLogic.setInterpolatedElements,
    // 🎬 KRITISK: Nye avanserte animasjonsfunksjoner
    interpolationType: animationLogic.interpolationType,
    setInterpolationType: animationLogic.setInterpolationType,
    enablePathFollowing: animationLogic.enablePathFollowing,
    setEnablePathFollowing: animationLogic.setEnablePathFollowing
  }), [animationLogic]);

  const toolState = useMemo(() => ({
    tool: toolLogic.tool,
    // Add missing properties
    setTool: toolLogic.setTool,
    pitch: toolLogic.pitch,
    pitchTemplateSvg: toolLogic.pitchTemplateSvg,
    setPitchTemplateSvg: toolLogic.setPitchTemplateSvg,
    zoomLevel: toolLogic.zoomLevel,
    showGuidelines: toolLogic.showGuidelines,
    selectedElement: toolLogic.selectedElement,
    setSelectedElement: toolLogic.setSelectedElement,
    currentNumber: toolLogic.currentNumber,
    incrementCurrentNumber: toolLogic.incrementCurrentNumber,
    handleTogglePitch: toolLogic.handleTogglePitch,
    handleToggleGuidelines: toolLogic.handleToggleGuidelines,
    handleResetNumbers: toolLogic.handleResetNumbers,
    // Line-related properties
    selectedLineStyle: toolLogic.selectedLineStyle,
    setSelectedLineStyle: toolLogic.setSelectedLineStyle,
    curveOffset: toolLogic.curveOffset,
    setCurveOffset: toolLogic.setCurveOffset,
    lineColor: toolLogic.lineColor,
    setLineColor: toolLogic.setLineColor,
    customColor: toolLogic.customColor,
    setCustomColor: toolLogic.setCustomColor
  }), [toolLogic]);

  const interactionState = useMemo(() => ({
    recordedSVGRef: interactionLogic.recordedSVGRef,
    previewLine: interactionLogic.previewLine,
    isHelpExpanded: interactionLogic.isHelpExpanded,
    setIsHelpExpanded: interactionLogic.setIsHelpExpanded
  }), [interactionLogic]);

  const frameState = useMemo(() => ({
    handleDuplicateFrame: frameActions.handleDuplicateFrame,
    handleDeleteFrame: frameActions.handleDeleteFrame,
    handleAddKeyframe: frameActions.handleAddKeyframe,
    handlePlayPause: frameActions.handlePlayPause,
    handleSeek: frameActions.handleSeek
  }), [frameActions]);

  const elementState = useMemo(() => ({
    ...enhancedElementActions
  }), [enhancedElementActions]);

  const exportImportState = useMemo(() => ({
    // Updated properties for enhanced hook
    isProcessing: exportImport.isProcessing,
    activeOperation: exportImport.activeOperation,
    mp4Progress: exportImport.mp4Progress,
    error: exportImport.error,
    // Use actual functions from enhanced hook
    handleDownloadAnimation: exportImport.handleDownloadAnimation,
    handleLoadAnimation: exportImport.handleLoadAnimation,
    handleLoadExampleAnimation: exportImport.handleLoadExampleAnimation,
    handleDownloadFilm: exportImport.handleDownloadFilm,
    handleDownloadPng: exportImport.handleDownloadPng,
    handleDownloadSvg: exportImport.handleDownloadSvg,
    handleDownloadGif: exportImport.handleDownloadGif
  }), [exportImport]);

  const areaToolState = useMemo(() => ({
    areaPreview: areaToolLogic.areaPreview
  }), [areaToolLogic]);

  const toolbarState = useMemo(() => ({
    handleClearElements: toolbarActions.handleClearElements
  }), [toolbarActions]);

  const layoutState = useMemo(() => ({
    elementsToRender: layoutLogic.elementsToRender
  }), [layoutLogic]);

  return {
    animationLogic: animationState,
    toolLogic: toolState,
    interactionLogic: interactionState,
    frameActions: frameState,
    elementActions: elementState,
    exportImport: exportImportState,
    areaToolLogic: areaToolState,
    toolbarActions: toolbarState,
    layoutLogic: layoutState
  };
};

export default useFootballAnimatorLogic;
