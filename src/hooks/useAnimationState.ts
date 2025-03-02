import { useState, useCallback, useEffect } from 'react';
import { Frame, Element } from '../@types/elements';
import { saveAnimation, loadAnimation } from '../lib/storage-utils';

interface AnimationState {
  frames: Frame[];
  currentFrameIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
}

interface UseAnimationStateReturn {
  frames: Frame[];
  currentFrame: Frame;
  currentFrameIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  setFrames: (frames: Frame[]) => void;
  addFrame: (frame: Frame) => void;
  updateFrame: (index: number, frame: Frame) => void;
  deleteFrame: (index: number) => void;
  duplicateFrame: (index: number) => void;
  setCurrentFrameIndex: (index: number) => void;
  nextFrame: () => void;
  prevFrame: () => void;
  togglePlayback: () => void;
  setPlaybackSpeed: (speed: number) => void;
  updateElementInCurrentFrame: (elementId: string, updates: Partial<Element>) => void;
  addElementToCurrentFrame: (element: Element) => void;
  removeElementFromCurrentFrame: (elementId: string) => void;
  saveAnimationToStorage: (name?: string) => void;
  loadAnimationFromStorage: (name?: string) => boolean;
}

const DEFAULT_FRAME: Frame = {
  elements: [],
  duration: 1000
};

