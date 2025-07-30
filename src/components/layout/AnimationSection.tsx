import React, { useState } from 'react';
import Timeline from '../animation/Timeline';
import { Frame } from '../../@types/elements';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface AnimationSectionProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRewind: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  progress: number;
  currentFrame: number;
  frames: Frame[];
  onProgressChange: (progress: number) => void;
  onSeek: (frame: number, frameProgress: number) => void;
}

const AnimationSection: React.FC<AnimationSectionProps> = ({
  isPlaying,
  currentFrame,
  frames,
  progress,
  onSeek
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border-t">
      {/* Minimalt header - alle kontroller er nå i TopToolbar */}
      <div 
        className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Tidslinje</span>
          <span className="text-xs text-gray-500">
            Frame {currentFrame + 1}/{frames.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Kun Timeline når utvidet - alle andre kontroller er flyttet til TopToolbar */}
      {isExpanded && (
        <div className="px-4 py-3 border-t">
          <Timeline
            frames={frames}
            currentFrame={currentFrame}
            progress={progress}
            isPlaying={isPlaying}
            onSeek={onSeek}
          />
        </div>
      )}
    </div>
  );
};

export default AnimationSection;