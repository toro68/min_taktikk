import React from 'react';
import { Button } from './ui/button';
import { Copy, Trash2, Plus, Save, Film } from 'lucide-react';
import { Slider } from './ui/slider';

interface KeyframePanelProps {
  frames: { id: number; elements: any[]; duration: number }[];
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  selectedElement: any;
  handleDuplicateFrame: () => void;
  handleDeleteFrame: () => void;
  handleDeleteElement: () => void;
  handleResetNumbers: () => void;
  handleClearElements: () => void;
  handleDownloadAnimation: () => void;
  handleDownloadFilm: () => void;
  handleAddKeyframe: () => void;
  handleFrameDurationChange: (frameIndex: number, duration: number) => void;
}

const KeyframePanel: React.FC<KeyframePanelProps> = ({
  frames,
  currentFrame,
  setCurrentFrame,
  selectedElement,
  handleDuplicateFrame,
  handleDeleteFrame,
  handleDeleteElement,
  handleResetNumbers,
  handleClearElements,
  handleDownloadAnimation,
  handleDownloadFilm,
  handleAddKeyframe,
  handleFrameDurationChange,
}) => {
  return (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Button onClick={handleDuplicateFrame} variant="outline">
            <Copy className="w-4 h-4 mr-1" />
            Dupliser Ramme
          </Button>
          <Button onClick={handleDeleteFrame} variant="outline" disabled={frames.length <= 1}>
            <Trash2 className="w-4 h-4 mr-1" />
            Slett Ramme
          </Button>
          {selectedElement && (
            <Button onClick={handleDeleteElement} variant="outline">
              <Trash2 className="w-4 h-4 mr-1" />
              Slett Element
            </Button>
          )}
          <Button onClick={handleResetNumbers} variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Nullstill Nummer
          </Button>
          <Button onClick={handleClearElements} variant="outline">
            <Trash2 className="w-4 h-4 mr-1" />
            Tøm Ramme
          </Button>
          <Button onClick={handleDownloadAnimation} variant="outline">
            <Save className="w-4 h-4 mr-1" />
            Last ned animasjon
          </Button>
          <Button onClick={handleDownloadFilm} variant="outline">
            <Film className="w-4 h-4 mr-1" />
            Last ned film
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <div className="flex gap-2 flex-wrap">
            {frames.map((frame, index) => (
              <div key={frame.id} className="flex flex-col items-center gap-1">
                <Button
                  variant={currentFrame === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentFrame(index)}
                >
                  {index + 1}
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Varighet:</span>
                  <Slider
                    value={[frame.duration]}
                    onValueChange={([val]) => handleFrameDurationChange(index, val)}
                    min={0.1}
                    max={5}
                    step={0.1}
                    className="w-24"
                  />
                  <span className="text-xs w-12">{frame.duration}s</span>
                </div>
              </div>
            ))}
            <Button onClick={handleAddKeyframe} variant="outline" size="sm">
              Legg til keyframe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyframePanel; 