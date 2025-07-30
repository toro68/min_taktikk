import { useEffect } from 'react';

interface UseRefSyncProps {
  progress: number;
  currentFrame: number;
  isPlaying: boolean;
  isRecording: boolean;
  progressRef: React.MutableRefObject<number>;
  currentFrameRef: React.MutableRefObject<number>;
  isPlayingRef: React.MutableRefObject<boolean>;
  recordingRef: React.MutableRefObject<boolean>;
}

export const useRefSync = (props: UseRefSyncProps) => {
  useEffect(() => {
    props.progressRef.current = props.progress;
  }, [props.progress, props.progressRef]);

  useEffect(() => {
    props.currentFrameRef.current = props.currentFrame;
  }, [props.currentFrame, props.currentFrameRef]);

  useEffect(() => {
    props.isPlayingRef.current = props.isPlaying;
  }, [props.isPlaying, props.isPlayingRef]);

  useEffect(() => {
    props.recordingRef.current = props.isRecording;
  }, [props.isRecording, props.recordingRef]);
};