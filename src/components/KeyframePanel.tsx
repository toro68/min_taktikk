import React from 'react';
import { Button } from './ui/button';
import { Copy, Trash2, Plus, Clock } from 'lucide-react';
import { Slider } from './ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from '../lib/utils';

interface KeyframePanelProps {
  frames: { id: number; elements: any[]; duration: number }[];
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  selectedElement: any;
  handleDuplicateFrame: () => void;
  handleDeleteFrame: () => void;
  handleDeleteElement: () => void;
  handleResetNumbers: () => void;
  handleClearElements: () => void;
  handleAddKeyframe: () => void;
  handleFrameDurationChange: (frameIndex: number, duration: number) => void;
}

const KeyframePanel: React.FC<KeyframePanelProps> = ({
  frames,
  currentFrame,
  setCurrentFrame,
  selectedElement,
  handleDuplicateFrame,
  handleDeleteFrame,
  handleDeleteElement,
  handleResetNumbers,
  handleClearElements,
  handleAddKeyframe,
  handleFrameDurationChange,
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col gap-1 p-1 bg-gray-50 rounded-lg text-[10px]">
        <div className="flex items-center justify-between gap-1 border-b pb-1">
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleDuplicateFrame} variant="ghost" className="h-5 w-5 p-0">
                  <Copy className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                <div className="flex flex-col">
                  <p className="text-[10px] font-medium">Dupliser ramme</p>
                  <p className="text-[9px] text-gray-300">Snarvei: D</p>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleDeleteFrame} 
                  variant="ghost"
                  className="h-5 w-5 p-0"
                  disabled={frames.length <= 1}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                <div className="flex flex-col">
                  <p className="text-[10px] font-medium">Slett keyframe</p>
                  <p className="text-[9px] text-gray-300">Snarvei: Delete</p>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleClearElements} variant="ghost" className="h-5 w-5 p-0">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                <div className="flex flex-col">
                  <p className="text-[10px] font-medium">Tøm keyframe</p>
                  <p className="text-[9px] text-gray-300">Fjern alle elementer</p>
                </div>
              </TooltipContent>
            </Tooltip>

            {selectedElement && (
              <>
                <div className="h-4 w-px bg-gray-200" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleDeleteElement} variant="ghost" className="h-5 w-5 p-0">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-medium">Slett element</p>
                      <p className="text-[9px] text-gray-300">Snarvei: Backspace</p>
                    </div>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleResetNumbers} variant="ghost" className="h-5 w-5 p-0">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-medium">Nullstill nummer</p>
                      <p className="text-[9px] text-gray-300">Start nummerering på nytt</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-1 items-start overflow-x-auto">
          {frames.map((frame, index) => (
            <div 
              key={frame.id} 
              className={cn(
                "flex flex-col items-center gap-0.5 p-1 rounded border transition-colors min-w-[40px]",
                currentFrame === index 
                  ? "bg-primary/5 border-primary" 
                  : "bg-white hover:bg-gray-50"
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentFrame === index ? "default" : "ghost"}
                    onClick={() => setCurrentFrame(index)}
                    className="w-6 h-6 p-0 text-[10px] font-medium"
                  >
                    {index + 1}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-medium">Keyframe {index + 1}</p>
                    <p className="text-[9px] text-gray-300">Klikk for å velge</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default KeyframePanel; 