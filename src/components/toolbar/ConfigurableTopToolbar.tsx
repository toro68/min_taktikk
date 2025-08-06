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
}) => {
  const config = getConfig();
  const topToolbar = config.settings.toolbar.top;

  if (!topToolbar) {
    return null;
  }

  const handleButtonClick = (buttonKey: string) => {
    console.log('🎯 DEBUG [ConfigurableTopToolbar]: Button clicked:', buttonKey);
    
    switch (buttonKey) {
      case 'playPause':
        console.log('🎯 Play/Pause button clicked, current isPlaying:', isPlaying);
        onPlayPause();
        break;
      case 'rewind':
        console.log('🎯 Rewind button clicked');
        onRewind();
        break;
      case 'addKeyframe':
        onAddKeyframe();
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

          {/* Right side - Playback speed control */}
          <div className="flex items-center gap-2">
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
