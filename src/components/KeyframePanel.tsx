import React from 'react';
import { Button } from './ui/button';
import { Copy, Trash2, Plus, Save, Film } from 'lucide-react';

interface KeyframePanelProps {
  frames: { id: number; elements: any[] }[]; // Ideelt sett bør du bruke typen Frame
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  selectedElement: any; // Bruk gjerne din Element-type her
  handleDuplicateFrame: () => void;
  handleDeleteFrame: () => void;
  handleDeleteElement: () => void;
  handleResetNumbers: () => void;
  handleClearElements: () => void;
  handleDownloadAnimation: () => void;
  handleDownloadFilm: () => void;
  handleAddKeyframe: () => void;
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
        <div className="flex gap-2 mb-2">
          {frames.map((frame, index) => (
            <Button
              key={frame.id}
              variant={currentFrame === index ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentFrame(index)}
            >
              {index + 1}
            </Button>
          ))}
          <Button onClick={handleAddKeyframe} variant="outline" size="sm">
            Legg til keyframe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeyframePanel; 