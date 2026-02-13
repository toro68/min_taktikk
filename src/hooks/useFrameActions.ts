import { useCallback } from 'react';
import { Frame, FootballElement } from '../@types/elements';
import { debugLog } from '../lib/debug';

export const useFrameActions = (
  frames: Frame[],
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>,
  currentFrame: number,
  setCurrentFrame: React.Dispatch<React.SetStateAction<number>>,
  isPlaying: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  progress: number,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  
  const handleDuplicateFrame = useCallback(() => {
    const currentFrameData = frames[currentFrame];
    if (currentFrameData) {
      const duplicatedFrame: Frame = {
        elements: currentFrameData.elements.map(el => ({ ...el })),
        duration: currentFrameData.duration
      };
      
      const newFrames = [...frames];
      newFrames.splice(currentFrame + 1, 0, duplicatedFrame);
      setFrames(newFrames);
      setCurrentFrame(currentFrame + 1);
    }
  }, [frames, currentFrame, setFrames, setCurrentFrame]);

  const handleDeleteFrame = useCallback(() => {
    if (frames.length > 1) {
      const newFrames = frames.filter((_, index) => index !== currentFrame);
      setFrames(newFrames);
      
      const newCurrentFrame = Math.min(currentFrame, newFrames.length - 1);
      setCurrentFrame(newCurrentFrame);
    }
  }, [frames, currentFrame, setFrames, setCurrentFrame]);

  const handleAddKeyframe = useCallback(() => {
    // Copy elements from current frame to new frame
    const currentFrameElements = frames[currentFrame]?.elements || [];
    const newFrame: Frame = {
      elements: currentFrameElements.map(el => ({ ...el })), // Deep copy elements
      duration: 1
    };
    
    debugLog('➕ Adding keyframe:', {
      fromFrame: currentFrame,
      newFrameIndex: frames.length,
      elementsCopied: currentFrameElements.length,
      positions: currentFrameElements.slice(0, 3).map(el => ({
        id: el.id,
        x: el.x,
        y: el.y
      }))
    });
    
    setFrames(prevFrames => [...prevFrames, newFrame]);
    const newFrameIndex = frames.length; // new frame is appended at the end
    setCurrentFrame(newFrameIndex);
    setProgress(0);
  }, [setFrames, frames, currentFrame, setCurrentFrame, setProgress]);

  const handlePlayPause = useCallback(() => {
    debugLog('🎮 DEBUG [useFrameActions]: handlePlayPause called');
    debugLog('🎮 Current isPlaying state:', isPlaying);
    debugLog('🎮 Setting isPlaying to:', !isPlaying);
    debugLog('🎮 Current frame:', currentFrame);
    debugLog('🎮 Current progress:', progress);
    
    // Log all frames and their element positions when starting animation
    if (!isPlaying) {
      // Always restart from the first keyframe to ensure forward motion
      if (currentFrame !== 0 || progress !== 0) {
        setCurrentFrame(0);
        setProgress(0);
      }
      debugLog('🎬 ANIMATION START - Frame data:');
      frames.forEach((frame, idx) => {
        debugLog(`  Frame ${idx}:`, frame.elements.slice(0, 3).map(el => ({
          id: el.id?.slice(0, 8),
          type: el.type,
          x: el.x?.toFixed(1),
          y: el.y?.toFixed(1)
        })));
      });
    }
    
    setIsPlaying(prevPlaying => {
      debugLog('🎮 State transition:', prevPlaying, '→', !prevPlaying);
      return !prevPlaying;
    });
  }, [isPlaying, setIsPlaying, currentFrame, progress, setCurrentFrame, setProgress, frames]);

  const handleSeek = useCallback((frame: number, frameProgress: number) => {
    debugLog('handleSeek called, frame:', frame, 'progress:', frameProgress);
    setIsPlaying(false);
    setCurrentFrame(frame);
    setProgress(frameProgress);
  }, [setCurrentFrame, setProgress, setIsPlaying]);

  const updateFrameElements = useCallback((frameIndex: number, elements: FootballElement[]) => {
    setFrames(prevFrames => {
      const updatedFrames = [...prevFrames];
      if (updatedFrames[frameIndex]) {
        updatedFrames[frameIndex].elements = elements;
      }
      return updatedFrames;
    });
  }, [setFrames]);

  const getFrameElements = useCallback((frameIndex: number): FootballElement[] => {
    return frames[frameIndex]?.elements || [];
  }, [frames]);

  return {
    handleDuplicateFrame,
    handleDeleteFrame,
    handleAddKeyframe,
    handlePlayPause,
    handleSeek,
    updateFrameElements,
    getFrameElements
  };
};

export default useFrameActions;
