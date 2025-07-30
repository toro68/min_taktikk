import { useCallback } from 'react';
import { Frame, FootballElement } from '../@types/elements';

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
      elements: [...currentFrameElements], // Copy existing elements
      duration: 1
    };
    setFrames(prevFrames => [...prevFrames, newFrame]);
  }, [setFrames, frames, currentFrame]);

  const handlePlayPause = useCallback(() => {
    console.log('🎮 DEBUG [useFrameActions]: handlePlayPause called');
    console.log('🎮 Current isPlaying state:', isPlaying);
    console.log('🎮 Setting isPlaying to:', !isPlaying);
    console.log('🎮 Current frame:', currentFrame);
    console.log('🎮 Current progress:', progress);
    
    setIsPlaying(prevPlaying => {
      console.log('🎮 State transition:', prevPlaying, '→', !prevPlaying);
      return !prevPlaying;
    });
  }, [isPlaying, setIsPlaying, currentFrame, progress]);

  const handleSeek = useCallback((frame: number, frameProgress: number) => {
    console.log('handleSeek called, frame:', frame, 'progress:', frameProgress);
    setCurrentFrame(frame);
    setProgress(frameProgress);
  }, [setCurrentFrame, setProgress]);

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