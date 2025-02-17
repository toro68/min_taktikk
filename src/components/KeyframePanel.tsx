import React from 'react';
import { Button } from './ui/button';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";
import { Slider } from './ui/slider';
import { cn } from '../lib/utils';

interface Frame {
  elements: any[];
  duration: number;
}

interface KeyframePanelProps {
  frames: Frame[];
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
  handleFrameDurationChange,
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap items-center gap-1 max-w-full overflow-x-auto">
          {frames.map((frame, index) => (
            <Button
              key={index}
              variant={currentFrame === index ? "default" : "ghost"}
              onClick={() => setCurrentFrame(index)}
              className={cn(
                "h-7 px-2 text-xs shrink-0",
                currentFrame === index ? "bg-primary/5 border-primary" : ""
              )}
            >
              {index + 1}
              <span className="ml-1 text-[10px] text-gray-500">
                ({frame.elements.length})
              </span>
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 px-2">
          <div className="flex items-center gap-2 min-w-[200px]">
            <span className="text-sm whitespace-nowrap">Varighet:</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1 min-w-[100px]">
                  <Slider
                    value={[frames[currentFrame]?.duration ?? 1]}
                    onValueChange={([value]) => handleFrameDurationChange(currentFrame, value)}
                    min={0.5}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                <div className="flex flex-col">
                  <p className="text-[10px] font-medium">Juster varighet: {frames[currentFrame]?.duration ?? 1}s</p>
                  <p className="text-[9px] text-gray-300">0.5 til 5 sekunder</p>
                </div>
              </TooltipContent>
            </Tooltip>
            <span className="text-xs tabular-nums w-8">{frames[currentFrame]?.duration ?? 1}s</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default KeyframePanel; 