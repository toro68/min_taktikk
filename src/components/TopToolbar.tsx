import React from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Play, Pause, SkipBack } from 'lucide-react';

// Gjenta de nødvendige typene (eventuelt kan de flyttes til en felles types-fil)
export type PitchType = 'full' | 'offensive' | 'defensive';
export type Tool = 'select' | 'player' | 'opponent' | 'ball' | 'cone' | 'line';

interface TopToolbarProps {
  pitch: PitchType;
  setPitch: (value: PitchType) => void;
  tool: Tool;
  setTool: (value: Tool) => void;
  isPlaying: boolean;
  handlePlayPause: () => void;
  onReset: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (value: number) => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({
  pitch,
  setPitch,
  tool,
  setTool,
  isPlaying,
  handlePlayPause,
  onReset,
  playbackSpeed,
  setPlaybackSpeed
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold">Banevisning:</span>
            <Select value={pitch} onValueChange={(value) => setPitch(value as PitchType)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Velg bane" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Bane</SelectItem>
                <SelectItem value="offensive">Offensiv Halv</SelectItem>
                <SelectItem value="defensive">Defensiv Halv</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handlePlayPause} variant="outline" className="w-24">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Spill'}
          </Button>
          <Button onClick={onReset} variant="outline">
            <SkipBack className="w-4 h-4" />
            Nullstill
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Hastighet:</span>
            <Slider
              value={[playbackSpeed]}
              onValueChange={([value]) => setPlaybackSpeed(value)}
              min={0.5}
              max={3}
              step={0.5}
              className="w-32"
            />
            <span className="text-sm">{playbackSpeed}x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopToolbar; 