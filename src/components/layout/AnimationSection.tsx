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
  onFrameDurationChange?: (frame: number, duration: number) => void;
}

const AnimationSection: React.FC<AnimationSectionProps> = ({
  isPlaying,
  currentFrame,
  frames,
  progress,
  onSeek,
  onFrameDurationChange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const progressPct = Math.round(Math.max(0, Math.min(1, progress)) * 100);

  return (
    <div className="bg-white border-t">
      {/* Minimalt header - alle kontroller er nå i TopToolbar */}
      <button
        type="button"
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label="Vis eller skjul tidslinje"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Tidslinje</span>
          <span className="text-xs text-gray-500">
            Frame {currentFrame + 1}/{frames.length}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${isPlaying ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {isPlaying ? 'Spiller' : 'Pause'}
          </span>
          <span className="text-[10px] text-gray-500 tabular-nums">{progressPct}%</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Kun Timeline når utvidet - alle andre kontroller er flyttet til TopToolbar */}
      {isExpanded && (
        <div className="px-4 py-3 border-t">
          <Timeline
            frames={frames}
            currentFrame={currentFrame}
            progress={progress}
            isPlaying={isPlaying}
            onSeek={onSeek}
            onFrameDurationChange={onFrameDurationChange}
          />
        </div>
      )}
    </div>
  );
};

export default AnimationSection;