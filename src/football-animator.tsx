import React, { useEffect } from 'react';
import { useFootballAnimatorLogic } from './hooks/useFootballAnimatorLogic';
import MainLayout from './components/layout/MainLayout';
import ConfigurableTopToolbar from './components/toolbar/ConfigurableTopToolbar';
import TacticsBoard from './components/core/TacticsBoard';
// Removed unused toolbar imports
import ContextualLineToolbar from './components/toolbar/ContextualLineToolbar';
import ConfigurableBottomToolbar from './components/toolbar/ConfigurableBottomToolbar';
import AnimationSection from './components/layout/AnimationSection';
import AreaProperties from './components/properties/AreaProperties';
import LineProperties from './components/properties/LineProperties';
import TraceProperties from './components/properties/TraceProperties';
import { AreaElement, GuidelineMode, Frame, FootballElement, LineElement, TraceElement } from './@types/elements';
import { Button } from './components/ui/button';
import SVGMarkers from './components/core/SVGMarkers';
import ErrorBoundary from './components/core/ErrorBoundary';
import { extractPathEndpoints, updateLineEndpoints, getLineProperties } from './lib/line-utils';
import { useTraceManager } from './hooks/useTraceManager';
import { useInterpolation } from './hooks/useInterpolation';
import { getLineStylesConfig } from './lib/config';
import { X } from 'lucide-react';

