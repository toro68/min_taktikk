import { useState, useRef, useCallback, useEffect } from 'react';
import { FootballElement, Frame } from '../@types/elements';

export const useAnimationLogic = () => {
  const [frames, setFrames] = useState<Frame[]>([{ elements: [], duration: 3 }]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [interpolatedElements, setInterpolatedElements] = useState<FootballElement[]>([]);
  
  // Trace state - viktig for spilleranimering
  const [showTraces, setShowTraces] = useState(true); // Enable traces by default
  const [traceCurveOffset, setTraceCurveOffset] = useState(0);

  // Refs for animation
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const framesRef = useRef<Frame[]>([{ elements: [], duration: 3 }]);
  const playbackSpeedRef = useRef<number>(1);

  // Keep refs in sync with state
  framesRef.current = frames;
  playbackSpeedRef.current = playbackSpeed;
  currentFrameRef.current = currentFrame;
  progressRef.current = progress;
  isPlayingRef.current = isPlaying;

  const getCubicBezierPoint = useCallback((
    t: number,
    start: { x: number; y: number },
    end: { x: number; y: number },
    offset: number
  ): { x: number; y: number } => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    if (len === 0) return { x: start.x, y: start.y };
    
    const perpX = -dy / len;
    const perpY = dx / len;
    
    const cp1x = start.x + dx * 0.33 + perpX * offset;
    const cp1y = start.y + dy * 0.33 + perpY * offset;
    const cp2x = start.x + dx * 0.66 + perpX * offset;
    const cp2y = start.y + dy * 0.66 + perpY * offset;
    
    const x = Math.pow(1-t, 3) * start.x + 3 * Math.pow(1-t, 2) * t * cp1x + 3 * (1-t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * end.x;
    const y = Math.pow(1-t, 3) * start.y + 3 * Math.pow(1-t, 2) * t * cp1y + 3 * (1-t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * end.y;
    
    return { x, y };
  }, []);

  const animateFrames = useCallback((currentTime: number) => {
    if (!isPlayingRef.current) return;
    
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    const currentFrameDuration = framesRef.current[currentFrameRef.current]?.duration || 1;
    let newProgress = progressRef.current + (deltaTime * playbackSpeedRef.current) / (currentFrameDuration * 1000);
    
    if (currentFrameRef.current === framesRef.current.length - 1) {
      if (newProgress >= 1) {
        newProgress = 1;
        progressRef.current = 1;
        setProgress(1);
        isPlayingRef.current = false;
        setIsPlaying(false);
      }
    } else if (newProgress >= 1) {
      newProgress = 0;
      const nextFrame = currentFrameRef.current + 1;
      
      if (nextFrame < framesRef.current.length) {
        currentFrameRef.current = nextFrame;
        setCurrentFrame(nextFrame);
      }
    }
    
    progressRef.current = newProgress;
    setProgress(newProgress);
    
    if (isPlayingRef.current) {
      animationRef.current = requestAnimationFrame(animateFrames);
    }
  }, []);

  // useEffect to start/stop animation when isPlaying changes
  useEffect(() => {
    console.log('🎬 DEBUG [useAnimationLogic]: isPlaying changed to:', isPlaying);
    
    if (isPlaying) {
      console.log('🎬 Starting animation...');
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animateFrames);
    } else {
      console.log('🎬 Stopping animation...');
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, animateFrames]);

  return {
    frames,
    setFrames,
    currentFrame,
    setCurrentFrame,
    progress,
    setProgress,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    interpolatedElements,
    setInterpolatedElements,
    animationRef,
    lastTimeRef,
    progressRef,
    currentFrameRef,
    isPlayingRef,
    getCubicBezierPoint,
    animateFrames,
    showTraces,
    setShowTraces,
    traceCurveOffset,
    setTraceCurveOffset,
  };
};

export default useAnimationLogic;