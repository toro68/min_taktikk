import React from 'react';
import { Frame } from '../../@types/elements';

interface TimelineProps {
  frames: Frame[];
  currentFrame: number;
  progress: number;
  isPlaying: boolean;
  onSeek: (frame: number, frameProgress: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  frames,
  currentFrame,
  progress,
  onSeek
}) => {
  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const timelineWidth = rect.width;
    
    // Calculate total duration
    const totalDuration = frames.reduce((sum, frame) => sum + (frame.duration || 1), 0);
    
    // Calculate which frame and progress within that frame
    let accumulatedDuration = 0;
    const clickRatio = clickX / timelineWidth;
    const targetTime = clickRatio * totalDuration;
    
    for (let i = 0; i < frames.length; i++) {
      const frameDuration = frames[i].duration || 1;
      const frameStart = accumulatedDuration;
      const frameEnd = accumulatedDuration + frameDuration;
      
      if (targetTime >= frameStart && targetTime <= frameEnd) {
        const frameProgress = (targetTime - frameStart) / frameDuration;
        onSeek(i, Math.min(Math.max(frameProgress, 0), 1));
        return;
      }
      
      accumulatedDuration += frameDuration;
    }
  };

  const renderTimelineBlocks = () => {
    const totalDuration = frames.reduce((sum, frame) => sum + (frame.duration || 1), 0);
    let accumulatedDuration = 0;
    
    return frames.map((frame, index) => {
      const frameDuration = frame.duration || 1;
      const widthPercentage = (frameDuration / totalDuration) * 100;
      const isCurrentFrame = index === currentFrame;
      
      const blockElement = (
        <div
          key={index}
          className={`h-8 border-r border-gray-300 flex items-center justify-center text-xs relative ${
            isCurrentFrame ? 'bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          style={{ width: `${widthPercentage}%` }}
        >
          <span className="font-medium">{index + 1}</span>
          <span className="absolute bottom-0 text-[10px] text-gray-500">
            {frameDuration}s
          </span>
          
          {/* Progress indicator within current frame */}
          {isCurrentFrame && (
            <div
              className="absolute top-0 left-0 h-full bg-blue-400 opacity-50"
              style={{ width: `${progress * 100}%` }}
            />
          )}
        </div>
      );
      
      accumulatedDuration += frameDuration;
      return blockElement;
    });
  };

  return (
    <div className="border-b bg-white">
      <div className="p-2">
        <div className="text-xs text-gray-600 mb-1">Timeline</div>
        <div
          className="flex border border-gray-300 rounded cursor-pointer overflow-hidden"
          onClick={handleTimelineClick}
        >
          {renderTimelineBlocks()}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Click to seek • Total: {frames.reduce((sum, frame) => sum + (frame.duration || 1), 0)}s
        </div>
      </div>
    </div>
  );
};

export default Timeline;