export const useAnimationState = (initialFrames: Frame[] = [{ ...DEFAULT_FRAME }]): UseAnimationStateReturn => {
  const [state, setState] = useState<AnimationState>({
    frames: initialFrames,
    currentFrameIndex: 0,
    isPlaying: false,
    playbackSpeed: 1
  });
  
  // Hent gjeldende ramme
  const currentFrame = state.frames[state.currentFrameIndex] || DEFAULT_FRAME;
  
  // Sett alle rammer
  const setFrames = useCallback((frames: Frame[]) => {
    setState(prev => ({
      ...prev,
      frames,
      currentFrameIndex: Math.min(prev.currentFrameIndex, frames.length - 1)
    }));
  }, []);
  
  // Legg til en ny ramme
  const addFrame = useCallback((frame: Frame) => {
    setState(prev => ({
      ...prev,
      frames: [...prev.frames, frame]
    }));
  }, []);
  
  // Oppdater en ramme
  const updateFrame = useCallback((index: number, frame: Frame) => {
    setState(prev => {
      const newFrames = [...prev.frames];
      newFrames[index] = frame;
      return {
        ...prev,
        frames: newFrames
      };
    });
  }, []);
  
  // Slett en ramme
  const deleteFrame = useCallback((index: number) => {
    setState(prev => {
      if (prev.frames.length <= 1) {
        return {
          ...prev,
          frames: [{ ...DEFAULT_FRAME }],
          currentFrameIndex: 0
        };
      }
      
      const newFrames = prev.frames.filter((_, i) => i !== index);
      const newIndex = index >= newFrames.length ? newFrames.length - 1 : index;
      
      return {
        ...prev,
        frames: newFrames,
        currentFrameIndex: newIndex
      };
    });
  }, []);
  
  // Dupliser en ramme
  const duplicateFrame = useCallback((index: number) => {
    setState(prev => {
      const frameToDuplicate = prev.frames[index];
      if (!frameToDuplicate) return prev;
      
      // Lag en dyp kopi av rammen
      const duplicatedFrame: Frame = {
        elements: frameToDuplicate.elements.map(el => ({ ...el })),
        duration: frameToDuplicate.duration
      };
      
      const newFrames = [...prev.frames];
      newFrames.splice(index + 1, 0, duplicatedFrame);
      
      return {
        ...prev,
        frames: newFrames,
        currentFrameIndex: index + 1
      };
    });
  }, []);
  
  // Sett gjeldende rammeindeks
  const setCurrentFrameIndex = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentFrameIndex: Math.max(0, Math.min(index, prev.frames.length - 1))
    }));
  }, []);
  
  // Gå til neste ramme
  const nextFrame = useCallback(() => {
    setState(prev => {
      const nextIndex = (prev.currentFrameIndex + 1) % prev.frames.length;
      return {
        ...prev,
        currentFrameIndex: nextIndex
      };
    });
  }, []);
  
  // Gå til forrige ramme
  const prevFrame = useCallback(() => {
    setState(prev => {
      const prevIndex = (prev.currentFrameIndex - 1 + prev.frames.length) % prev.frames.length;
      return {
        ...prev,
        currentFrameIndex: prevIndex
      };
    });
  }, []);
  
  // Slå av/på avspilling
  const togglePlayback = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  }, []);
  
  // Sett avspillingshastighet
  const setPlaybackSpeed = useCallback((speed: number) => {
    setState(prev => ({
      ...prev,
      playbackSpeed: speed
    }));
  }, []);
  
  // Oppdater et element i gjeldende ramme
  const updateElementInCurrentFrame = useCallback((elementId: string, updates: Partial<Element>) => {
    setState(prev => {
      const currentFrame = prev.frames[prev.currentFrameIndex];
      if (!currentFrame) return prev;
      
      const updatedElements = currentFrame.elements.map(el => {
        if (el.id === elementId) {
          // Sikre at type-egenskapen ikke endres
          const updatedElement = { ...el, ...updates };
          // Behold den originale typen
          updatedElement.type = el.type;
          return updatedElement as Element;
        }
        return el;
      });
      
      const updatedFrames = [...prev.frames];
      updatedFrames[prev.currentFrameIndex] = {
        ...currentFrame,
        elements: updatedElements
      };
      
      return {
        ...prev,
        frames: updatedFrames
      };
    });
  }, []);
  
  // Legg til et element i gjeldende ramme
  const addElementToCurrentFrame = useCallback((element: Element) => {
    setState(prev => {
      const currentFrame = prev.frames[prev.currentFrameIndex];
      if (!currentFrame) return prev;
      
      const updatedElements = [...currentFrame.elements, element];
      
      const updatedFrames = [...prev.frames];
      updatedFrames[prev.currentFrameIndex] = {
        ...currentFrame,
        elements: updatedElements
      };
      
      return {
        ...prev,
        frames: updatedFrames
      };
    });
  }, []);
  
  // Fjern et element fra gjeldende ramme
  const removeElementFromCurrentFrame = useCallback((elementId: string) => {
    setState(prev => {
      const currentFrame = prev.frames[prev.currentFrameIndex];
      if (!currentFrame) return prev;
      
      const updatedElements = currentFrame.elements.filter(el => el.id !== elementId);
      
      const updatedFrames = [...prev.frames];
      updatedFrames[prev.currentFrameIndex] = {
        ...currentFrame,
        elements: updatedElements
      };
      
      return {
        ...prev,
        frames: updatedFrames
      };
    });
  }, []);
  
  // Lagre animasjon til localStorage
  const saveAnimationToStorage = useCallback((name?: string) => {
    saveAnimation(state.frames, name);
  }, [state.frames]);
  
  // Last animasjon fra localStorage
  const loadAnimationFromStorage = useCallback((name?: string): boolean => {
    const loadedFrames = loadAnimation(name);
    if (loadedFrames) {
      setFrames(loadedFrames);
      return true;
    }
    return false;
  }, [setFrames]);
  
  // Automatisk avspilling
  useEffect(() => {
    if (!state.isPlaying) return;
    
    const currentFrameDuration = currentFrame.duration / state.playbackSpeed;
    const timer = setTimeout(() => {
      nextFrame();
    }, currentFrameDuration);
    
    return () => clearTimeout(timer);
  }, [state.isPlaying, state.currentFrameIndex, state.frames, state.playbackSpeed, nextFrame, currentFrame.duration]);
  
  return {
    frames: state.frames,
    currentFrame,
    currentFrameIndex: state.currentFrameIndex,
    isPlaying: state.isPlaying,
    playbackSpeed: state.playbackSpeed,
    setFrames,
    addFrame,
    updateFrame,
    deleteFrame,
    duplicateFrame,
    setCurrentFrameIndex,
    nextFrame,
    prevFrame,
    togglePlayback,
    setPlaybackSpeed,
    updateElementInCurrentFrame,
    addElementToCurrentFrame,
    removeElementFromCurrentFrame,
    saveAnimationToStorage,
    loadAnimationFromStorage
  };
}; 