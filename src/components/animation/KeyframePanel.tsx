import React from 'react';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { Slider } from '../ui/slider';
import { Download } from 'lucide-react';

interface Frame {
  elements: any[];
  duration: number;
}

interface KeyframePanelProps {
  frames: Frame[];
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  handleDuplicateFrame: () => void;
  handleDeleteFrame: () => void;
  handleDownloadKeyframePng: (frameIndex: number) => void;
  handleFrameDurationChange: (frameIndex: number, newDuration: number) => void;
  isPlaying: boolean;
  progress: number;
}

const KeyframePanel: React.FC<KeyframePanelProps> = ({
  frames,
  currentFrame,
  setCurrentFrame,
  handleDownloadKeyframePng,
  handleFrameDurationChange,
  isPlaying,
  progress
}) => {
  return (
    <TooltipProvider>
      <div className="bg-white border-b p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Keyframes</h3>
          <div className="text-xs text-gray-500">
            {frames.length} frame{frames.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {frames.map((frame, index) => {
            const isActive = index === currentFrame;
            const progressValue = isActive ? progress : (index < currentFrame ? 1 : 0);
            
            return (
              <div key={index} className="relative flex-shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setCurrentFrame(index)}
                      className={`relative w-16 h-12 border-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-25'
                      }`}
                    >
                      <div className="text-xs font-medium">{index + 1}</div>
                      <div className="text-xs text-gray-500">
                        ({frame.elements.length})
                      </div>
                      
                      {/* Progress indicator */}
                      {isActive && isPlaying && (
                        <div 
                          className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-b transition-all duration-100"
                          style={{ width: `${progressValue * 100}%` }}
                        />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={4}>
                    <div className="text-center">
                      <p className="text-xs font-medium">Keyframe {index + 1}</p>
                      <p className="text-xs text-gray-300">{frame.elements.length} elementer</p>
                      <p className="text-xs text-gray-300">{frame.duration}s varighet</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                {/* Download button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadKeyframePng(index);
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={2}>
                    <p className="text-xs">Last ned som PNG</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>
        
        {/* Duration control for current frame */}
        <div className="flex items-center gap-3">
          <span className="text-sm whitespace-nowrap">Varighet:</span>
          <div className="flex-1">
            <Slider
              value={[frames[currentFrame]?.duration ?? 1]}
              onValueChange={([value]) => handleFrameDurationChange(currentFrame, value)}
              min={0.5}
              max={5}
              step={0.5}
              className="w-full"
            />
          </div>
          <span className="text-sm text-gray-500 w-8">
            {frames[currentFrame]?.duration ?? 1}s
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default KeyframePanel;