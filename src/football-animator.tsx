import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from './components/ui/slider';
import { Play, Pause, SkipBack, Save, Copy, Trash2, Plus, Film, MousePointer, User, Users, Volleyball, Circle, Cone, PenTool, SquareSplitHorizontal, ChevronUp, ChevronDown, Type } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import { Canvg } from 'canvg';
import KeyframePanel from './components/KeyframePanel';
import LineStyleSelector, { LineStyle } from './components/LineStyleSelector';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { useExportImport } from './hooks/useExportImport';
import BottomToolbar from './components/BottomToolbar';
import ToolSelector from './components/ToolSelector';
import { Tool, PitchType, Element as FootballElement, PlayerElement, OpponentElement, BallElement, ConeElement, LineElement, TextElement, Frame, PLAYER_RADIUS, BALL_RADIUS } from './@types/elements';
import TopToolbar from './components/TopToolbar';

interface BaseElement {
  id: string;
  x?: number;
  y?: number;
  visible?: boolean;
}

const FootballAnimator = () => {
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);

  // Hjelpefunksjon som kloner SVG-en og inliner alle beregnede stiler.
  const inlineAllStyles = (svg: SVGSVGElement): SVGSVGElement => {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const elements = clone.querySelectorAll("*");
    for (const el of Array.from(elements)) {
      const computedStyle = window.getComputedStyle(el);
      let styleDeclaration = "";
      for (let i = 0; i < computedStyle.length; i++) {
        const property = computedStyle[i];
        const value = computedStyle.getPropertyValue(property);
        styleDeclaration += `${property}:${value};`;
      }
      el.setAttribute("style", styleDeclaration);
    }
    return clone;
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [frames, setFrames] = useState<Frame[]>([{ elements: [], duration: 1 }]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [interpolatedElements, setInterpolatedElements] = useState<FootballElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedElement, setSelectedElement] = useState<FootballElement | null>(null);
  const [pitch, setPitch] = useState<PitchType>('offensive');
  const [tool, setTool] = useState<Tool>('select');
  const [selectedLineStyle, setSelectedLineStyle] = useState<LineStyle>('solidCurved');
  const [curveOffset, setCurveOffset] = useState<number>(0);
  const [traceCurveOffset, setTraceCurveOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lineStart, setLineStart] = useState<{x: number, y: number} | null>(null);
  const animationRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentNumber, setCurrentNumber] = useState<string>("1");
  const [elements, setElements] = useState<FootballElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{x: number; y: number} | null>(null);
  const recordedSVGRef = useRef<SVGSVGElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(isRecording);
  const progressRef = useRef(progress);
  const currentFrameRef = useRef(currentFrame);
  const isPlayingRef = useRef(isPlaying);
  const lastTimeRef = useRef<number>(performance.now());
  const [previewLine, setPreviewLine] = useState<LineElement | null>(null);
  const [selectedLineCurveOffset, setSelectedLineCurveOffset] = useState<number>(0);
  const [selectedLinePoints, setSelectedLinePoints] = useState<{ start: { x: number, y: number }, end: { x: number, y: number } } | null>(null);
  const [lineColor, setLineColor] = useState<string>('black');
  const [customColor, setCustomColor] = useState<string>('#ff0000');

  const handleTogglePitch = () => {
    if (pitch === 'full') {
      setPitch('fullLandscape');
    } else if (pitch === 'fullLandscape') {
      setPitch('offensive');
    } else if (pitch === 'offensive') {
      setPitch('defensive');
    } else if (pitch === 'defensive') {
      setPitch('handball');
    } else {
      setPitch('full');
    }
  };

  const SquareDashedBottomIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" strokeDasharray="4 2" />
    </svg>
  );

  const lineStyleOptions: { value: LineStyle, label: string, preview: React.ReactElement }[] = [
    {
      value: 'solidCurved',
      label: 'Solid',
      preview: (
        <svg viewBox="0 0 80 20" className="w-16 h-5">
          <path d="M 5,10 C 25,2 55,2 75,10" fill="none" stroke="black" strokeWidth="2" />
        </svg>
      )
    },
    {
      value: 'dashedCurved',
      label: 'Stiplet',
      preview: (
        <svg viewBox="0 0 80 20" className="w-16 h-5">
          <path d="M 5,10 C 25,2 55,2 75,10" fill="none" stroke="black" strokeWidth="2" strokeDasharray="4,4" />
        </svg>
      )
    },
    {
      value: 'curvedArrow',
      label: 'Pil',
      preview: (
        <svg viewBox="0 0 80 20" className="w-16 h-5">
          <defs>
            <marker id="previewArrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="black"/>
            </marker>
          </defs>
          <path d="M 5,10 C 25,2 55,2 75,10" fill="none" stroke="black" strokeWidth="2" markerEnd="url(#previewArrow)"/>
        </svg>
      )
    },
    {
      value: 'dashedCurvedArrow',
      label: 'Stiplet pil',
      preview: (
        <svg viewBox="0 0 80 20" className="w-16 h-5">
          <defs>
            <marker id="previewArrow2" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="black"/>
            </marker>
          </defs>
          <path d="M 5,10 C 25,2 55,2 75,10" fill="none" stroke="black" strokeWidth="2" strokeDasharray="4,4" markerEnd="url(#previewArrow2)"/>
        </svg>
      )
    },
    {
      value: 'endMark',
      label: 'Endestrek',
      preview: (
        <svg viewBox="0 0 80 20" className="w-16 h-5">
          <defs>
            <marker id="previewEndline" markerWidth="4" markerHeight="8" refX="0" refY="4" orient="auto">
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <line x1="5" y1="10" x2="75" y2="10" stroke="black" strokeWidth="2" markerEnd="url(#previewEndline)"/>
        </svg>
      )
    },
    {
      value: 'plusEnd',
      label: 'Pluss',
      preview: (
        <svg viewBox="0 0 80 20" className="w-16 h-5">
          <defs>
            <marker id="previewPlus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <line x1="5" y1="10" x2="75" y2="10" stroke="black" strokeWidth="2" markerEnd="url(#previewPlus)"/>
        </svg>
      )
    },
    {
      value: 'xEnd',
      label: 'Kryss',
      preview: (
        <svg viewBox="0 0 80 20" className="w-16 h-5">
          <defs>
            <marker id="previewXmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <line x1="5" y1="10" x2="75" y2="10" stroke="black" strokeWidth="2" markerEnd="url(#previewXmark)"/>
        </svg>
      )
    }
  ];

  const getPitchTemplate = () => {
    switch(pitch) {
      case 'handball':
        return (
          <g>
            {/* Ytre bane */}
            <rect x="0" y="0" width="680" height="340" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Midtlinje */}
            <line x1="340" y1="0" x2="340" y2="340" stroke="black" strokeWidth="2"/>
            
            {/* Venstre målfelt (straffeområde) - 6m bue fra dødlinje */}
            <path d="M 0,51 A 102,102 1 0 1 0,289" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Høyre målfelt (straffeområde) - 6m bue fra dødlinje */}
            <path d="M 680,51 A 102,102 1 0 0 680,289" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Venstre 9-meter (stiplet) - parallell med 6-meteren */}
            <path d="M 0,0 A 153,153 1 0 1 0,340" fill="none" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
            
            {/* Høyre 9-meter (stiplet) - parallell med 6-meteren */}
            <path d="M 680,0 A 153,153 1 0 0 680,340" fill="none" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
            
            {/* Venstre mål */}
            <rect x="-15" y="120" width="15" height="100" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Høyre mål */}
            <rect x="680" y="120" width="15" height="100" fill="none" stroke="black" strokeWidth="2"/>
          </g>
        );
      case 'full':
        return (
          <g>
            <rect x="0" y="0" width="680" height="1050" fill="none" stroke="black" strokeWidth="2"/>
            <rect x="139.84" y="0" width="400.32" height="165" fill="none" stroke="black" strokeWidth="2"/>
            <rect x="230.84" y="0" width="218.32" height="55" fill="none" stroke="black" strokeWidth="2"/>
            <circle cx="340" cy="110" r="2" fill="black"/>
            <rect x="139.84" y="885" width="400.32" height="165" fill="none" stroke="black" strokeWidth="2"/>
            <rect x="230.84" y="995" width="218.32" height="55" fill="none" stroke="black" strokeWidth="2"/>
            <circle cx="340" cy="940" r="2" fill="black"/>
            <line x1="0" y1="525" x2="680" y2="525" stroke="black" strokeWidth="2"/>
            <circle cx="340" cy="525" r="91.5" fill="none" stroke="black" strokeWidth="2"/>
            <circle cx="340" cy="525" r="2" fill="black"/>
          </g>
        );
      case 'fullLandscape':
        return (
          <g>
            {/* Ytre bane */}
            <rect x="0" y="0" width="1050" height="680" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Midtlinje */}
            <line x1="525" y1="0" x2="525" y2="680" stroke="black" strokeWidth="2"/>
            <circle cx="525" cy="340" r="91.5" fill="none" stroke="black" strokeWidth="2"/>
            <circle cx="525" cy="340" r="2" fill="black"/>
            
            {/* Venstre 16-meter */}
            <rect x="0" y="139.84" width="165" height="400.32" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Høyre 16-meter */}
            <rect x="885" y="139.84" width="165" height="400.32" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Venstre målområde (5-meter) */}
            <rect x="0" y="240.84" width="55" height="198.32" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Høyre målområde (5-meter) */}
            <rect x="995" y="240.84" width="55" height="198.32" fill="none" stroke="black" strokeWidth="2"/>

            {/* Venstre mål */}
            <rect x="-15" y="290" width="15" height="100" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Høyre mål */}
            <rect x="1050" y="290" width="15" height="100" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Venstre straffepunkt */}
            <circle cx="110" cy="340" r="2" fill="black"/>
            
            {/* Høyre straffepunkt */}
            <circle cx="940" cy="340" r="2" fill="black"/>
          </g>
        );
      case 'offensive':
        return (
          <g>
            <rect x="0" y="0" width="680" height="525" fill="none" stroke="black" strokeWidth="2"/>
            <rect x="139.84" y="0" width="400.32" height="165" fill="none" stroke="black" strokeWidth="2"/>
            <rect x="230.84" y="0" width="218.32" height="55" fill="none" stroke="black" strokeWidth="2"/>
            <circle cx="340" cy="110" r="2" fill="black"/>
            <line x1="0" y1="525" x2="680" y2="525" stroke="black" strokeWidth="2"/>
            <path d="M 248.5 525 A 91.5 91.5 0 0 1 431.5 525" fill="none" stroke="black" strokeWidth="2"/>
          </g>
        );
      case 'defensive':
        return (
          <g>
            <rect x="0" y="0" width="680" height="525" fill="none" stroke="black" strokeWidth="2"/>
            <rect x="139.84" y="360" width="400.32" height="165" fill="none" stroke="black" strokeWidth="2"/>
            <rect x="230.84" y="470" width="218.32" height="55" fill="none" stroke="black" strokeWidth="2"/>
            <circle cx="340" cy="415" r="2" fill="black"/>
            <line x1="0" y1="0" x2="680" y2="0" stroke="black" strokeWidth="2"/>
            <path d="M 248.5 0 A 91.5 91.5 0 0 0 431.5 0" fill="none" stroke="black" strokeWidth="2"/>
          </g>
        );
    }
  };

  const handleElementClick = (event: React.MouseEvent, element: FootballElement) => {
    if (tool === 'select') {
      event.stopPropagation();
      handleElementSelect(element);
    }
  };

  const handleElementDragStart = (event: React.MouseEvent, element: FootballElement) => {
    if (tool !== 'select') return;
    event.stopPropagation();
    handleElementSelect(element);
    setIsDragging(true);
    const coords = getSVGCoordinates(event as React.MouseEvent<SVGSVGElement>);
    setStartPoint(coords);
  };

  const renderElement = (element: FootballElement) => {
    const isSelected = selectedElement?.id === element.id;
    const highlightStyle = isSelected ? { 
      filter: 'drop-shadow(0 0 3px #3b82f6)',
      outline: '2px solid #3b82f6',
      outlineOffset: '2px'
    } : {};
    
    const transform = element.type === 'line' ? '' : `translate(${element.x ?? 0}, ${element.y ?? 0})`;
    
    const elementProps = {
      style: {
        ...highlightStyle,
        touchAction: 'none',
        cursor: tool === 'select' ? 'move' : 'pointer',
      },
      onClick: (e: React.MouseEvent) => handleElementClick(e, element),
      onMouseDown: (e: React.MouseEvent) => {
        if (tool === 'select') handleElementDragStart(e, element);
      },
      onTouchStart: (e: React.TouchEvent) => {
        if (tool === 'select') {
          e.preventDefault();
          const touch = e.touches[0];
          const event = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            preventDefault: () => {},
            stopPropagation: () => {}
          } as React.MouseEvent;
          handleElementDragStart(event, element);
        }
      },
      transform
    };

    switch(element.type) {
      case 'player':
        return (
          <g key={element.id} {...elementProps} onDoubleClick={(e) => handlePlayerNumberDoubleClick(e, element as PlayerElement)}>
            <circle cx="0" cy="0" r="20" fill="transparent" stroke="transparent" strokeWidth="10"/>
            <circle cx="0" cy="0" r="15" fill="white" stroke="black" strokeWidth="2"/>
            <text x="0" y="5" textAnchor="middle" fontFamily="Arial" fontSize="16" fontWeight="bold">
              {element.number}
            </text>
          </g>
        );
      case 'opponent':
        return (
          <g key={element.id} {...elementProps} onDoubleClick={(e) => handlePlayerNumberDoubleClick(e, element as OpponentElement)}>
            <circle cx="0" cy="0" r="20" fill="transparent" stroke="transparent" strokeWidth="10"/>
            <circle cx="0" cy="0" r="15" fill="black" stroke="black" strokeWidth="2"/>
            <text x="0" y="5" textAnchor="middle" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="white">
              {element.number}
            </text>
          </g>
        );
      case 'ball':
        return (
          <g key={element.id} {...elementProps}>
            <circle cx="0" cy="0" r="20" fill="transparent" stroke="transparent" strokeWidth="10"/>
            <g transform="translate(-12, -12)">
              <Volleyball className="w-6 h-6" />
            </g>
          </g>
        );
      case 'cone':
        return (
          <g key={element.id} {...elementProps}>
            <rect x="-15" y="-15" width="30" height="30" fill="transparent" stroke="transparent"/>
            <path d="M -5,8 L 5,8 L 2,-8 L -2,-8 Z" fill="orange" stroke="black" strokeWidth="1"/>
          </g>
        );
      case 'line':
        const { style, ...otherProps } = elementProps;
        return (
          <g key={element.id}>
            <path
              d={element.path}
              stroke="transparent"
              strokeWidth="20"
              fill="none"
              {...otherProps}
              style={{
                ...style,
                pointerEvents: 'all'
              }}
            />
            <path
              d={element.path}
              fill="none"
              stroke={element.color || "black"}
              strokeWidth="2"
              strokeDasharray={element.dashed ? "5,5" : "none"}
              markerEnd={element.marker ? `url(#${element.marker})` : "none"}
              style={{
                pointerEvents: 'none'
              }}
            />
          </g>
        );
      case 'text':
        return (
          <g 
            key={element.id} 
            {...elementProps}
            onDoubleClick={(e) => handleTextDoubleClick(e, element)}
          >
            <rect 
              x="-50" 
              y="-20" 
              width="100" 
              height="40" 
              fill="transparent" 
              stroke="transparent"
            />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={element.fontSize}
              fill="black"
              style={{ userSelect: 'none', cursor: 'pointer' }}
            >
              {element.content}
            </text>
          </g>
        );
    }
  };

  const getSVGCoordinates = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = recordedSVGRef.current;
    if (!svg) {
      console.warn('SVG ref is not available');
      return { x: 0, y: 0 };
    }

    const rect = svg.getBoundingClientRect();
    const viewBoxWidth = pitch === 'fullLandscape' ? 1050 : 680;
    const viewBoxHeight = pitch === 'handball' ? 340 : 
                         pitch === 'full' ? 1050 : 
                         pitch === 'fullLandscape' ? 680 : 
                         525;
    
    const scaleX = viewBoxWidth / rect.width;
    const scaleY = viewBoxHeight / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return { x, y };
  };

  // Hjelpefunksjon for å lage bane for linjen (curved/straight)
  const createLinePath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
    curved: boolean,
    offset = 0
  ): string => {
    if (curved) {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      let perpX = 0,
        perpY = 0;
      if (len !== 0) {
        perpX = -dy / len;
        perpY = dx / len;
      }
      const cp1x = start.x + dx / 3 + offset * perpX;
      const cp1y = start.y + dy / 3 + offset * perpY;
      const cp2x = start.x + 2 * dx / 3 + offset * perpX;
      const cp2y = start.y + 2 * dy / 3 + offset * perpY;
      return `M ${start.x} ${start.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${end.x} ${end.y}`;
    } else {
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }
  };

  // Hjelpefunksjon for å beregne et punkt langs en kubisk Bézier-kurve
  const getCubicBezierPoint = (
    t: number,
    start: { x: number; y: number },
    end: { x: number; y: number },
    offset: number
  ): { x: number; y: number } => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    let perpX = 0, perpY = 0;
    if (len !== 0) {
      perpX = -dy / len;
      perpY = dx / len;
    }
    const cp1x = start.x + dx / 3 + offset * perpX;
    const cp1y = start.y + dy / 3 + offset * perpY;
    const cp2x = start.x + 2 * dx / 3 + offset * perpX;
    const cp2y = start.y + 2 * dy / 3 + offset * perpY;

    const x = Math.pow(1 - t, 3) * start.x +
              3 * Math.pow(1 - t, 2) * t * cp1x +
              3 * (1 - t) * Math.pow(t, 2) * cp2x +
              Math.pow(t, 3) * end.x;
    const y = Math.pow(1 - t, 3) * start.y +
              3 * Math.pow(1 - t, 2) * t * cp1y +
              3 * (1 - t) * Math.pow(t, 2) * cp2y +
              Math.pow(t, 3) * end.y;
    return { x, y };
  };

  // Ny hjelpefunksjon for å oversette (flytte) en path-streng med dx og dy
  const translatePath = (d: string, dx: number, dy: number): string => {
    let index = 0;
    return d.replace(/-?\d+(\.\d+)?/g, match => {
      const num = parseFloat(match);
      const newValue = (index % 2 === 0) ? num + dx : num + dy;
      index++;
      return newValue.toString();
    });
  };

  const isPointNearPath = (point: { x: number; y: number }, path: string): boolean => {
    const threshold = 10; // Piksel-avstand for å registrere klikk
    
    // Sjekk om det er en kurvet linje (C) eller rett linje (L)
    const curvedMatch = path.match(/M ([0-9.-]+),([0-9.-]+) C ([0-9.-]+),([0-9.-]+) ([0-9.-]+),([0-9.-]+) ([0-9.-]+),([0-9.-]+)/);
    const straightMatch = path.match(/M ([0-9.-]+),([0-9.-]+) L ([0-9.-]+),([0-9.-]+)/);
    
    if (curvedMatch) {
      // For kurvede linjer, sjekk avstand til flere punkter langs kurven
      const [, startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY] = curvedMatch;
      const start = { x: Number(startX), y: Number(startY) };
      const end = { x: Number(endX), y: Number(endY) };
      
      // Sjekk flere punkter langs kurven
      for (let t = 0; t <= 1; t += 0.1) {
        const pos = getCubicBezierPoint(
          t,
          start,
          end,
          0 // Vi bruker 0 som offset siden vi bare vil sjekke selve linjen
        );
        
        const dx = point.x - pos.x;
        const dy = point.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < threshold) {
          return true;
        }
      }
    } else if (straightMatch) {
      const [, startX, startY, endX, endY] = straightMatch;
      const start = { x: Number(startX), y: Number(startY) };
      const end = { x: Number(endX), y: Number(endY) };
      
      // Beregn distanse fra punkt til linje-segment
      const a = point.x - start.x;
      const b = point.y - start.y;
      const c = end.x - start.x;
      const d = end.y - start.y;
      
      const dot = a * c + b * d;
      const len_sq = c * c + d * d;
      
      let param = -1;
      if (len_sq !== 0) {
        param = dot / len_sq;
      }
      
      let xx, yy;
      
      if (param < 0) {
        xx = start.x;
        yy = start.y;
      } else if (param > 1) {
        xx = end.x;
        yy = end.y;
      } else {
        xx = start.x + param * c;
        yy = start.y + param * d;
      }
      
      const dx = point.x - xx;
      const dy = point.y - yy;
      
      return Math.sqrt(dx * dx + dy * dy) < threshold;
    }
    return false;
  };

  // Hjelpefunksjon for å hente linjeegenskaper basert på valgt linjestil
  const getLineProperties = (style: LineStyle, color: string = 'black') => {
    const lowerStyle = style.toLowerCase();
    const curved = lowerStyle.includes("curved");
    const dashed = lowerStyle.includes("dashed");
    let marker: 'arrow' | 'endline' | 'plus' | 'xmark' | null = null;
    
    if (lowerStyle.includes("arrow")) {
      marker = 'arrow';
    } else if (lowerStyle === 'endmark') {
      marker = 'endline';
    } else if (lowerStyle === 'plusend') {
      marker = 'plus';
    } else if (lowerStyle === 'xend') {
      marker = 'xmark';
    }
    
    return { curved, dashed, marker, strokeColor: color };
  };

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    const coords = getSVGCoordinates(event);
    
    if (tool === 'line') {
      setLineStart(coords);
      setIsDragging(true);
      setIsDrawing(true);
      setStartPoint(coords);
    } else if (tool === 'select') {
      const clickedElement = frames[currentFrame].elements.find(el => {
        if (el.type === 'line') {
          // Sjekk om klikket er nær linjen
          return isPointNearPath(coords, el.path);
        }
        return false;
      });

      if (clickedElement) {
        handleElementSelect(clickedElement);
        setIsDragging(true);
        setStartPoint(coords);
      } else {
        setSelectedElement(null);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    const coords = 'touches' in event 
      ? getSVGCoordinates({ 
          clientX: event.touches[0].clientX, 
          clientY: event.touches[0].clientY 
        } as React.MouseEvent<SVGSVGElement>) 
      : getSVGCoordinates(event as React.MouseEvent<SVGSVGElement>);

    if (tool === 'select' && isDragging && selectedElement && startPoint) {
      const dx = coords.x - startPoint.x;
      const dy = coords.y - startPoint.y;

      const newFrames = [...frames];
      newFrames[currentFrame].elements = newFrames[currentFrame].elements.map(el => {
        if (el.id === selectedElement.id) {
          if (el.type === 'line') {
            return { ...el, path: translatePath(el.path, dx, dy) };
          } else {
            return { ...el, x: (el.x ?? 0) + dx, y: (el.y ?? 0) + dy };
          }
        }
        return el;
      });
      setFrames(newFrames);
      setStartPoint(coords);
    }

    if (tool === 'line' && isDragging && lineStart) {
      const { curved, dashed, marker, strokeColor } = getLineProperties(selectedLineStyle, lineColor === 'custom' ? customColor : lineColor);
      const path = createLinePath(lineStart, coords, curved, curveOffset);
      
      setPreviewLine({
        id: 'preview-line',
        type: 'line',
        path,
        dashed,
        marker,
        color: strokeColor
      });
    }
  };

  const handleMouseUp = (event: React.MouseEvent<SVGSVGElement>) => {
    const coords = getSVGCoordinates(event);
    if (tool === 'line' && isDragging && lineStart) {
      const { curved, dashed, marker, strokeColor } = getLineProperties(selectedLineStyle, lineColor === 'custom' ? customColor : lineColor);
      const finalizedPath = createLinePath(lineStart, coords, curved, curveOffset);
      
      // Beregn avstand mellom start- og sluttpunkt
      const dx = coords.x - lineStart.x;
      const dy = coords.y - lineStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Bare legg til linjen hvis den er lang nok
      if (distance > 5) {
        const newFrames = [...frames];
        newFrames[currentFrame].elements.push({
          id: 'line-' + Date.now(),
          type: 'line',
          path: finalizedPath,
          dashed,
          marker,
          color: strokeColor
        });
        
        setFrames(newFrames);
      }
      
      setIsDragging(false);
      setLineStart(null);
      setIsDrawing(false);
      setStartPoint(null);
      setPreviewLine(null);
    } else if (tool === 'select' && isDragging && selectedElement) {
      updateFrameElement(currentFrame, selectedElement.id, { x: coords.x, y: coords.y });
      setIsDragging(false);
      setStartPoint(null);
    }
  };

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    // Sjekk at den nåværende framen finnes
    if (!frames[currentFrame]) {
      console.warn("Ingen gyldig frame for handling.");
      return;
    }

    const coords = getSVGCoordinates(event);

    if (tool !== 'select' && tool !== 'line') {
      const baseElement = {
        id: `${tool}-${Date.now()}`,
        x: coords.x,
        y: coords.y,
      };

      let newElement: FootballElement;
      
      switch (tool) {
        case 'player':
        case 'opponent':
          newElement = {
            ...baseElement,
            type: tool,
            number: currentNumber
          };
          setCurrentNumber(prev => {
            const nextNum = parseInt(prev) + 1;
            return nextNum.toString();
          });
          break;
        case 'ball':
          newElement = {
            ...baseElement,
            type: 'ball'
          };
          break;
        case 'cone':
          newElement = {
            ...baseElement,
            type: 'cone'
          };
          break;
        case 'text':
          const content = prompt('Skriv inn tekst:');
          if (!content) return;
          newElement = {
            ...baseElement,
            type: 'text',
            content,
            fontSize: 16
          };
          break;
        default:
          return;
      }

      const newFrames = [...frames];
      newFrames[currentFrame].elements.push(newElement);
      setFrames(newFrames);
      setElements([...elements, newElement]);
    }
  };

  const handleDeleteElement = () => {
    if (selectedElement) {
      const newFrames = [...frames];
      newFrames[currentFrame].elements = frames[currentFrame].elements
        .filter(el => el.id !== selectedElement.id);
      setFrames(newFrames);
      setSelectedElement(null);
    }
  };

  const handleDuplicateFrame = () => {
    setFrames(prevFrames => {
      const newFrame: Frame = {
        elements: JSON.parse(JSON.stringify(prevFrames[currentFrame].elements)),
        duration: prevFrames[currentFrame].duration
      };
      return [
        ...prevFrames.slice(0, currentFrame + 1),
        newFrame,
        ...prevFrames.slice(currentFrame + 1)
      ];
    });
    setCurrentFrame(currentFrame + 1);
  };

  const handleDeleteFrame = () => {
    if (frames.length > 1) {
      setFrames(prevFrames => {
        // Fjern den aktuelle framen
        const newFrames = prevFrames.filter((_, index) => index !== currentFrame);
        return newFrames;
      });
      
      // Oppdater currentFrame for å unngå å peke på en ikke-eksisterende frame
      const newCurrentFrame = Math.min(currentFrame, frames.length - 2);
      setCurrentFrame(newCurrentFrame);
      
      // Logg informasjon om sletting for feilsøking
      console.log(`Slettet keyframe ${currentFrame + 1}. Ny aktiv keyframe: ${newCurrentFrame + 1}. Totalt antall keyframes: ${frames.length - 1}`);
    } else {
      // Ikke tillat sletting av siste gjenværende keyframe
      console.warn("Kan ikke slette siste keyframe. Minst én keyframe må beholdes.");
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      // Start fra begynnelsen hvis vi er på slutten
      if (currentFrame === frames.length - 1 && progress >= 1) {
        setCurrentFrame(0);
        setProgress(0);
        currentFrameRef.current = 0;
        progressRef.current = 0;
      }
      setIsPlaying(true);
      isPlayingRef.current = true;
      lastTimeRef.current = performance.now();
    } else {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  };

  const handleResetNumbers = () => {
    setCurrentNumber("1");
  };

  const handleClearElements = () => {
    const newFrames = frames.map(frame => ({
      ...frame,
      elements: []
    }));
    setFrames(newFrames);
    setElements([]);
    setCurrentNumber("1");
  };

  // Ny funksjon for PNG-eksport
  const downloadPng = async (svg: SVGSVGElement, filename: string) => {
    try {
      // Klone og inline stiler for å sikre riktig rendering
      const clonedSvg = inlineAllStyles(svg);
      
      // Hent dimensjoner fra viewBox
      const viewBox = clonedSvg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 680, 525];
      const width = viewBox[2];
      const height = viewBox[3];
      
      // Skaleringsforhold for høyere oppløsning (4x original størrelse)
      const scale = 4;
      
      // Opprett canvas med høyere oppløsning
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d', { alpha: true });
      
      if (!ctx) {
        throw new Error('Kunne ikke opprette canvas-kontekst');
      }
      
      // Aktiver anti-aliasing for bedre kvalitet
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Skaler konteksten for å matche den høyere oppløsningen
      ctx.scale(scale, scale);
      
      // Konverter SVG til blob URL
      const svgString = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Last SVG som bilde og tegn på canvas
      const img = new Image();
      
      // Returner Promise som løses når bildet er lastet og konvertert til PNG
      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          // Tegn bildet på canvas med hvit bakgrunn
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          // Konverter canvas til dataURL (PNG) med høy kvalitet
          const pngUrl = canvas.toDataURL('image/png', 1.0);
          
          // Opprett nedlastingslink
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          
          // Rydd opp
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        };
        
        img.onerror = () => {
          reject(new Error('Feil ved lasting av SVG som bilde'));
        };
        
        img.src = url;
      });
    } catch (error) {
      console.error('Feil ved eksport til PNG:', error);
    }
  };

  // Funksjon for å laste ned banen som PNG
  const handleDownloadPng = () => {
    if (recordedSVGRef.current) {
      downloadPng(recordedSVGRef.current, 'taktikk.png');
    }
  };

  // Funksjon for å laste ned animasjonen som JSON
  const handleDownloadAnimation = () => {
    const dataStr = JSON.stringify(frames, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'animation.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  // Funksjon for å laste inn animasjon fra JSON-fil
  const handleLoadAnimation = () => {
    // Opprett et skjult filinput-element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Håndter filvalg
    fileInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            
            // Valider at dataene har riktig format
            if (Array.isArray(jsonData) && jsonData.length > 0) {
              // Sjekk at hver frame har elements-array
              const isValid = jsonData.every(frame => 
                frame && typeof frame === 'object' && Array.isArray(frame.elements)
              );
              
              if (isValid) {
                // Oppdater frames-state med de importerte dataene
                setFrames(jsonData);
                setCurrentFrame(0);
                setProgress(0);
                currentFrameRef.current = 0;
                progressRef.current = 0;
                
                // Oppdater elementer med første frame
                if (jsonData[0] && jsonData[0].elements) {
                  setElements(jsonData[0].elements);
                }
                
                console.log(`Animasjon lastet inn: ${jsonData.length} keyframes`);
              } else {
                console.error('Ugyldig JSON-format: Mangler elements-array i frames');
                alert('Ugyldig animasjonsformat. Filen mangler nødvendige data.');
              }
            } else {
              console.error('Ugyldig JSON-format: Ikke et array eller tomt array');
              alert('Ugyldig animasjonsformat. Filen inneholder ikke keyframes.');
            }
          } catch (error) {
            console.error('Feil ved parsing av JSON:', error);
            alert('Kunne ikke lese filen. Sjekk at det er en gyldig JSON-fil.');
          }
        };
        
        reader.onerror = () => {
          console.error('Feil ved lesing av fil');
          alert('Feil ved lesing av fil. Vennligst prøv igjen.');
        };
        
        reader.readAsText(file);
      }
      
      // Fjern filinput-elementet
      document.body.removeChild(fileInput);
    };
    
    // Utløs klikk på filinput
    fileInput.click();
  };

  const handleLoadExampleAnimation = () => {
    // Hent eksempelanimasjonen fra public/examples-mappen
    fetch('/min_taktikk/examples/pasningsmonster.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Kunne ikke laste eksempelanimasjonen');
        }
        return response.json();
      })
      .then(jsonData => {
        // Valider at dataene har riktig format
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          // Sjekk at hver frame har elements-array
          const isValid = jsonData.every(frame => 
            frame && typeof frame === 'object' && Array.isArray(frame.elements)
          );
          
          if (isValid) {
            // Oppdater frames-state med de importerte dataene
            setFrames(jsonData);
            setCurrentFrame(0);
            setProgress(0);
            currentFrameRef.current = 0;
            progressRef.current = 0;
            
            // Oppdater elementer med første frame
            if (jsonData[0] && jsonData[0].elements) {
              setElements(jsonData[0].elements);
            }
            
            console.log(`Eksempelanimasjon lastet inn: ${jsonData.length} keyframes`);
          } else {
            console.error('Ugyldig JSON-format: Mangler elements-array i frames');
            alert('Ugyldig animasjonsformat. Filen mangler nødvendige data.');
          }
        } else {
          console.error('Ugyldig JSON-format: Ikke et array eller tomt array');
          alert('Ugyldig animasjonsformat. Filen inneholder ikke keyframes.');
        }
      })
      .catch(error => {
        console.error('Feil ved lasting av eksempelanimasjon:', error);
        alert('Kunne ikke laste eksempelanimasjonen. Vennligst prøv igjen senere.');
      });
  };

  // Ny implementasjon av animasjonsløkken via requestAnimationFrame
  const animateFrames = (currentTime: number) => {
    if (!isPlayingRef.current) return;
    
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    const currentFrameDuration = frames[currentFrameRef.current].duration;
    let newProgress = progressRef.current + (deltaTime * playbackSpeed) / (currentFrameDuration * 1000);
    
    // Hvis vi er på siste frame
    if (currentFrameRef.current === frames.length - 1) {
      if (newProgress >= 1) {
        // Stopp animasjonen og behold siste frame
        newProgress = 1;
        progressRef.current = 1;
        setProgress(1);
        isPlayingRef.current = false;
        setIsPlaying(false);
      }
    } else if (newProgress >= 1) {
      // Sikre at vi går til neste gyldige frame
      newProgress = 0;
      const nextFrame = currentFrameRef.current + 1;
      
      // Sjekk at neste frame eksisterer (kan ha blitt slettet)
      if (nextFrame < frames.length) {
        currentFrameRef.current = nextFrame;
        setCurrentFrame(nextFrame);
      } else {
        // Hvis neste frame ikke finnes, gå til siste gyldige frame
        const lastValidFrame = frames.length - 1;
        currentFrameRef.current = lastValidFrame;
        setCurrentFrame(lastValidFrame);
      }
    }
    
    progressRef.current = newProgress;
    setProgress(newProgress);
    
    // Fortsett animasjonen hvis vi fortsatt spiller
    if (isPlayingRef.current) {
      animationRef.current = requestAnimationFrame(animateFrames);
    }
  };

  // Funksjon for å laste ned animasjonen som film (video .webm)
  const handleDownloadFilm = () => {
    if (recordingRef.current) {
      console.log("Opptak allerede i gang, ignorerer ny forespørsel.");
      return;
    }
    
    // Reset til start før opptak
    setCurrentFrame(0);
    setProgress(0);
    currentFrameRef.current = 0;
    progressRef.current = 0;
    
    recordingRef.current = true;
    setIsRecording(true);
    
    if (recordedSVGRef.current) {
      let stream;
      let canvasFallback: HTMLCanvasElement | null = null;
      let recording = true;
      let updateCanvasRafId = 0;
      
      // Logg informasjon om alle keyframes for feilsøking
      console.log(`Starter opptak med ${frames.length} keyframes:`);
      frames.forEach((frame, index) => {
        console.log(`Keyframe ${index + 1}: ${frame.elements.length} elementer, varighet: ${frame.duration}s`);
      });
      
      const svg = recordedSVGRef.current;
      const serializer = new XMLSerializer();
      
      // Beregn riktig størrelse basert på SVG viewBox
      const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 680, pitch === 'handball' ? 340 : pitch === 'full' ? 1050 : 525];
      const viewBoxWidth = viewBox[2];
      const viewBoxHeight = viewBox[3];
      
      // Opprett canvas med riktig størrelse
      canvasFallback = document.createElement('canvas');
      canvasFallback.width = viewBoxWidth;
      canvasFallback.height = viewBoxHeight;
      
      const ctx = canvasFallback.getContext('2d', { alpha: false });
      if (!ctx) return;
      
      // Legg til canvas i DOM for bedre kompatibilitet
      document.body.appendChild(canvasFallback);
      canvasFallback.style.position = "fixed";
      canvasFallback.style.top = "0";
      canvasFallback.style.left = "0";
      canvasFallback.style.opacity = "0";
      canvasFallback.style.pointerEvents = "none";
      canvasFallback.style.zIndex = "-1";
      
      // Start streaming med høy framerate
      stream = canvasFallback.captureStream(30);
      
      const updateCanvas = () => {
        if (!recording || !ctx) return;
        
        // Start tidtaking
        const startTime = performance.now();
        
        // Tegn hvit bakgrunn
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasFallback!.width, canvasFallback!.height);
        
        // Konverter SVG til string med inline styles
        const inlinedSvg = inlineAllStyles(svg);
        const svgString = serializer.serializeToString(inlinedSvg);
        
        // Bruk Canvg for å tegne SVG på canvas
        Canvg.from(ctx, svgString, {
          ignoreDimensions: true,
          ignoreClear: true,
        }).then(instance => {
          instance.resize(canvasFallback!.width, canvasFallback!.height);
          instance.render();
          
          console.log("UpdateCanvas: " + (performance.now() - startTime).toFixed(0) + " ms");
          
          // Fjernet 5000 ms begrensningen for å tillate lengre opptak
          // Legg til en mer fleksibel timeout-sjekk for å unngå at nettleseren henger
          if (performance.now() - startTime >= 10000) {
            console.warn("En enkelt frame tok mer enn 10 sekunder å rendere. Sjekk for komplekse elementer.");
          }
          
          // Fortsett animasjonsløkken
          if (recording) {
            updateCanvasRafId = requestAnimationFrame(updateCanvas);
          }
        }).catch(err => {
          console.error('Feil ved rendering av SVG:', err);
          if (recording) {
            updateCanvasRafId = requestAnimationFrame(updateCanvas);
          }
        });
      };
      
      // Start canvas-oppdatering
      updateCanvas();

      // Konfigurer MediaRecorder med høy kvalitet og kompatible innstillinger
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 2500000 // Redusert til 2.5 Mbps for bedre stabilitet ved lengre opptak
      });
      
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.log(`Databit mottatt: ${(event.data.size / 1024 / 1024).toFixed(2)} MB`);
        }
      };
      
      recorder.onstop = () => {
        // Stopp oppdatering og fjern canvas
        recording = false;
        if (updateCanvasRafId) cancelAnimationFrame(updateCanvasRafId);
        
        console.log(`Opptak fullført. Totalt ${chunks.length} datablokker samlet.`);
        
        // Lag video-blob og last ned
        const blobVideo = new Blob(chunks, { type: 'video/webm' });
        console.log(`Total videostørrelse: ${(blobVideo.size / 1024 / 1024).toFixed(2)} MB`);
        
        const url = URL.createObjectURL(blobVideo);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'animation.webm';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        
        // Rydd opp
        if (canvasFallback && document.body.contains(canvasFallback)) {
          document.body.removeChild(canvasFallback);
        }
        
        recordingRef.current = false;
        setIsRecording(false);
        setIsPlaying(false);
        isPlayingRef.current = false;
      };
      
      // Start opptak med datainnsamling hvert 1000ms (1 sekund)
      // Dette hjelper med å håndtere lengre opptak ved å dele dem opp i mindre segmenter
      recorder.start(1000);
      console.log("Opptak startet");
      
      // Start avspilling
      setIsPlaying(true);
      isPlayingRef.current = true;
      
      // Beregn total varighet basert på summen av alle keyframes' individuelle varigheter
      const totalDuration = frames.reduce((total, frame) => total + (frame.duration * 1000 / playbackSpeed), 0);
      
      // Tillat lengre opptak, opp til 10 minutter (600000 ms)
      const maxRecordDuration = 600000; // 10 minutter
      
      // Legg til ekstra tid basert på antall keyframes for å sikre at alle kommer med
      const keyframeBuffer = frames.length * 1000; // 1000ms ekstra per keyframe
      const recordDuration = Math.min(Math.max(totalDuration * 1.5, 5000) + keyframeBuffer, maxRecordDuration);
      
      console.log(`Total animasjonsvarighet: ${totalDuration}ms, opptaksvarighet: ${recordDuration + 20000}ms (maks ${maxRecordDuration}ms)`);
      console.log(`Antall keyframes: ${frames.length}, ekstra buffer per keyframe: ${keyframeBuffer}ms`);
      console.log(`Gjennomsnittlig varighet per keyframe: ${totalDuration / frames.length}ms`);
      
      setTimeout(() => {
        console.log("Stopper opptak");
        recorder.stop();
      }, recordDuration + 20000); // Økt buffer-tid fra 10 til 20 sekunder, pluss ekstra tid per keyframe
    } else {
      console.error('Ingen SVG for opptak.');
    }
  };

  // Oppdater useEffect for interpolering
  useEffect(() => {
    if (!frames[currentFrame]) return;
    
    const currentElements = frames[currentFrame].elements;
    const nextElements = frames[currentFrame + 1]?.elements || currentElements;

    // Interpoler elementer
    const interpolated = currentElements.map(currentEl => {
      const nextEl = nextElements.find(next => next.id === currentEl.id);
      
      if (!nextEl || nextEl === currentEl) return currentEl;

      if (
        typeof currentEl.x === 'number' &&
        typeof currentEl.y === 'number' &&
        typeof nextEl.x === 'number' &&
        typeof nextEl.y === 'number'
      ) {
        const safeProgress = Math.min(progress, 1);
        
        if (currentEl.type === 'player' || currentEl.type === 'ball') {
          const offset = currentEl.traceOffset ?? 0;
          const newPos = getCubicBezierPoint(
            safeProgress,
            { x: currentEl.x, y: currentEl.y },
            { x: nextEl.x, y: nextEl.y },
            offset
          );
          return { ...currentEl, x: newPos.x, y: newPos.y };
        } else {
          return {
            ...currentEl,
            x: currentEl.x + (nextEl.x - currentEl.x) * safeProgress,
            y: currentEl.y + (nextEl.y - currentEl.y) * safeProgress,
          };
        }
      }

      return currentEl;
    });

    setInterpolatedElements(interpolated);
  }, [currentFrame, progress, frames]);

  // Oppdater useEffect for animasjonskontroll
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animateFrames);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying]);

  // Endrer renderTrace-funksjonen
  const renderTrace = () => {
    if (frames.length < 2) return null;
    const nextIndex = currentFrame < frames.length - 1 ? currentFrame + 1 : (currentFrame - 1 >= 0 ? currentFrame - 1 : currentFrame);
    const currentEl = frames[currentFrame].elements;
    const nextEl = frames[nextIndex].elements;
    return currentEl.map(el => {
      const matchingNext = nextEl.find(n => n.id === el.id);
      if (
        matchingNext &&
        typeof el.x === 'number' &&
        typeof el.y === 'number' &&
        typeof matchingNext.x === 'number' &&
        typeof matchingNext.y === 'number'
      ) {
        if (el.type === 'player' || el.type === 'ball') {
          const offset = el.traceOffset ?? 0;
          const path = createLinePath({ x: el.x, y: el.y }, { x: matchingNext.x, y: matchingNext.y }, true, offset);
          return (
            <path
              key={`trace-${el.id}`}
              d={path}
              fill="none"
              stroke={el.type === 'ball' ? "red" : "blue"}
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.7"
            />
          );
        }
      }
      return null;
    });
  };

  // Denne funksjonen oppdaterer et element i keyframe med index `frameIndex`.
  const updateFrameElement = (frameIndex: number, elementId: string, newProps: Partial<FootballElement>) => {
    setFrames(prevFrames => {
      const updatedFrames = [...prevFrames];
      if (updatedFrames[frameIndex]) {
        updatedFrames[frameIndex].elements = updatedFrames[frameIndex].elements.map(el =>
          el.id === elementId ? ({ ...el, ...newProps } as FootballElement) : el
        );
      }
      return updatedFrames;
    });
  };

  // Legg til en funksjon for å legge til en ny keyframe (dupliserer gjeldende keyframe)
  const handleAddKeyframe = () => {
    setFrames(prevFrames => {
      const newFrame: Frame = {
        elements: [],
        duration: 1
      };
      return [...prevFrames, newFrame];
    });
  };

  // Legg til en ny funksjon for å oppdatere varighet
  const handleFrameDurationChange = (frameIndex: number, newDuration: number) => {
    setFrames(prevFrames => {
      const updatedFrames = [...prevFrames];
      updatedFrames[frameIndex] = {
        ...updatedFrames[frameIndex],
        duration: newDuration
      };
      return updatedFrames;
    });
  };

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    currentFrameRef.current = currentFrame;
  }, [currentFrame]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const handleElementSelect = (element: FootballElement) => {
    setSelectedElement(element);
    if (element.type === 'line') {
      // Sett riktig linjestil basert på elementets egenskaper
      const style = element.dashed
        ? element.marker === 'arrow'
          ? 'dashedCurvedArrow'
          : 'dashedCurved'
        : element.marker === 'arrow'
          ? 'curvedArrow'
          : 'solidCurved';
      setSelectedLineStyle(style as LineStyle);

      const path = element.path;

      // Beregn initial kurvatur basert på kontrollpunkt (cp1) med oppdaterte regexer
      const cpMatch = path.match(/C ([0-9.-]+) ([0-9.-]+) ([0-9.-]+) ([0-9.-]+)/);
      if (cpMatch) {
        const [, cp1x, cp1y] = cpMatch;
        const startMatch = path.match(/M ([0-9.-]+) ([0-9.-]+)/);
        if (startMatch) {
          const [, startX, startY] = startMatch;
          const dx = Number(cp1x) - Number(startX);
          const dy = Number(cp1y) - Number(startY);
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0) {
            const perpX = -dy / len;
            const perpY = dx / len;
            const offset = Math.round(perpX * len);
            setSelectedLineCurveOffset(offset);
            setCurveOffset(offset);
          }
        }
      }
      
      // Ekstraher og lagre de originale start- og sluttpunktene fra path med oppdaterte regexer
      const startMatchEndpoints = path.match(/M ([0-9.-]+) ([0-9.-]+)/);
      const endMatch = path.match(/([0-9.-]+) ([0-9.-]+)$/);
      if (startMatchEndpoints && endMatch) {
        const startPoint = { x: Number(startMatchEndpoints[1]), y: Number(startMatchEndpoints[2]) };
        const endPoint = { x: Number(endMatch[1]), y: Number(endMatch[2]) };
        setSelectedLinePoints({ start: startPoint, end: endPoint });
      }
    }
  };

  // Oppdatert useEffect for curveOffset med kast til LineElement
  useEffect(() => {
    if (selectedElement?.type === 'line' && selectedLinePoints) {
      const start = selectedLinePoints.start;
      const end = selectedLinePoints.end;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.sqrt(dx * dx + dy * dy);

      let perpX = 0, perpY = 0;
      if (len !== 0) {
        perpX = -dy / len;
        perpY = dx / len;
      }

      const cp1x = start.x + dx / 3 + curveOffset * perpX;
      const cp1y = start.y + dy / 3 + curveOffset * perpY;
      const cp2x = start.x + 2 * dx / 3 + curveOffset * perpX;
      const cp2y = start.y + 2 * dy / 3 + curveOffset * perpY;

      const newPath = `M ${start.x} ${start.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${end.x} ${end.y}`;

      const newFrames = [...frames];
      newFrames[currentFrame].elements = newFrames[currentFrame].elements.map(el => {
        if (el.id === selectedElement.id) {
          const lineEl = el as LineElement;
          return { 
            ...lineEl, 
            path: newPath,
            dashed: lineEl.dashed,
            marker: lineEl.marker 
          };
        }
        return el;
      });
      setFrames(newFrames);
    }
  }, [curveOffset, selectedElement, selectedLinePoints, frames, currentFrame]);

  // Legg til en ny funksjon for å håndtere dobbeltklikk på tekst
  const handleTextDoubleClick = (event: React.MouseEvent, element: TextElement) => {
    event.stopPropagation();
    const newContent = prompt('Rediger tekst:', element.content);
    if (newContent !== null) {
      updateFrameElement(currentFrame, element.id, {
        ...element,
        content: newContent
      });
    }
  };

  // Håndterer dobbeltklikk på spiller/motstander for å endre nummer
  const handlePlayerNumberDoubleClick = (event: React.MouseEvent, element: PlayerElement | OpponentElement) => {
    event.stopPropagation();
    try {
      console.log(`Dobbeltklikk registrert på ${element.type} med id ${element.id}`);
      const newNumber = prompt('Endre nummer:', element.number);
      if (newNumber !== null) {
        updateFrameElement(currentFrame, element.id, {
          ...element,
          number: newNumber
        });
      }
    } catch (error) {
      console.error('Feil ved endring av spillernummer:', error);
    }
  };

  // Funksjon for å laste ned en spesifikk keyframe som PNG
  const handleDownloadKeyframePng = (frameIndex: number) => {
    if (recordedSVGRef.current) {
      // Lagre gjeldende tilstand
      const currentFrameBackup = currentFrame;
      const isPlayingBackup = isPlaying;
      const interpolatedElementsBackup = [...interpolatedElements];
      
      // Stopp avspilling hvis den er aktiv
      if (isPlaying) {
        setIsPlaying(false);
      }
      
      // Bytt til den valgte keyframen
      setCurrentFrame(frameIndex);
      
      // Sett interpolerte elementer til elementene fra den valgte keyframen
      setInterpolatedElements([...frames[frameIndex].elements]);
      
      // Vent på at rendering er fullført
      setTimeout(() => {
        // Last ned PNG
        if (recordedSVGRef.current) {
          downloadPng(recordedSVGRef.current, `keyframe-${frameIndex + 1}.png`);
        }
        
        // Gjenopprett tidligere tilstand
        setCurrentFrame(currentFrameBackup);
        setInterpolatedElements(interpolatedElementsBackup);
        
        if (isPlayingBackup) {
          setIsPlaying(true);
        }
      }, 200); // Øk timeout for å sikre at rendering er fullført
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="px-2 sm:px-6 py-4 border-b">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-center">
            Taktikktavle fotball
          </h1>
        </div>
        <div className="border rounded-md bg-white mx-2 sm:mx-6">
          <button
            onClick={() => setIsHelpExpanded(!isHelpExpanded)}
            className="w-full px-3 sm:px-4 py-2 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <span className="text-sm font-medium">Hvordan bruke taktikktavlen</span>
            {isHelpExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {isHelpExpanded && (
            <div className="px-3 sm:px-4 py-3 text-sm border-t">
              <div className="space-y-3">
                <section>
                  <h3 className="font-medium mb-1">Verktøy</h3>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600">
                    <li>Velg (V) - Flytt og juster elementer</li>
                    <li>Spiller (P) - Legg til spillere</li>
                    <li>Motspiller (O) - Legg til motstandere</li>
                    <li>Ball (B) - Legg til ball</li>
                    <li>Bane (T) - Bytt mellom hel og halv bane</li>
                    <li>Kjegle (C) - Legg til kjegler</li>
                    <li>Linje (L) - Tegn linjer og piler</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-medium mb-1">Keyframes</h3>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600">
                    <li>Kopier - Dupliser gjeldende keyframe</li>
                    <li>Slett - Fjern gjeldende keyframe</li>
                    <li>Tom keyframe - Legg til ny tom keyframe</li>
                    <li>Nummererte knapper viser antall elementer i parentes</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-medium mb-1">Animasjon</h3>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600">
                    <li>Start/Pause (Mellomrom) - Spill av animasjonen</li>
                    <li>Spol tilbake (R) - Gå til start</li>
                    <li>Juster hastighet med glideren</li>
                    <li>Last ned som film for å dele</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-medium mb-1">Tips</h3>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600">
                    <li>Bruk piltaster for å justere hastighet</li>
                    <li>Dobbeltklikk for å velge element</li>
                    <li>Hold Shift for å tegne rette linjer</li>
                    <li>Juster kurvatur på linjer og bevegelser</li>
                  </ul>
                </section>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <TopToolbar
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        onDuplicate={handleDuplicateFrame}
        onDelete={handleDeleteFrame}
        onAddKeyframe={handleAddKeyframe}
      />
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        <KeyframePanel
          frames={frames}
          currentFrame={currentFrame}
          setCurrentFrame={setCurrentFrame}
          selectedElement={selectedElement}
          handleDuplicateFrame={handleDuplicateFrame}
          handleDeleteFrame={handleDeleteFrame}
          handleDeleteElement={handleDeleteElement}
          handleResetNumbers={handleResetNumbers}
          handleClearElements={handleClearElements}
          handleAddKeyframe={handleAddKeyframe}
          handleFrameDurationChange={handleFrameDurationChange}
          handleDownloadKeyframePng={handleDownloadKeyframePng}
        />
        <TooltipProvider delayDuration={0}>
          <div className="p-2 sm:p-4 border rounded bg-white mb-4">
            <h3 className="text-sm font-semibold mb-2">Rediger Keyframe {currentFrame + 1}</h3>
            {(frames[currentFrame]?.elements ?? []).length > 0 ? (
              (frames[currentFrame]?.elements ?? []).map(el => (
                <div key={el.id} className="flex flex-col border-b py-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{el.id} [{el.type}]</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <input
                          type="checkbox"
                          checked={el.visible !== false}
                          onChange={() =>
                            updateFrameElement(currentFrame, el.id, { visible: !(el.visible ?? true) })
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                        <div className="flex flex-col">
                          <p className="text-[10px] font-medium">Vis/skjul element</p>
                          <p className="text-[9px] text-gray-300">Snarvei: H</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {el.type === 'text' && (
                    <>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm whitespace-nowrap">Tekst:</span>
                        <input
                          type="text"
                          value={(el as TextElement).content}
                          onChange={(e) => updateFrameElement(currentFrame, el.id, { content: e.target.value })}
                          className="flex-1 min-w-[100px] px-2 py-1 text-sm border rounded"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm whitespace-nowrap">Størrelse:</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex-1 min-w-[100px]">
                              <Slider
                                value={[(el as TextElement).fontSize]}
                                onValueChange={([val]) => updateFrameElement(currentFrame, el.id, { fontSize: val })}
                                min={8}
                                max={48}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                            <div className="flex flex-col">
                              <p className="text-[10px] font-medium">Juster tekststørrelse: {(el as TextElement).fontSize}px</p>
                              <p className="text-[9px] text-gray-300">8 til 48 piksler</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-xs tabular-nums w-8">{(el as TextElement).fontSize}px</span>
                      </div>
                    </>
                  )}
                  {(el.type === 'player' || el.type === 'ball') && (
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-sm whitespace-nowrap">Trace offset:</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex-1 min-w-[100px]">
                            <Slider
                              value={[el.traceOffset ?? 0]}
                              onValueChange={([val]) => updateFrameElement(currentFrame, el.id, { traceOffset: val })}
                              min={-300}
                              max={300}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                          <div className="flex flex-col">
                            <p className="text-[10px] font-medium">Juster bevegelseskurve: {el.traceOffset ?? 0}px</p>
                            <p className="text-[9px] text-gray-300">Dra for å endre (-300 til 300)</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      <span className="text-xs tabular-nums w-8">{el.traceOffset ?? 0}px</span>
                    </div>
                  )}
                  {el.type === 'line' && selectedElement?.id === el.id && (
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-sm whitespace-nowrap">Kurvatur:</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex-1 min-w-[100px]">
                            <Slider
                              value={[curveOffset]}
                              onValueChange={([val]) => setCurveOffset(val)}
                              min={-300}
                              max={300}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                          <div className="flex flex-col">
                            <p className="text-[10px] font-medium">Juster kurvatur: {curveOffset}px</p>
                            <p className="text-[9px] text-gray-300">Dra for å endre (-300 til 300)</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      <span className="text-xs tabular-nums w-8">{curveOffset}px</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Ingen elementer i keyframe {currentFrame + 1}</p>
            )}
          </div>
        </TooltipProvider>
        {/* Verktøylinjen som vises over banen er fjernet */}

        {tool === 'line' && (
          <ToolSelector
            selectedTool={tool}
            setSelectedTool={setTool}
            pitch={pitch}
            handleTogglePitch={handleTogglePitch}
            selectedLineStyle={selectedLineStyle}
            setSelectedLineStyle={setSelectedLineStyle}
            curveOffset={curveOffset}
            setCurveOffset={setCurveOffset}
            lineColor={lineColor}
            setLineColor={setLineColor}
            customColor={customColor}
            setCustomColor={setCustomColor}
          />
        )}

        <div className="relative border rounded flex justify-start items-center overflow-hidden" style={{ 
          height: "calc(100vh - 220px)",
          width: "100%",
          maxWidth: pitch === 'handball' 
            ? "calc((100vh - 220px) * 2)" 
            : pitch === 'full' 
              ? "calc((100vh - 220px) * 0.647)" 
              : pitch === 'fullLandscape'
                ? "calc((100vh - 220px) * 1.544)"
                : "calc((100vh - 220px) * 1.295)",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          <svg
            ref={recordedSVGRef}
            className="w-full h-full touch-none"
            viewBox={`0 0 ${
              pitch === 'fullLandscape' ? 1050 : 680
            } ${
              pitch === 'handball' ? 340 : 
              pitch === 'full' ? 1050 : 
              pitch === 'fullLandscape' ? 680 : 
              525
            }`}
            preserveAspectRatio="xMidYMid fit"
            xmlns="http://www.w3.org/2000/svg"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              handleMouseDown({
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {},
                stopPropagation: () => {}
              } as React.MouseEvent<SVGSVGElement>);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              handleMouseMove(e);
            }}
            onTouchEnd={(e) => {
              const touch = e.changedTouches[0];
              handleMouseUp({
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {},
                stopPropagation: () => {}
              } as React.MouseEvent<SVGSVGElement>);
            }}
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
              <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
                <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1" />
              </marker>
              <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="currentColor" strokeWidth="1" />
              </marker>
              <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="currentColor" strokeWidth="1" />
              </marker>
            </defs>
            <rect 
              x="0" 
              y="0" 
              width={pitch === 'fullLandscape' ? '1050' : '680'}
              height={pitch === 'handball' ? 340 : pitch === 'full' ? 1050 : pitch === 'fullLandscape' ? 680 : 525} 
              fill="white" 
            />
            {getPitchTemplate()}
            {frames[currentFrame] && frames[currentFrame + 1] && renderTrace()}
            {(() => {
              // Bestem hvilke elementer som skal vises
              const elementsToRender = isPlaying || isRecording
                ? interpolatedElements
                : frames[currentFrame]?.elements ?? [];
              
              // Filtrer og render elementene
              return elementsToRender
                .filter(el => el.visible !== false)
                .map(renderElement);
            })()}
            {previewLine && renderElement(previewLine)}
          </svg>
        </div>
      </CardContent>
      <BottomToolbar 
        selectedTool={tool}
        setSelectedTool={setTool}
        pitch={pitch}
        handleTogglePitch={handleTogglePitch}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onRewind={() => setCurrentFrame(0)}
        onDeleteElement={handleDeleteElement}
        onDownloadFilm={handleDownloadFilm}
        onDownloadPng={handleDownloadPng}
        onDownloadAnimation={handleDownloadAnimation}
        onLoadAnimation={handleLoadAnimation}
        onLoadExampleAnimation={handleLoadExampleAnimation}
        selectedElement={selectedElement}
      />
    </Card>
  );
};

export default FootballAnimator;