import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
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
  onDownloadGif: () => void;
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
  onDownloadGif,
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
}) => {
  const config = getConfig();
  const topToolbar = config.settings.toolbar.top;
  const traceCurveRange = config.settings.traces?.curveRange || { min: -300, max: 300, step: 1 };

  if (!topToolbar) {
    return null;
  }

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
          <div className="flex items-center gap-4">
            {topToolbar.grouped && topToolbar.groups ? (
              Object.entries(topToolbar.groups).map(([groupKey, group]) => (
                <div key={groupKey} className="flex items-center gap-1">
                  {group.label && (
                    <span className="text-sm text-gray-600 mr-2">{group.label}:</span>
                  )}
                  {group.buttons.map((button) => {
                    const IconComponent = getIconComponent(button.icon);
                    const isPlayButton = button.key === 'playPause';
                    const actualIcon = isPlayButton && isPlaying ? 'Pause' : button.icon;
                    const ActualIconComponent = getIconComponent(actualIcon);
                    
                    // console.log('🎯 Rendering button:', button.key, 'isPlaying:', isPlaying, 'icon:', actualIcon);
                    
                    return (
                      <Tooltip key={button.key}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleButtonClick(button.key)}
                            className="flex items-center gap-1"
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
                const IconComponent = getIconComponent(button.icon);
                return (
                  <Tooltip key={button.key}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleButtonClick(button.key)}
                        className="flex items-center gap-1"
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
          </div>

          {/* Right side - Playback speed control and advanced animation settings */}
          <div className="flex items-center gap-4">
            {/* Advanced Animation Controls */}
            {(setInterpolationType || setEnablePathFollowing || setShowTraces || onTraceCurveChange) && (
              <div className="flex items-center gap-3">
                {/* Interpolation Type */}
                {setInterpolationType && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Interpolering:</span>
                    <div className="flex gap-1">
                      {[
                        { value: 'linear' as InterpolationType, label: 'Lin', tooltip: 'Linear - konstant hastighet' },
                        { value: 'smooth' as InterpolationType, label: 'Sm', tooltip: 'Smooth - jevn start/stopp' },
                        { value: 'easeIn' as InterpolationType, label: 'In', tooltip: 'Ease In - langsom start' },
                        { value: 'easeOut' as InterpolationType, label: 'Out', tooltip: 'Ease Out - langsom stopp' }
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
                        <span className="text-xs text-gray-600">
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
                        <span className="text-xs text-gray-600">Traces</span>
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
                    <span className="text-xs text-gray-600 whitespace-nowrap">Trace-kurve:</span>
                    <Slider
                      value={[traceCurveOffset]}
                      onValueChange={([value]) => onTraceCurveChange?.(value)}
                      min={traceCurveRange.min}
                      max={traceCurveRange.max}
                      step={traceCurveRange.step || 1}
                      className="w-24"
                    />
                    <span className="text-[10px] tabular-nums w-10 text-gray-600">{traceCurveOffset}px</span>
                  </div>
                )}
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
                  <span className="text-[10px] tabular-nums w-8">{playbackSpeed}x</span>
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
