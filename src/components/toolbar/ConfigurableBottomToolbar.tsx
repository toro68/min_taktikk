import React from 'react';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { getConfig } from '../../lib/config';
import { getIconComponent } from '../../lib/iconMap';
import { Tool } from '../../@types/elements';

interface ConfigurableBottomToolbarProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  pitch: string;
  handleTogglePitch: () => void;
  onDeleteElement: () => void;
  selectedElement?: any | null;
}

const ConfigurableBottomToolbar: React.FC<ConfigurableBottomToolbarProps> = React.memo(({
  selectedTool,
  setSelectedTool,
  pitch,
  handleTogglePitch,
  onDeleteElement,
  selectedElement
}) => {
  const config = getConfig();
  const bottomToolbar = config.settings.toolbar.bottom;

  if (!bottomToolbar) {
    return null;
  }

  const handleButtonClick = (buttonKey: string) => {
    switch (buttonKey) {
      case 'select':
        setSelectedTool('select');
        break;
      case 'player':
        setSelectedTool('player');
        break;
      case 'opponent':
        setSelectedTool('opponent');
        break;
      case 'ball':
        setSelectedTool('ball');
        break;
      case 'cone':
        setSelectedTool('cone');
        break;
      case 'line':
        setSelectedTool('line');
        break;
      case 'text':
        setSelectedTool('text');
        break;
      case 'area':
        setSelectedTool('area');
        break;
      case 'togglePitch':
        handleTogglePitch();
        break;
      default:
        console.warn(`Unknown tool: ${buttonKey}`);
    }
  };

  const modeLabelByTool: Record<Tool, string> = {
    select: 'Velg',
    player: 'Plasser',
    opponent: 'Plasser',
    ball: 'Plasser',
    cone: 'Plasser',
    line: 'Tegn',
    text: 'Merk',
    area: 'Tegn'
  };

  // Style for active button
  const activeButtonStyle = "bg-blue-600 text-white font-semibold border-blue-700 ring-2 ring-blue-200";

  return (
    <div className="flex items-center justify-start gap-2 p-2 border-t bg-white sticky bottom-0 z-10 w-full">
      <TooltipProvider delayDuration={0}>
        <div className="hidden md:flex items-center">
          <span className="text-xs text-gray-500">Modus:</span>
          <span className="ml-1.5 text-xs font-medium text-gray-700">{modeLabelByTool[selectedTool]}</span>
        </div>

        {/* Main toolbar buttons */}
        <div className="flex items-center gap-2">
          {bottomToolbar.buttons?.map((button) => {
            const IconComponent = getIconComponent(button.icon);
            const isActive = button.key === selectedTool || 
                           (button.key === 'togglePitch' && pitch !== 'full');
            
            return (
              <Tooltip key={button.key}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={button.label || button.tooltip || button.key}
                    onClick={() => handleButtonClick(button.key)}
                    className={`flex items-center gap-1 ${isActive ? activeButtonStyle : ""}`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {button.label && (
                      <span className="hidden sm:inline">{button.label}</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                  <p className="text-[10px] font-medium">{button.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Delete button for selected element */}
        {selectedElement && (
          <>
            <div className="h-8 border-l mx-2"></div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onDeleteElement} 
                  className="flex gap-1 items-center"
                >
                  <Trash2 className="w-4 h-4" />
                  Slett
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                <div className="flex flex-col">
                  <p className="text-[10px] font-medium">Slett element</p>
                  <p className="text-[9px] text-gray-300">Fjern valgt element</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </TooltipProvider>
    </div>
  );
});

export default ConfigurableBottomToolbar;
