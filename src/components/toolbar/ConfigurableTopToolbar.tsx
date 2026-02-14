import React, { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Redo2, Undo2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { getConfig } from '../../lib/config';
import { getIconComponent } from '../../lib/iconMap';
import { InterpolationType } from '../../lib/interpolation';

interface ConfigurableTopToolbarProps {
  playbackSpeed: number;
  setPlaybackSpeed: (value: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddKeyframe: () => void;
  onDownloadAnimation: () => void;
  onLoadAnimation: () => void;
  onLoadExampleAnimation: () => void;
  onDownloadFilm: () => void;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
  onDownloadGif: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isProcessing?: boolean;
  activeOperation?: string | null;
  mp4Progress?: number | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onRewind: () => void;
  // Advanced animation controls
  interpolationType?: InterpolationType;
  setInterpolationType?: (type: InterpolationType) => void;
  enablePathFollowing?: boolean;
  setEnablePathFollowing?: (enabled: boolean) => void;
  showTraces?: boolean;
  setShowTraces?: (value: boolean) => void;
  traceCurveOffset?: number;
  onTraceCurveChange?: (value: number) => void;
  onLoadSvgTemplate?: () => void;
}

const ConfigurableTopToolbar: React.FC<ConfigurableTopToolbarProps> = React.memo(({
  playbackSpeed,
  setPlaybackSpeed,
  onDuplicate,
  onDelete,
  onAddKeyframe,
  onDownloadAnimation,
  onLoadAnimation,
  onLoadExampleAnimation,
  onDownloadFilm,
  onDownloadPng,
  onDownloadSvg,
  onDownloadGif,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isProcessing = false,
  activeOperation = null,
  mp4Progress = null,
  isPlaying,
  onPlayPause,
  onRewind,
  interpolationType = 'smooth',
  setInterpolationType,
  enablePathFollowing = false,
  setEnablePathFollowing,
  showTraces = true,
  setShowTraces,
  traceCurveOffset = 0,
  onTraceCurveChange,
  onLoadSvgTemplate,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const config = getConfig();
  const topToolbar = config.settings.toolbar.top;
  const traceCurveRange = config.settings.traces?.curveRange || { min: -300, max: 300, step: 1 };

  const secondaryActionKeys = useMemo(
    () => new Set(['downloadPng', 'downloadSvg', 'downloadFilm', 'downloadGif', 'loadExample', 'loadSvgTemplate']),
    []
  );

  const exportActionKeys = useMemo(
    () => new Set(['downloadJson', 'downloadPng', 'downloadSvg', 'downloadFilm', 'downloadGif']),
    []
  );

  const hasAdvancedControls = Boolean(setInterpolationType || setEnablePathFollowing || setShowTraces || onTraceCurveChange);

  const groupedButtons = useMemo(() => {
    if (!topToolbar?.groups) return [] as Array<{ groupKey: string; group: any; buttons: any[] }>;

    return Object.entries(topToolbar.groups)
      .map(([groupKey, group]) => ({
        groupKey,
        group,
        buttons: (group.buttons || []).filter((button: any) => !secondaryActionKeys.has(button.key))
      }))
      .filter((entry) => entry.buttons.length > 0);
  }, [topToolbar?.groups, secondaryActionKeys]);

  const secondaryButtons = useMemo(() => {
    if (topToolbar?.grouped && topToolbar?.groups) {
      return Object.values(topToolbar.groups)
        .flatMap((group: any) => group.buttons || [])
        .filter((button: any) => secondaryActionKeys.has(button.key));
    }

    return (topToolbar?.buttons || []).filter((button: any) => secondaryActionKeys.has(button.key));
  }, [topToolbar, secondaryActionKeys]);

  if (!topToolbar) {
    return null;
  }

  const isPrimaryAction = (buttonKey: string) =>
    buttonKey === 'playPause' || buttonKey === 'addKeyframe' || buttonKey === 'downloadJson';

  const handleButtonClick = (buttonKey: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 DEBUG [ConfigurableTopToolbar]: Button clicked:', buttonKey);
    }
    
    switch (buttonKey) {
      case 'playPause':
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 Play/Pause button clicked, current isPlaying:', isPlaying);
        }
        onPlayPause();
        break;
      case 'rewind':
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 Rewind button clicked');
        }
        onRewind();
        break;
      case 'addKeyframe':
        onAddKeyframe();
        break;
      case 'toggleTraces':
        setShowTraces?.(!showTraces);
        break;
      case 'traceCurve':
        if (onTraceCurveChange && traceCurveOffset !== undefined) {
          const range = config.settings.traces?.curveRange || { min: -300, max: 300, step: 1 };
          const nextValue = traceCurveOffset >= range.max ? range.min : Math.min(traceCurveOffset + range.step, range.max);
          onTraceCurveChange(nextValue);
        }
        break;
      case 'downloadJson':
        onDownloadAnimation();
        break;
      case 'downloadPng':
        onDownloadPng();
        break;
      case 'downloadSvg':
        onDownloadSvg();
        break;
      case 'downloadFilm':
        onDownloadFilm();
        break;
      case 'downloadGif':
        onDownloadGif();
        break;
      case 'loadAnimation':
        onLoadAnimation();
        break;
      case 'loadExample':
        onLoadExampleAnimation();
        break;
      case 'loadSvgTemplate':
        onLoadSvgTemplate?.();
        break;
      case 'duplicate':
        onDuplicate();
        break;
      case 'delete':
        onDelete();
        break;
      default:
        console.warn(`Unknown button action: ${buttonKey}`);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between gap-2 h-10 px-2">
          {/* Left side - Grouped buttons */}
          <div className="flex items-center gap-3">
            {topToolbar.grouped && topToolbar.groups ? (
              groupedButtons.map(({ groupKey, group, buttons }, groupIndex) => (
                <div key={groupKey} className="flex items-center gap-1">
                  {groupIndex > 0 && <div className="h-6 border-l border-gray-200 mx-1" />}
                  {group.label && (
                    <span className="text-xs text-gray-600 mr-1">{group.label}:</span>
                  )}
                  {buttons.map((button) => {
                    const isPlayButton = button.key === 'playPause';
                    const actualIcon = isPlayButton && isPlaying ? 'Pause' : button.icon;
                    const ActualIconComponent = getIconComponent(actualIcon);
                    const fallbackLabel = button.label || button.tooltip || button.key;
                    const ariaLabel = button.label && button.tooltip
                      ? `${button.label} - ${button.tooltip}`
                      : fallbackLabel;
                    
                    // console.log('🎯 Rendering button:', button.key, 'isPlaying:', isPlaying, 'icon:', actualIcon);
                    
                    return (
                      <Tooltip key={button.key}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isPrimaryAction(button.key) ? 'default' : 'outline'}
                            size="sm"
                            disabled={isProcessing && exportActionKeys.has(button.key)}
                            aria-label={
                              isPlayButton
                                ? (isPlaying ? 'Pause animasjonen' : 'Start animasjonen')
                                : ariaLabel
                            }
                            onClick={() => handleButtonClick(button.key)}
                            className="flex items-center gap-1 h-8"
                          >
                            <ActualIconComponent className="w-4 h-4" />
                            {button.label && (
                              <span className="hidden sm:inline">{button.label}</span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                          <p className="text-[10px] font-medium">
                            {isPlayButton 
                              ? (isPlaying ? 'Pause animasjonen' : 'Start animasjonen')
                              : button.tooltip
                            }
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))
            ) : (
              // Fallback to flat buttons if not grouped
              topToolbar.buttons?.map((button) => {
                if (secondaryActionKeys.has(button.key)) {
                  return null;
                }
                const IconComponent = getIconComponent(button.icon);
                const fallbackLabel = button.label || button.tooltip || button.key;
                const ariaLabel = button.label && button.tooltip
                  ? `${button.label} - ${button.tooltip}`
                  : fallbackLabel;
                return (
                  <Tooltip key={button.key}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isPrimaryAction(button.key) ? 'default' : 'outline'}
                        size="sm"
                        aria-label={ariaLabel}
                        onClick={() => handleButtonClick(button.key)}
                        className="flex items-center gap-1 h-8"
                      >
                        <IconComponent className="w-4 h-4" />
                        {button.label && (
                          <span className="hidden sm:inline">{button.label}</span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                      <p className="text-[10px] font-medium">{button.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })
            )}

            {secondaryButtons.length > 0 && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                  aria-expanded={isMoreOpen}
                  aria-label="Vis flere handlinger"
                  className="h-8"
                >
                  Mer
                </Button>

                {isMoreOpen && (
                  <div className="absolute left-0 mt-1 w-44 rounded-md border bg-white shadow-lg z-50 p-1">
                    {secondaryButtons.map((button: any) => {
                      const IconComponent = getIconComponent(button.icon);

                      return (
                        <button
                          key={button.key}
                          type="button"
                          disabled={isProcessing && exportActionKeys.has(button.key)}
                          onClick={() => {
                            handleButtonClick(button.key);
                            setIsMoreOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-left rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                          <span>{button.label || button.tooltip || button.key}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {(onUndo || onRedo) && (
              <div className="flex items-center gap-1">
                {onUndo && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Angre"
                        disabled={!canUndo}
                        onClick={onUndo}
                        className="h-8 w-8 p-0"
                      >
                        <Undo2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                      <p className="text-[10px] font-medium">Angre (Cmd/Ctrl+Z)</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {onRedo && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Gjør om"
                        disabled={!canRedo}
                        onClick={onRedo}
                        className="h-8 w-8 p-0"
                      >
                        <Redo2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                      <p className="text-[10px] font-medium">Gjør om (Shift+Cmd/Ctrl+Z)</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </div>

          {/* Right side - Playback speed control and advanced animation settings */}
          <div className="flex items-center gap-4">
            {hasAdvancedControls && (
              <Button
                variant={showAdvancedControls ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAdvancedControls((prev) => !prev)}
                className="h-8"
              >
                Avansert
              </Button>
            )}

            {activeOperation === 'downloadFilm' && isProcessing && (
              <span className="text-[10px] px-2 py-1 rounded border bg-blue-50 text-blue-700 border-blue-200 tabular-nums">
                Eksporterer MP4{typeof mp4Progress === 'number' ? ` ${Math.round(mp4Progress)}%` : '...'}
              </span>
            )}

            {/* Advanced Animation Controls */}
            {hasAdvancedControls && showAdvancedControls && (
              <div className="flex items-center gap-3">
                {/* Interpolation Type */}
                {setInterpolationType && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Interpolering:</span>
                    <div className="flex gap-1">
                      {[
                        { value: 'linear' as InterpolationType, label: 'Lineær', tooltip: 'Lineær - konstant hastighet' },
                        { value: 'smooth' as InterpolationType, label: 'Jevn', tooltip: 'Jevn - myk start og stopp' },
                        { value: 'easeIn' as InterpolationType, label: 'Inn', tooltip: 'Inn - langsom start' },
                        { value: 'easeOut' as InterpolationType, label: 'Ut', tooltip: 'Ut - langsom avslutning' }
                      ].map((option) => (
                        <Tooltip key={option.value}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setInterpolationType(option.value)}
                              className={`px-2 py-1 text-xs rounded border transition-colors ${
                                interpolationType === option.value
                                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {option.label}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                            <p className="text-[10px] font-medium">{option.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}

                {/* Path Following */}
                {setEnablePathFollowing && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enablePathFollowing}
                          onChange={(e) => setEnablePathFollowing(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs font-medium text-gray-700">
                          Bane-følging
                        </span>
                      </label>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                      <p className="text-[10px] font-medium">Elementer følger SVG-baner mellom keyframes</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Traces toggle */}
                {setShowTraces && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showTraces}
                          onChange={(e) => setShowTraces?.(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs font-medium text-gray-700">Bevegelseslinjer</span>
                      </label>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                      <p className="text-[10px] font-medium">Vis eller skjul bevegelseslinjer</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Trace curve slider */}
                {onTraceCurveChange && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 whitespace-nowrap">Bevegelseskurve:</span>
                    <Slider
                      value={[traceCurveOffset]}
                      onValueChange={([value]) => onTraceCurveChange?.(value)}
                      min={traceCurveRange.min}
                      max={traceCurveRange.max}
                      step={traceCurveRange.step || 0.5}
                      className="w-40"
                    />
                    <span className="text-[10px] tabular-nums w-10 text-gray-600">{traceCurveOffset}px</span>
                  </div>
                )}

                <div className="hidden lg:flex items-center gap-1 text-[10px] text-gray-500">
                  <span className={`px-1.5 py-0.5 rounded border ${isPlaying ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {isPlaying ? 'Spiller' : 'Pause'}
                  </span>
                </div>
              </div>
            )}

            {/* Playback Speed Control */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Slider
                    value={[playbackSpeed]}
                    onValueChange={([value]) => setPlaybackSpeed(value)}
                    min={0.5}
                    max={3}
                    step={0.5}
                    className="w-16"
                  />
                  <span data-testid="playback-speed-value" className="text-[10px] tabular-nums w-8">{playbackSpeed}x</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                <div className="flex flex-col">
                  <p className="text-[10px] font-medium">Juster avspillingshastighet</p>
                  <p className="text-[9px] text-gray-300">Snarvei: ↑/↓</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

export default ConfigurableTopToolbar;
