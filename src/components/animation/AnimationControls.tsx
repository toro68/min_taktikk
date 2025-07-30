import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Play, Pause, SkipBack } from 'lucide-react';

interface AnimationControlsProps {
  isPlaying: boolean;
  progress: number;
  currentFrame: number;
  totalFrames: number;
  playbackSpeed: number;
  onPlayPause: () => void;
  onRewind: () => void;
  onSpeedChange: (speed: number) => void;
  onProgressChange: (progress: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  progress,
  currentFrame,
  totalFrames,
  playbackSpeed,
  onPlayPause,
  onRewind,
  onSpeedChange,
  onProgressChange
}) => {
  return (
    <div className="p-4 border-b bg-gray-50">
      <div className="flex items-center gap-4">
        {/* Play/Pause and Rewind buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onRewind}
            variant="outline"
            size="sm"
            className="p-2"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            onClick={onPlayPause}
            variant="outline"
            size="sm"
            className="p-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="flex-1">
          <div className="text-xs text-gray-600 mb-1">
            Frame {currentFrame + 1} of {totalFrames} ({Math.round(progress * 100)}%)
          </div>
          <Slider
            value={[progress]}
            onValueChange={([value]) => onProgressChange(value)}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <span className="text-sm text-gray-600">Speed:</span>
          <Slider
            value={[playbackSpeed]}
            onValueChange={([value]) => onSpeedChange(value)}
            min={0.1}
            max={3}
            step={0.1}
            className="w-16"
          />
          <span className="text-xs text-gray-600 w-8">{playbackSpeed}x</span>
        </div>
      </div>
    </div>
  );
};

export default AnimationControls;