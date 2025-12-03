import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Play, Pause, SkipBack } from 'lucide-react';
import { InterpolationType } from '../../lib/interpolation';

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
  // New advanced features
  interpolationType?: InterpolationType;
  setInterpolationType?: (type: InterpolationType) => void;
  enablePathFollowing?: boolean;
  setEnablePathFollowing?: (enabled: boolean) => void;
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
  onProgressChange,
  interpolationType = 'smooth',
  setInterpolationType,
  enablePathFollowing = false,
  setEnablePathFollowing
}) => {
  const interpolationOptions: { value: InterpolationType; label: string; description: string }[] = [
    { value: 'linear', label: 'Linear', description: 'Konstant hastighet' },
    { value: 'smooth', label: 'Smooth', description: 'Jevn start/stopp' },
    { value: 'easeIn', label: 'Ease In', description: 'Langsom start' },
    { value: 'easeOut', label: 'Ease Out', description: 'Langsom stopp' }
  ];
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

      {/* Advanced Animation Controls */}
      {(setInterpolationType || setEnablePathFollowing) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            {/* Interpolation Type */}
            {setInterpolationType && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Interpolering:</span>
                <div className="flex gap-1">
                  {interpolationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setInterpolationType(option.value)}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        interpolationType === option.value
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                      title={option.description}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Path Following */}
            {setEnablePathFollowing && (
              <div className="flex items-center gap-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enablePathFollowing}
                    onChange={(e) => setEnablePathFollowing(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    Bane-følging
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimationControls;