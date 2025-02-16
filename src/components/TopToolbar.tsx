import React from 'react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Copy, Trash2, Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TopToolbarProps {
  playbackSpeed: number;
  setPlaybackSpeed: (value: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddKeyframe: () => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({
  playbackSpeed,
  setPlaybackSpeed,
  onDuplicate,
  onDelete,
  onAddKeyframe,
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center gap-2 h-8 px-1">
          <div className="flex items-center gap-1">
            <Button onClick={onDuplicate} variant="outline" size="sm" className="flex gap-1 items-center">
              <Copy className="w-4 h-4 mr-1" />
              Kopier
            </Button>
            <Button onClick={onDelete} variant="outline" size="sm" className="flex gap-1 items-center">
              <Trash2 className="w-4 h-4 mr-1" />
              Slett
            </Button>
            <Button onClick={onAddKeyframe} variant="outline" size="sm" className="flex gap-1 items-center">
              <Plus className="w-4 h-4 mr-1" />
              Tom keyframe
            </Button>
          </div>
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
                <span className="text-[10px] tabular-nums w-4">{playbackSpeed}x</span>
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
    </TooltipProvider>
  );
};

export default TopToolbar; 