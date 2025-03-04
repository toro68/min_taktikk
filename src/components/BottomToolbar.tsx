import React from 'react';
import { Button } from './ui/button';
import { 
  MousePointer, User, Users, Volleyball, Cone, PenTool, Type, SquareSplitHorizontal,
  Trash2, Play, Pause, SkipBack, Film, Download, Upload, BookOpen
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Tool } from '../@types/elements';

interface BottomToolbarProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  pitch: string;
  handleTogglePitch: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onRewind: () => void;
  onDeleteElement: () => void;
  onDownloadFilm: () => void;
  onDownloadPng: () => void;
  onDownloadAnimation: () => void;
  onLoadAnimation: () => void;
  onLoadExampleAnimation: () => void;
  selectedElement?: any | null;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({
  selectedTool,
  setSelectedTool,
  pitch,
  handleTogglePitch,
  isPlaying,
  onPlayPause,
  onRewind,
  onDeleteElement,
  onDownloadFilm,
  onDownloadPng,
  onDownloadAnimation,
  onLoadAnimation,
  onLoadExampleAnimation,
  selectedElement
}) => {
  // Stil for aktiv knapp - endret for å gjøre den mer synlig
  const activeButtonStyle = "bg-blue-600 text-white font-bold border-2 border-blue-700 shadow-md shadow-blue-300";
  
  return (
    <div className="flex items-center justify-center gap-2 p-2 border-t bg-white sticky bottom-0 z-10 w-full">
      <TooltipProvider delayDuration={0}>
        {/* Verktøyknapper */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedTool('select')} 
              className={`flex items-center gap-1 ${selectedTool === 'select' ? activeButtonStyle : ""}`}
            >
              <MousePointer className="w-4 h-4" />
              Velg
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Velg og flytt elementer</p>
              <p className="text-[9px] text-gray-300">Snarvei: V</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedTool('player')} 
              className={`flex items-center gap-1 ${selectedTool === 'player' ? activeButtonStyle : ""}`}
            >
              <User className="w-4 h-4" />
              Spiller
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Legg til spiller</p>
              <p className="text-[9px] text-gray-300">Snarvei: P</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedTool('opponent')} 
              className={`flex items-center gap-1 ${selectedTool === 'opponent' ? activeButtonStyle : ""}`}
            >
              <Users className="w-4 h-4" />
              Motspiller
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Legg til motstander</p>
              <p className="text-[9px] text-gray-300">Snarvei: O</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedTool('ball')} 
              className={`flex items-center gap-1 ${selectedTool === 'ball' ? activeButtonStyle : ""}`}
            >
              <Volleyball className="w-4 h-4" />
              Ball
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Legg til ball</p>
              <p className="text-[9px] text-gray-300">Snarvei: B</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleTogglePitch} 
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ${pitch !== 'full' ? activeButtonStyle : ""}`}
            >
              <SquareSplitHorizontal className="w-4 h-4" />
              {pitch === 'handball' ? 'Håndball' : 
               pitch === 'blankPortrait' ? 'Blank portrett' : 
               pitch === 'blankLandscape' ? 'Blank liggende' : 'Fotball'}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Bytt banetype</p>
              <p className="text-[9px] text-gray-300">Fotball (hel/halv) eller håndball</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedTool('cone')} 
              className={`flex items-center gap-1 ${selectedTool === 'cone' ? activeButtonStyle : ""}`}
            >
              <Cone className="w-4 h-4" />
              Kjegle
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Legg til kjegle</p>
              <p className="text-[9px] text-gray-300">Snarvei: C</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedTool('line')} 
              className={`flex items-center gap-1 ${selectedTool === 'line' ? activeButtonStyle : ""}`}
            >
              <PenTool className="w-4 h-4" />
              Linje
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Tegn linje eller pil</p>
              <p className="text-[9px] text-gray-300">Snarvei: L</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedTool('text')} 
              className={`flex items-center gap-1 ${selectedTool === 'text' ? activeButtonStyle : ""}`}
            >
              <Type className="w-4 h-4" />
              Tekst
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Legg til tekst</p>
              <p className="text-[9px] text-gray-300">Snarvei: X</p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Skillelinje */}
        <div className="h-8 border-l mx-1"></div>

        {/* Knapper for avspilling og sletting */}
        {selectedElement && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onDeleteElement} className="flex gap-1 items-center">
                <Trash2 className="w-4 h-4" />
                Slett
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
              <div className="flex flex-col">
                <p className="text-[10px] font-medium">Slett element</p>
                <p className="text-[9px] text-gray-300">Fjern valgt element</p>
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onPlayPause} className="flex gap-1 items-center">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Start/Pause</p>
              <p className="text-[9px] text-gray-300">Snarvei: Mellomrom</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onRewind} className="flex gap-1 items-center">
              <SkipBack className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Spol tilbake</p>
              <p className="text-[9px] text-gray-300">Snarvei: R</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onDownloadFilm} className="flex gap-1 items-center">
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Film</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Last ned som film</p>
              <p className="text-[9px] text-gray-300">Snarvei: F</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onDownloadPng} className="flex gap-1 items-center">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PNG</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Last ned som PNG</p>
              <p className="text-[9px] text-gray-300">Lagre banen som bildefil</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDownloadAnimation} 
              className="flex gap-1 items-center bg-blue-50 hover:bg-blue-100"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Lagre JSON</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Lagre JSON</p>
              <p className="text-[9px] text-gray-300">Last ned som JSON-fil</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLoadAnimation} 
              className="flex gap-1 items-center bg-blue-50 hover:bg-blue-100"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Last inn JSON</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Last inn JSON</p>
              <p className="text-[9px] text-gray-300">Importer JSON-fil</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLoadExampleAnimation} 
              className="flex gap-1 items-center bg-green-50 hover:bg-green-100"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Eksempel</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
            <div className="flex flex-col">
              <p className="text-[10px] font-medium">Last inn eksempel</p>
              <p className="text-[9px] text-gray-300">Prøv pasningsmonster-animasjonen</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default BottomToolbar; 