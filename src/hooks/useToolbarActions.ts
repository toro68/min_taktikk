import { useCallback } from 'react';
import { Frame } from '../@types/elements';

interface ToolbarActionsParams {
  frames: Frame[];
  setFrames: (frames: Frame[]) => void;
  setCurrentNumber: (num: string) => void;
}

export const useToolbarActions = ({
  frames,
  setFrames,
  setCurrentNumber
}: ToolbarActionsParams) => {
  const handleClearElements = useCallback(() => {
    const newFrames = frames.map(frame => ({
      ...frame,
      elements: []
    }));
    setFrames(newFrames);
    setCurrentNumber("1");
  }, [frames, setFrames, setCurrentNumber]);

  return { handleClearElements };
};