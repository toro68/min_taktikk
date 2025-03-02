import { useState, useCallback, useEffect } from 'react';
import { Frame } from '../@types/elements';
import { 
  saveAnimation, 
  loadAnimation, 
  getStoredAnimationNames, 
  deleteAnimation 
} from '../lib/storage-utils';

interface UseStorageManagerReturn {
  savedAnimations: string[];
  currentAnimationName: string;
  setCurrentAnimationName: (name: string) => void;
  saveCurrentAnimation: (frames: Frame[]) => void;
  loadSavedAnimation: (name?: string) => Frame[] | null;
  deleteSavedAnimation: (name: string) => void;
  refreshSavedAnimations: () => void;
}

export const useStorageManager = (initialName: string = 'default'): UseStorageManagerReturn => {
  const [savedAnimations, setSavedAnimations] = useState<string[]>([]);
  const [currentAnimationName, setCurrentAnimationName] = useState<string>(initialName);

  // Hent liste over lagrede animasjoner
  const refreshSavedAnimations = useCallback(() => {
    const names = getStoredAnimationNames();
    setSavedAnimations(names);
  }, []);

  // Last inn listen over lagrede animasjoner ved oppstart
  useEffect(() => {
    refreshSavedAnimations();
  }, [refreshSavedAnimations]);

  // Lagre gjeldende animasjon
  const saveCurrentAnimation = useCallback((frames: Frame[]) => {
    saveAnimation(frames, currentAnimationName);
    refreshSavedAnimations();
  }, [currentAnimationName, refreshSavedAnimations]);

  // Last inn en lagret animasjon
  const loadSavedAnimation = useCallback((name?: string): Frame[] | null => {
    const animationName = name || currentAnimationName;
    const frames = loadAnimation(animationName);
    
    if (frames && name) {
      setCurrentAnimationName(name);
    }
    
    return frames;
  }, [currentAnimationName]);

  // Slett en lagret animasjon
  const deleteSavedAnimation = useCallback((name: string) => {
    deleteAnimation(name);
    refreshSavedAnimations();
    
    // Hvis vi sletter gjeldende animasjon, bytt til 'default'
    if (name === currentAnimationName) {
      setCurrentAnimationName('default');
    }
  }, [currentAnimationName, refreshSavedAnimations]);

  return {
    savedAnimations,
    currentAnimationName,
    setCurrentAnimationName,
    saveCurrentAnimation,
    loadSavedAnimation,
    deleteSavedAnimation,
    refreshSavedAnimations
  };
}; 