const FootballAnimator: React.FC = () => {
  const {
    animationLogic,
    toolLogic,
    interactionLogic,
    frameActions,
    elementActions,
    exportImport,
    areaToolLogic,
    toolbarActions,
    layoutLogic
  } = useFootballAnimatorLogic();

  const traceSystemEnabled = animationLogic.showTraces || animationLogic.enablePathFollowing;

  // Trace manager for spilleranimering
  const {
    traces,
    rebuildTracesFromFrames,
    clearTraces,
    updateTrace
  } = useTraceManager({
    // Hold trace-geometri tilgjengelig for path-following selv om traces er skjult
    showTraces: traceSystemEnabled,
    curveOffset: animationLogic.traceCurveOffset
  });

  // Rebuild traces whenever frames or trace settings change so path following uses full timeline
  useEffect(() => {
    if (traceSystemEnabled) {
      rebuildTracesFromFrames(animationLogic.frames, animationLogic.traceCurveOffset);
    } else {
      clearTraces();
    }
  }, [animationLogic.frames, traceSystemEnabled, animationLogic.traceCurveOffset, rebuildTracesFromFrames, clearTraces]);

  // Interpolate elements with optional path following using trace geometry
  useInterpolation({
    currentFrame: animationLogic.currentFrame,
    progress: animationLogic.progress,
    frames: animationLogic.frames,
    setInterpolatedElements: animationLogic.setInterpolatedElements,
    showTraces: animationLogic.showTraces,
    traceCurveOffset: animationLogic.traceCurveOffset,
    interpolationType: animationLogic.interpolationType,
    enablePathFollowing: animationLogic.enablePathFollowing,
    traces
  });

  const svgTemplateFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleLoadSvgTemplate = React.useCallback(() => {
    svgTemplateFileInputRef.current?.click();
  }, []);

  const handleSvgTemplateFileSelected = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const svgText = await file.text();
        if (process.env.NODE_ENV === 'development') {
          console.log('🖼️ SVG template loaded:', { name: file.name, size: file.size });
        }
        toolLogic.setPitchTemplateSvg(svgText);
      } catch (error) {
        console.error('Failed to load SVG template', error);
      } finally {
        // Allow selecting the same file again
        event.target.value = '';
      }
    },
    [toolLogic]
  );

  const handleLoadExampleAnimation = React.useCallback(async (): Promise<void> => {
    try {
      const frames = await exportImport.handleLoadExampleAnimation();
      if (frames && Array.isArray(frames)) {
        animationLogic.setFrames(frames);
        animationLogic.setCurrentFrame(0);
        animationLogic.setProgress(0);
      }
    } catch (error) {
      // Error handling for loading example animation
    }
  }, [exportImport, animationLogic]);

  // Toolbar props are now handled directly in the components

  const tacticsBoardProps = {
    svgRef: interactionLogic.recordedSVGRef,
    pitch: toolLogic.pitch,
    zoomLevel: toolLogic.zoomLevel,
    showGuidelines: toolLogic.showGuidelines,
    pitchTemplateSvg: toolLogic.pitchTemplateSvg,
    // 🎬 KRITISK FIX: Bruk interpolated elements for smooth animasjon!
    elements: animationLogic.interpolatedElements.length > 0 
      ? animationLogic.interpolatedElements 
      : layoutLogic.elementsToRender,
    selectedElement: toolLogic.selectedElement,
    tool: toolLogic.tool,
    previewLine: interactionLogic.previewLine,
    areaPreview: areaToolLogic.areaPreview,
    onMouseDown: (event: React.MouseEvent<SVGSVGElement>) => 
      elementActions.handleMouseDown(event, toolLogic.tool, toolLogic.setSelectedElement, toolLogic.pitch),
    onMouseUp: (event: React.MouseEvent<SVGSVGElement>) => 
      elementActions.handleMouseUp(event, toolLogic.pitch),
    onMouseMove: (event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => 
      elementActions.handleMouseMove(event as React.MouseEvent<SVGSVGElement>, toolLogic.pitch),
    onClick: (event: React.MouseEvent<SVGSVGElement>) => 
      elementActions.handleClick(event, toolLogic.tool, Number(toolLogic.currentNumber), toolLogic.incrementCurrentNumber, toolLogic.setSelectedElement, toolLogic.pitch),
    onTouchStart: (event: React.TouchEvent<SVGSVGElement>) => 
      elementActions.handleTouchStart(event, toolLogic.tool, toolLogic.setSelectedElement, toolLogic.pitch),
    onTouchEnd: (event: React.TouchEvent<SVGSVGElement>) => 
      elementActions.handleTouchEnd(event, toolLogic.pitch),
    onElementClick: (event: React.MouseEvent, element: FootballElement) => {
      elementActions.handleElementClick(event, element);
      toolLogic.setSelectedElement(element);
    },
    onElementDragStart: (event: React.MouseEvent, element: FootballElement) => 
      interactionLogic.recordedSVGRef.current && elementActions.handleElementDragStart(event, element, interactionLogic.recordedSVGRef as React.RefObject<SVGSVGElement>, toolLogic.pitch),
    onPlayerNumberDoubleClick: elementActions.handlePlayerNumberDoubleClick,
    onTextDoubleClick: elementActions.handleTextDoubleClick,
    onAreaDoubleClick: elementActions.handleAreaDoubleClick,
    onLineEndpointDrag: (lineId: string, endpointType: 'start' | 'end', x: number, y: number) => {
      const element = layoutLogic.elementsToRender.find(el => el.id === lineId && el.type === 'line');
      if (!element) return;

      const line = element as LineElement;
      const currentEndpoints = extractPathEndpoints(line.path);
      if (!currentEndpoints) return;

      const newStart = endpointType === 'start' ? { x, y } : currentEndpoints.start;
      const newEnd = endpointType === 'end' ? { x, y } : currentEndpoints.end;

      const newPath = updateLineEndpoints(line.path, line.style, newStart, newEnd, line.curveOffset || 0);
      
      elementActions.updateFrameElement(animationLogic.currentFrame, lineId, { path: newPath });
    },
    traces: animationLogic.showTraces ? traces : [],
    onTraceClick: (_event: React.MouseEvent, trace: TraceElement) => {
      toolLogic.setSelectedElement(trace);
    }
  };


  // Logikk for å håndtere standard linjeegenskaper når verktøyet er valgt
  const lineProperties = getLineProperties(toolLogic.selectedLineStyle, toolLogic.lineColor, toolLogic.curveOffset);
  const lineDefaultsForToolbar: LineElement = {
    id: 'line-defaults',
    type: 'line',
    path: '',
    style: toolLogic.selectedLineStyle,
    modifiers: {}, // Add empty modifiers for now
    color: toolLogic.lineColor,
    curveOffset: toolLogic.curveOffset,
    dashed: lineProperties.dashed,
    marker: lineProperties.marker,
    visible: true
  };

  const handleDefaultLineUpdate = (updates: Partial<LineElement>) => {
    if (updates.style) {
      toolLogic.setSelectedLineStyle(updates.style);
    }
    if (updates.color) {
      toolLogic.setLineColor(updates.color);
    }
    if (updates.curveOffset !== undefined) {
      toolLogic.setCurveOffset(updates.curveOffset);
    }
    if (updates.dashed !== undefined) {
      // Hvis toolLogic har en dashed setter, bruk den her
      // toolLogic.setDashed(updates.dashed);
    }
    if (updates.marker !== undefined) {
      // Hvis toolLogic har en marker setter, bruk den her
      // toolLogic.setMarker(updates.marker);
    }
  };

  const updateSelectedLine = React.useCallback((updates: Partial<LineElement>) => {
    if (toolLogic.selectedElement?.type !== 'line') {
      return;
    }

    const selectedLine = toolLogic.selectedElement as LineElement;
    elementActions.updateFrameElement(
      animationLogic.currentFrame,
      selectedLine.id,
      updates
    );

    toolLogic.setSelectedElement({
      ...selectedLine,
      ...updates
    });
  }, [toolLogic.selectedElement, toolLogic.setSelectedElement, elementActions, animationLogic.currentFrame]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          frameActions.handlePlayPause();
          break;
        case 'KeyR':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with browser refresh
          event.preventDefault();
          animationLogic.setCurrentFrame(0);
          animationLogic.setProgress(0);
          break;
        case 'ArrowLeft':
        case 'ArrowRight': {
          if (toolLogic.selectedElement?.type !== 'line') {
            break;
          }

          event.preventDefault();
          const selectedLine = toolLogic.selectedElement as LineElement;
          const curveRange = getLineStylesConfig().curveRange;
          const step = (curveRange.step || 1) * (event.shiftKey ? 5 : 1);
          const direction = event.code === 'ArrowRight' ? 1 : -1;
          const nextCurveOffset = Math.max(
            curveRange.min,
            Math.min(curveRange.max, (selectedLine.curveOffset || 0) + step * direction)
          );

          const endpoints = selectedLine.path ? extractPathEndpoints(selectedLine.path) : null;
          if (!endpoints) {
            updateSelectedLine({ curveOffset: nextCurveOffset });
            break;
          }

          const nextPath = updateLineEndpoints(
            selectedLine.path,
            selectedLine.style,
            endpoints.start,
            endpoints.end,
            nextCurveOffset
          );

          updateSelectedLine({
            curveOffset: nextCurveOffset,
            path: nextPath
          });
          break;
        }
        case 'Digit0': {
          if (toolLogic.selectedElement?.type !== 'line') {
            break;
          }

          event.preventDefault();
          const selectedLine = toolLogic.selectedElement as LineElement;
          const endpoints = selectedLine.path ? extractPathEndpoints(selectedLine.path) : null;
          if (!endpoints) {
            updateSelectedLine({ curveOffset: 0 });
            break;
          }

          const nextPath = updateLineEndpoints(
            selectedLine.path,
            selectedLine.style,
            endpoints.start,
            endpoints.end,
            0
          );

          updateSelectedLine({
            curveOffset: 0,
            path: nextPath
          });
          break;
        }
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [frameActions, animationLogic, toolLogic.selectedElement, updateSelectedLine]);

  return (
    <ErrorBoundary>
      <MainLayout>
        <input
          ref={svgTemplateFileInputRef}
          type="file"
          accept="image/svg+xml,.svg"
          onChange={handleSvgTemplateFileSelected}
          className="hidden"
        />
        <ConfigurableTopToolbar 
          playbackSpeed={animationLogic.playbackSpeed}
          setPlaybackSpeed={animationLogic.setPlaybackSpeed}
          onDuplicate={frameActions.handleDuplicateFrame}
          onDelete={frameActions.handleDeleteFrame}
          onAddKeyframe={frameActions.handleAddKeyframe}
          onDownloadAnimation={() => exportImport.handleDownloadAnimation(animationLogic.frames)}
          onLoadAnimation={exportImport.handleLoadAnimation}
          onLoadExampleAnimation={handleLoadExampleAnimation}
          onDownloadFilm={() => {
            const originalFrame = animationLogic.currentFrame;
            const originalProgress = animationLogic.progress;

            exportImport.handleDownloadFilm(
              animationLogic.frames,
              interactionLogic.recordedSVGRef.current || undefined,
              {
                seekFrame: async (frameIndex: number, frameProgress: number) => {
                  animationLogic.setCurrentFrame(frameIndex);
                  animationLogic.setProgress(frameProgress);
                  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
                },
                restoreFrame: () => {
                  animationLogic.setCurrentFrame(originalFrame);
                  animationLogic.setProgress(originalProgress);
                }
              }
            );
          }}
          onDownloadPng={() => exportImport.handleDownloadPng(interactionLogic.recordedSVGRef.current || undefined)}
          onDownloadSvg={() => exportImport.handleDownloadSvg(interactionLogic.recordedSVGRef.current || undefined)}
          onDownloadGif={() => exportImport.handleDownloadGif(animationLogic.frames, interactionLogic.recordedSVGRef.current || undefined)}
          isPlaying={animationLogic.isPlaying}
          onPlayPause={frameActions.handlePlayPause}
          onRewind={() => {
            animationLogic.setCurrentFrame(0);
            animationLogic.setProgress(0);
          }}
          // Advanced animation controls
          interpolationType={animationLogic.interpolationType}
          setInterpolationType={animationLogic.setInterpolationType}
          enablePathFollowing={animationLogic.enablePathFollowing}
          setEnablePathFollowing={animationLogic.setEnablePathFollowing}
          showTraces={animationLogic.showTraces}
          setShowTraces={animationLogic.setShowTraces}
          traceCurveOffset={animationLogic.traceCurveOffset}
          onTraceCurveChange={animationLogic.setTraceCurveOffset}
          onLoadSvgTemplate={handleLoadSvgTemplate}
        />
        
        <div className="flex flex-1 overflow-hidden min-h-0">
          <div className="flex-1 flex items-center justify-center p-2 bg-gray-100">
            <div className="w-full h-full max-w-7xl shadow-lg bg-white">
              <TacticsBoard {...tacticsBoardProps} />
            </div>
          </div>

          {/* Properties Sidebar */}
          {toolLogic.selectedElement && (
            <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Egenskaper</h2>
                <Button variant="ghost" size="icon" onClick={() => toolLogic.setSelectedElement(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {toolLogic.selectedElement.type === 'line' && (
                <LineProperties
                  line={toolLogic.selectedElement as LineElement}
                  updateElement={updateSelectedLine}
                />
              )}
              {toolLogic.selectedElement.type === 'area' && (
                <AreaProperties
                  area={toolLogic.selectedElement as AreaElement}
                  updateElement={(updates) =>
                    elementActions.updateFrameElement(
                      animationLogic.currentFrame,
                      toolLogic.selectedElement!.id,
                      updates
                    )
                  }
                />
              )}
              {toolLogic.selectedElement.type === 'trace' && (
                <TraceProperties
                  trace={toolLogic.selectedElement as TraceElement}
                  globalCurveOffset={animationLogic.traceCurveOffset}
                  updateElement={(updates) => {
                    const traceId = toolLogic.selectedElement!.id;
                    const updated = updateTrace(traceId, updates);
                    if (updated) {
                      toolLogic.setSelectedElement(updated);
                    }
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Hovedverktøy nederst for lett tilgang */}
        <ConfigurableBottomToolbar 
          selectedTool={toolLogic.tool}
          setSelectedTool={toolLogic.setTool}
          pitch={toolLogic.pitch}
          handleTogglePitch={toolLogic.handleTogglePitch}
          onDeleteElement={elementActions.handleDeleteElement}
          selectedElement={toolLogic.selectedElement}
        />

        {/* Kompakt animasjon og tidslinje */}
        <AnimationSection
          isPlaying={animationLogic.isPlaying}
          onPlayPause={frameActions.handlePlayPause}
          onRewind={() => {
            animationLogic.setCurrentFrame(0);
            animationLogic.setProgress(0);
          }}
          playbackSpeed={animationLogic.playbackSpeed}
          onSpeedChange={animationLogic.setPlaybackSpeed}
          progress={animationLogic.progress}
          currentFrame={animationLogic.currentFrame}
          frames={animationLogic.frames}
          onProgressChange={animationLogic.setProgress}
          onSeek={(frame, frameProgress) => {
            animationLogic.setCurrentFrame(frame);
            animationLogic.setProgress(frameProgress);
          }}
        />

        {interactionLogic.isHelpExpanded && (
          <div className="p-3 bg-gray-50 border-t">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium">Hurtigtips</h3>
              <Button onClick={() => interactionLogic.setIsHelpExpanded(false)} variant="ghost" size="sm" className="h-6 w-6 p-0">
                ×
              </Button>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Dobbeltklikk spillere/tekst for å redigere</p>
              <p>• Dra elementer for å flytte dem</p>
              <p>• Bruk linjeverktøyet for bevegelser</p>
            </div>
          </div>
        )}

        {/* Contextual Line Toolbar - vises når en linje er valgt */}
        {toolLogic.selectedElement?.type === 'line' && (
          <ContextualLineToolbar
            line={toolLogic.selectedElement as LineElement}
            updateElement={updateSelectedLine}
            isVisible={true}
          />
        )}

        {/* Contextual Line Toolbar for line tool defaults */}
        {toolLogic.tool === 'line' && !toolLogic.selectedElement && (
          <ContextualLineToolbar
            line={lineDefaultsForToolbar}
            updateElement={handleDefaultLineUpdate}
            isVisible={true}
          />
        )}

      </MainLayout>
    </ErrorBoundary>
  );
};

export default FootballAnimator;
