import { useState, useRef, useCallback, useEffect } from 'react';
import { Frame } from '../@types/elements';

interface UseAnimationControlsReturn {
  isPlaying: boolean;
  playbackSpeed: number;
  progress: number;
  currentFrame: number;
  playPause: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setCurrentFrame: (frame: number) => void;
  resetAnimation: () => void;
  handleFrameDurationChange: (frameIndex: number, newDuration: number) => void;
  handleAddKeyframe: () => void;
  handleDuplicateFrame: () => void;
  handleDeleteFrame: () => void;
}

export const useAnimationControls = (
  frames: Frame[],
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>,
  onFrameChange?: (frameIndex: number) => void
): UseAnimationControlsReturn => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  
  const isPlayingRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  
  // Oppdater ref når isPlaying endres
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  
  // Oppdater ref når progress endres
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  
  // Stopp animasjon ved unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Animasjonsløkke via requestAnimationFrame
  const animateFrames = useCallback((currentTime: number) => {
    if (!isPlayingRef.current) return;
    
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = currentTime;
    }
    
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    // Beregn hvor mye vi skal øke progress
    const totalDuration = frames.reduce((sum, frame) => sum + frame.duration, 0);
    if (totalDuration <= 0) return;
    
    const progressIncrement = (deltaTime / 1000) * playbackSpeed / totalDuration;
    let newProgress = progressRef.current + progressIncrement;
    
    // Håndter slutten av animasjonen
    if (newProgress >= 1) {
      newProgress = 0;
    }
    
    // Finn gjeldende ramme basert på progress
    let cumulativeDuration = 0;
    let newFrameIndex = 0;
    
    for (let i = 0; i < frames.length; i++) {
      const frameDurationNormalized = frames[i].duration / totalDuration;
      if (newProgress >= cumulativeDuration && newProgress < cumulativeDuration + frameDurationNormalized) {
        newFrameIndex = i;
        break;
      }
      cumulativeDuration += frameDurationNormalized;
    }
    
    // Oppdater state
    setProgress(newProgress);
    if (newFrameIndex !== currentFrame) {
      setCurrentFrame(newFrameIndex);
      if (onFrameChange) {
        onFrameChange(newFrameIndex);
      }
    }
    
    // Fortsett animasjonsløkken
    animationFrameRef.current = requestAnimationFrame(animateFrames);
  }, [frames, playbackSpeed, currentFrame, onFrameChange]);
  
  // Start/stopp animasjon
  const playPause = useCallback(() => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    if (newIsPlaying) {
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(animateFrames);
    } else if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying, animateFrames]);
  
  // Tilbakestill animasjon
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentFrame(0);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (onFrameChange) {
      onFrameChange(0);
    }
  }, [onFrameChange]);
  
  // Endre varighet for en ramme
  const handleFrameDurationChange = useCallback((frameIndex: number, newDuration: number) => {
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      if (newFrames[frameIndex]) {
        newFrames[frameIndex] = {
          ...newFrames[frameIndex],
          duration: newDuration
        };
      }
      return newFrames;
    });
  }, [setFrames]);
  
  // Legg til en ny tom keyframe
  const handleAddKeyframe = useCallback(() => {
    setFrames(prevFrames => {
      // Kopier elementer fra forrige ramme hvis den finnes
      const elementsFromPrevious = prevFrames.length > 0 
        ? [...prevFrames[prevFrames.length - 1].elements] 
        : [];
      
      return [
        ...prevFrames,
        { elements: elementsFromPrevious, duration: 1 }
      ];
    });
    
    // Gå til den nye rammen
    setCurrentFrame(frames.length);
    if (onFrameChange) {
      onFrameChange(frames.length);
    }
  }, [frames.length, setFrames, onFrameChange]);
  
  // Dupliser gjeldende ramme
  const handleDuplicateFrame = useCallback(() => {
    if (frames.length === 0) return;
    
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      const currentFrameData = { ...newFrames[currentFrame] };
      
      // Lag en dyp kopi av elementene
      currentFrameData.elements = currentFrameData.elements.map(el => ({ ...el }));
      
      // Sett inn kopien etter gjeldende ramme
      newFrames.splice(currentFrame + 1, 0, currentFrameData);
      return newFrames;
    });
    
    // Gå til den nye rammen
    setCurrentFrame(currentFrame + 1);
    if (onFrameChange) {
      onFrameChange(currentFrame + 1);
    }
  }, [frames.length, currentFrame, setFrames, onFrameChange]);
  
  // Slett gjeldende ramme
  const handleDeleteFrame = useCallback(() => {
    if (frames.length <= 1) return; // Behold alltid minst én ramme
    
    setFrames(prevFrames => {
      const newFrames = [...prevFrames];
      newFrames.splice(currentFrame, 1);
      return newFrames;
    });
    
    // Juster gjeldende ramme hvis nødvendig
    const newCurrentFrame = Math.min(currentFrame, frames.length - 2);
    setCurrentFrame(newCurrentFrame);
    if (onFrameChange) {
      onFrameChange(newCurrentFrame);
    }
  }, [frames.length, currentFrame, setFrames, onFrameChange]);
  
  return {
    isPlaying,
    playbackSpeed,
    progress,
    currentFrame,
    playPause,
    setPlaybackSpeed,
    setCurrentFrame,
    resetAnimation,
    handleFrameDurationChange,
    handleAddKeyframe,
    handleDuplicateFrame,
    handleDeleteFrame
  };
}; 