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
import { Play, Pause, SkipBack, Save, Copy, Trash2, Plus, Film } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import { Canvg } from 'canvg';
import TopToolbar from './components/TopToolbar';
import KeyframePanel from './components/KeyframePanel';
import LineStyleSelector, { LineStyle } from './components/LineStyleSelector';

type Tool = 'select' | 'player' | 'opponent' | 'ball' | 'cone' | 'line';
type PitchType = 'full' | 'offensive' | 'defensive';

interface BaseElement {
  id: string;
  x?: number;
  y?: number;
  visible?: boolean;
}

interface PlayerElement extends BaseElement {
  type: 'player';
  number: number;
  traceOffset?: number;
}

interface OpponentElement extends BaseElement {
  type: 'opponent';
  number: number;
}

interface BallElement extends BaseElement {
  type: 'ball';
  traceOffset?: number;
}

interface ConeElement extends BaseElement {
  type: 'cone';
}

interface LineElement extends BaseElement {
  type: 'line';
  path: string;
  dashed: boolean;
  marker?: 'arrow' | 'endline' | 'plus' | 'xmark' | null;
}

type Element = PlayerElement | OpponentElement | BallElement | ConeElement | LineElement;

interface Frame {
  id: number;
  elements: Element[];
}

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

const FootballAnimator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [frames, setFrames] = useState<Frame[]>([{ id: 0, elements: [] }]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [interpolatedElements, setInterpolatedElements] = useState<Element[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [pitch, setPitch] = useState<PitchType>('offensive');
  const [tool, setTool] = useState<Tool>('select');
  const [selectedLineStyle, setSelectedLineStyle] = useState<LineStyle>('solidStraight');
  const [curveOffset, setCurveOffset] = useState<number>(0);
  const [traceCurveOffset, setTraceCurveOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lineStart, setLineStart] = useState<{x: number, y: number} | null>(null);
  const animationRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [elements, setElements] = useState<Element[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{x: number; y: number} | null>(null);
  const recordedSVGRef = useRef<SVGSVGElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(isRecording);
  const progressRef = useRef(progress);
  const currentFrameRef = useRef(currentFrame);
  const isPlayingRef = useRef(isPlaying);

  const lineStyleOptions: { value: LineStyle, label: string, preview: React.ReactElement }[] = [
    {
      value: 'solidCurved',
      label: 'Solid Curved',
      preview: (
        <svg viewBox="0 0 160 40" className="w-32 h-8">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black"/>
            </marker>
            <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <path d="M 0,20 C 50,0 110,0 160,20" fill="none" stroke="black" strokeWidth="2" />
        </svg>
      )
    },
    {
      value: 'dashedCurved',
      label: 'Dashed Curved',
      preview: (
        <svg viewBox="0 0 160 40" className="w-32 h-8">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black"/>
            </marker>
            <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <path d="M 0,20 C 50,0 110,0 160,20" fill="none" stroke="black" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      )
    },
    {
      value: 'solidStraight',
      label: 'Solid Straight',
      preview: (
        <svg viewBox="0 0 160 40" className="w-32 h-8">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black"/>
            </marker>
            <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <line x1="0" y1="20" x2="160" y2="20" stroke="black" strokeWidth="2" />
        </svg>
      )
    },
    {
      value: 'dashedStraight',
      label: 'Dashed Straight',
      preview: (
        <svg viewBox="0 0 160 40" className="w-32 h-8">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black"/>
            </marker>
            <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <line x1="0" y1="20" x2="160" y2="20" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
        </svg>
      )
    },
    {
      value: 'curvedArrow',
      label: 'Curved Arrow',
      preview: (
        <svg viewBox="-10 0 180 40" className="w-32 h-8">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black"/>
            </marker>
            <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <path d="M 0,20 C 50,0 110,0 160,20" fill="none" stroke="black" strokeWidth="2" markerEnd="url(#arrow)"/>
        </svg>
      )
    },
    {
      value: 'straightArrow',
      label: 'Straight Arrow',
      preview: (
        <svg viewBox="-10 0 180 40" className="w-32 h-8">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black"/>
            </marker>
            <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <line x1="0" y1="20" x2="160" y2="20" stroke="black" strokeWidth="2" markerEnd="url(#arrow)"/>
        </svg>
      )
    },
    {
      value: 'endMark',
      label: 'End Mark',
      preview: (
        <svg viewBox="-10 0 180 40" className="w-32 h-8">
          <defs>
            <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <path d="M 0,20 L 160,20" fill="none" stroke="black" strokeWidth="2" markerEnd="url(#endline)"/>
        </svg>
      )
    },
    {
      value: 'plusEnd',
      label: 'Plus End',
      preview: (
        <svg viewBox="-10 0 180 40" className="w-32 h-8">
          <defs>
            <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <path d="M 0,20 L 160,20" fill="none" stroke="black" strokeWidth="2" markerEnd="url(#plus)"/>
        </svg>
      )
    },
    {
      value: 'xEnd',
      label: 'X End',
      preview: (
        <svg viewBox="-10 0 180 40" className="w-32 h-8">
          <defs>
            <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1"/>
            </marker>
            <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1"/>
            </marker>
          </defs>
          <path d="M 0,20 L 160,20" fill="none" stroke="black" strokeWidth="2" markerEnd="url(#xmark)"/>
        </svg>
      )
    },
  ];

  const getPitchTemplate = () => {
    switch(pitch) {
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

  const handleElementClick = (event: React.MouseEvent, element: Element) => {
    if (tool === 'select') {
      event.stopPropagation();
      setSelectedElement(element);
    }
  };

  const handleElementDragStart = (event: React.MouseEvent, element: Element) => {
    if (tool !== 'select') return;
    event.stopPropagation();
    setSelectedElement(element);
    setIsDragging(true);
    const coords = getSVGCoordinates(event as React.MouseEvent<SVGSVGElement>);
    setStartPoint(coords);
  };

  const renderElement = (element: Element) => {
    const isSelected = selectedElement?.id === element.id;
    const highlightStyle = isSelected ? { filter: 'drop-shadow(0 0 3px #3b82f6)' } : {};
    
    const transform = element.type === 'line' ? '' : `translate(${element.x ?? 0}, ${element.y ?? 0})`;
    
    const elementProps = {
      style: highlightStyle,
      onClick: (e: React.MouseEvent) => handleElementClick(e, element),
      onMouseDown: (e: React.MouseEvent) => {
        if (tool === 'select') handleElementDragStart(e, element);
      },
      transform
    };

    switch(element.type) {
      case 'player':
        return (
          <g key={element.id} {...elementProps}>
            <circle cx="0" cy="0" r="15" fill="white" stroke="black" strokeWidth="2"/>
            <text x="0" y="5" textAnchor="middle" fontFamily="Arial" fontSize="16" fontWeight="bold">
              {element.number}
            </text>
          </g>
        );
      case 'opponent':
        return (
          <g key={element.id} {...elementProps}>
            <circle cx="0" cy="0" r="15" fill="black" stroke="black" strokeWidth="2"/>
            <text x="0" y="5" textAnchor="middle" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="white">
              {element.number}
            </text>
          </g>
        );
      case 'ball':
        return (
          <g key={element.id} {...elementProps}>
            <circle cx="0" cy="0" r="8" fill="white" stroke="black" strokeWidth="1.5"/>
            <path d="M 0,-3.5 L 3,-1.75 L 3,1.75 L 0,3.5 L -3,1.75 L -3,-1.75 Z" fill="black"/>
          </g>
        );
      case 'cone':
        return (
          <g key={element.id} {...elementProps}>
            <path d="M -5,8 L 5,8 L 2,-8 L -2,-8 Z" fill="orange" stroke="black" strokeWidth="1"/>
          </g>
        );
      case 'line':
        return (
          <path
            key={element.id}
            {...elementProps}
            d={element.path}
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeDasharray={element.dashed ? "5,5" : "none"}
            markerEnd={element.marker ? `url(#${element.marker})` : "none"}
            style={{
              ...elementProps.style,
              cursor: tool === 'select' ? 'move' : 'default',
              pointerEvents: 'all'
            }}
          />
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
    const viewBoxWidth = 680;
    const viewBoxHeight = pitch === 'full' ? 1050 : 525;
    
    // Beregn skalering basert på SVG-elementets faktiske størrelse og viewBox
    const scaleX = viewBoxWidth / rect.width;
    const scaleY = viewBoxHeight / rect.height;
    
    // Beregn museklikk-posisjon relativt til SVG-en og skaler den
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

  // Hjelpefunksjon for å hente linjeegenskaper basert på valgt linjestil
  const getLineProperties = (style: LineStyle) => {
    const lowerStyle = style.toLowerCase();
    // Kun kurvede dersom "curved" er en del av strengen
    const curved = lowerStyle.includes("curved");
    const dashed = lowerStyle.includes("dashed");
    let marker: 'arrow' | 'endline' | 'plus' | 'xmark' | null = null;
    switch(lowerStyle) {
      case 'curvedarrow':
      case 'straightarrow':
        marker = 'arrow';
        break;
      case 'endmark':
        marker = 'endline';
        break;
      case 'plusend':
        marker = 'plus';
        break;
      case 'xend':
        marker = 'xmark';
        break;
      default:
        marker = null;
    }
    return { curved, dashed, marker };
  };

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    const coords = getSVGCoordinates(event);
    
    if (tool === 'line') {
      setLineStart(coords);
      setIsDragging(true);
      setIsDrawing(true);
      setStartPoint(coords);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (tool === 'select' && isDragging && selectedElement && startPoint) {
      const coords = getSVGCoordinates(event);
      const dx = coords.x - startPoint.x;
      const dy = coords.y - startPoint.y;

      const newFrames = [...frames];
      newFrames[currentFrame].elements = newFrames[currentFrame].elements.map(el => {
        if (el.id === selectedElement.id) {
          if (el.type === 'line') {
            // Bruk translatePath for linjer
            return { ...el, path: translatePath(el.path, dx, dy) };
          } else {
            // For andre elementer bruker vi x og y offset
            return { ...el, x: (el.x ?? 0) + dx, y: (el.y ?? 0) + dy };
          }
        }
        return el;
      });
      setFrames(newFrames);
      setStartPoint(coords);
    }

    if (tool === 'line' && isDragging && lineStart) {
      const coords = getSVGCoordinates(event);
      const newFrames = [...frames];
      const currentElements = newFrames[currentFrame].elements;
      const previewLine = currentElements.find(el => el.type === 'line' && el.id === 'preview-line') as LineElement | undefined;
      
      const { curved, dashed, marker } = getLineProperties(selectedLineStyle);
      const path = createLinePath(lineStart, coords, curved, curveOffset);
      
      if (previewLine) {
        previewLine.path = path;
        previewLine.dashed = dashed;
        previewLine.marker = marker;
      } else {
        currentElements.push({
          id: 'preview-line',
          type: 'line',
          path,
          dashed,
          marker,
        });
      }
      setFrames(newFrames);
    }
  };

  const handleMouseUp = (event: React.MouseEvent<SVGSVGElement>) => {
    const coords = getSVGCoordinates(event);
    if (tool === 'line' && isDragging && lineStart) {
      const { curved, dashed, marker } = getLineProperties(selectedLineStyle);
      const finalizedPath = createLinePath(lineStart, coords, curved, curveOffset);
      const newFrames = [...frames];
      const currentElements = newFrames[currentFrame].elements;
      const previewIndex = currentElements.findIndex(
        el => el.type === 'line' && el.id === 'preview-line'
      );
      if (previewIndex >= 0) {
        // Finaliserer preview-linjen til en permanent linje ved å generere et unikt id
        currentElements[previewIndex] = {
          ...(currentElements[previewIndex] as LineElement),
          id: 'line-' + Date.now(),
          path: finalizedPath,
          dashed,
          marker,
        };
      } else {
        // Hvis preview ikke finnes, legg til en ny linje
        currentElements.push({
          id: 'line-' + Date.now(),
          type: 'line',
          path: finalizedPath,
          dashed,
          marker,
        });
      }
      setFrames(newFrames);
      setIsDragging(false);
      setLineStart(null);
      setIsDrawing(false);
      setStartPoint(null);
    } else if (tool === 'select' && isDragging && selectedElement) {
      updateFrameElement(currentFrame, selectedElement.id, { x: coords.x, y: coords.y });
      setIsDragging(false);
      setSelectedElement(null);
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

      let newElement: Element;
      
      switch (tool) {
        case 'player':
        case 'opponent':
          newElement = {
            ...baseElement,
            type: tool,
            number: currentNumber
          };
          setCurrentNumber(prev => prev + 1);
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
    const newFrame = {
      id: Date.now(),
      elements: JSON.parse(JSON.stringify(frames[currentFrame].elements))
    };
    const updatedFrames = [
      ...frames.slice(0, currentFrame + 1),
      newFrame,
      ...frames.slice(currentFrame + 1)
    ];
    setFrames(updatedFrames);
    setCurrentFrame(currentFrame + 1);
  };

  const handleDeleteFrame = () => {
    if (frames.length > 1) {
      const newFrames = frames.filter((_, index) => index !== currentFrame);
      setFrames(newFrames);
      setCurrentFrame(Math.min(currentFrame, newFrames.length - 1));
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      if (currentFrame === frames.length - 1) {
        setCurrentFrame(0);
        setProgress(0);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleResetNumbers = () => {
    setCurrentNumber(1);
  };

  const handleClearElements = () => {
    const newFrames = frames.map(frame => ({
      ...frame,
      elements: []
    }));
    setFrames(newFrames);
    setElements([]);
    setCurrentNumber(1);
  };

  // Funksjon for å laste ned animasjonen som en JSON-fil
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

  // Funksjon for å laste ned animasjonen som film (video .webm)
  const handleDownloadFilm = () => {
    if (recordingRef.current) {
      console.log("Opptak allerede i gang, ignorerer ny forespørsel.");
      return;
    }
    
    // Reset til start før opptak
    setCurrentFrame(0);
    setProgress(0);
    
    recordingRef.current = true;
    setIsRecording(true);
    
    if (recordedSVGRef.current) {
      let stream;
      let canvasFallback: HTMLCanvasElement | null = null;
      let recording = true;
      let updateCanvasRafId = 0;
      
      if ((recordedSVGRef.current as any).captureStream) {
        console.log("SVG støtter captureStream, bruker den direkte.");
        stream = (recordedSVGRef.current as any).captureStream(60);
      } else {
        console.log("captureStream() ikke tilgjengelig på SVG, benytter canvas som fallback.");
        const svg = recordedSVGRef.current;
        const serializer = new XMLSerializer();
        const { width, height } = svg.getBoundingClientRect();
        canvasFallback = document.createElement('canvas');
        canvasFallback.width = width || 680;
        canvasFallback.height = height || 1050;
        const ctx = canvasFallback.getContext('2d');
        if (!ctx) return;
        
        canvasFallback.style.position = "fixed";
        canvasFallback.style.top = "0";
        canvasFallback.style.left = "0";
        canvasFallback.style.opacity = "0";
        document.body.appendChild(canvasFallback);
        stream = canvasFallback.captureStream(60);
        
        const updateCanvas = async () => {
          if (!recording) return;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvasFallback!.width, canvasFallback!.height);
          const inlinedSvg = inlineAllStyles(svg);
          const updatedSvgString = serializer.serializeToString(inlinedSvg);
          try {
            const instance = await Canvg.fromString(ctx, updatedSvgString, {
              ignoreDimensions: true,
              ignoreClear: false,
            });
            instance.resize(canvasFallback!.width, canvasFallback!.height);
            await instance.render();
          } catch (err) {
            console.error("updateCanvas-feil:", err);
          }
          updateCanvasRafId = requestAnimationFrame(updateCanvas);
        };
        updateCanvas();
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blobVideo = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blobVideo);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'animation.webm';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        
        if (canvasFallback && document.body.contains(canvasFallback)) {
          document.body.removeChild(canvasFallback);
        }
        
        recording = false;
        if (updateCanvasRafId) cancelAnimationFrame(updateCanvasRafId);
        recordingRef.current = false;
        setIsRecording(false);
        setIsPlaying(false);
      };
      
      recorder.start();
      console.log("Opptak startet");
      
      // Start avspilling etter at opptaket har startet
      setIsPlaying(true);
      
      // Beregn total varighet basert på antall frames og hastighet
      const recordDuration = frames.length > 1 ? (frames.length * 1000) / playbackSpeed : 5000;
      
      setTimeout(() => {
        console.log("Stopper opptak");
        recorder.stop();
      }, recordDuration);
    } else {
      console.error('Ingen SVG for opptak.');
    }
  };

  // Opprett en referanse for forrige tidspunkt
  const lastTimeRef = useRef<number>(performance.now());
  
  // Ny implementasjon av animasjonsløkken via requestAnimationFrame
  const animateFrames = (currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
  
    let newProgress = progressRef.current + (deltaTime * playbackSpeed) / 1000;
    if (newProgress >= 1) {
      if (currentFrameRef.current < frames.length - 1) {
        newProgress = 0;
        currentFrameRef.current = currentFrameRef.current + 1;
        setCurrentFrame(currentFrameRef.current);
      } else {
        newProgress = 1;
        setProgress(1);
        progressRef.current = 1;
        setIsPlaying(false);
        return;
      }
    }
    progressRef.current = newProgress;
    setProgress(newProgress);
  
    if (isPlayingRef.current) {
      animationRef.current = requestAnimationFrame(animateFrames);
    }
  };

  // Oppdater useEffect for interpolering
  useEffect(() => {
    if (!frames[currentFrame]) return;
    const currentElements = frames[currentFrame].elements;
    const nextElements = frames[currentFrame + 1]?.elements || currentElements;

    // Interpoler elementer mellom current og next frame
    const interpolated = currentElements.map(currentEl => {
      const nextEl = nextElements.find(next => next.id === currentEl.id);
      
      if (!nextEl || nextEl === currentEl) return currentEl;

      // Bare interpoler hvis vi har x- og y-koordinater
      if (
        typeof currentEl.x === 'number' &&
        typeof currentEl.y === 'number' &&
        typeof nextEl.x === 'number' &&
        typeof nextEl.y === 'number'
      ) {
        if (currentEl.type === 'player' || currentEl.type === 'ball') {
          // Bruk spillerens eget traceOffset, slik at den følger det samme sporet som vises
          const offset = currentEl.traceOffset ?? 0;
          const newPos = getCubicBezierPoint(
            Math.min(progress, 1),
            { x: currentEl.x, y: currentEl.y },
            { x: nextEl.x, y: nextEl.y },
            offset
          );
          return { ...currentEl, x: newPos.x, y: newPos.y };
        } else {
          const t = Math.min(progress, 1);
          return {
            ...currentEl,
            x: currentEl.x + (nextEl.x - currentEl.x) * t,
            y: currentEl.y + (nextEl.y - currentEl.y) * t,
          };
        }
      }

      return currentEl;
    });

    setInterpolatedElements(interpolated);
  }, [currentFrame, progress, frames]);

  // Nye useEffect-hook for å starte/stoppe animasjonen
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animateFrames);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, frames.length]);

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
  const updateFrameElement = (frameIndex: number, elementId: string, newProps: Partial<Element>) => {
    setFrames(prevFrames => {
      const updatedFrames = [...prevFrames];
      if (updatedFrames[frameIndex]) {
        updatedFrames[frameIndex].elements = updatedFrames[frameIndex].elements.map(el =>
          el.id === elementId ? ({ ...el, ...newProps } as Element) : el
        );
      }
      return updatedFrames;
    });
  };

  // Legg til en funksjon for å legge til en ny keyframe (dupliserer gjeldende keyframe)
  const handleAddKeyframe = () => {
    setFrames(prevFrames => {
      // Opprett en ny, tom keyframe uten å klone den gjeldende
      const newFrame = { id: Date.now(), elements: [] };
   
      const updated = [
        ...prevFrames,
        newFrame,
      ];
      // Sett currentFrame til den nye keyframen (som er den bakerste)
      setCurrentFrame(prevFrames.length);
      return updated;
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

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Football Animation Designer</CardTitle>
      </CardHeader>
      <TopToolbar
        pitch={pitch}
        setPitch={setPitch}
        tool={tool}
        setTool={setTool}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPause}
        onReset={() => setCurrentFrame(0)}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
      />
      <CardContent>
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
          handleDownloadAnimation={handleDownloadAnimation}
          handleDownloadFilm={handleDownloadFilm}
          handleAddKeyframe={handleAddKeyframe}
        />
        <div className="p-4 border rounded bg-white mb-4">
          <h3 className="text-sm font-semibold mb-2">Rediger Keyframe {currentFrame + 1}</h3>
          {(frames[currentFrame]?.elements ?? []).length > 0 ? (
            (frames[currentFrame]?.elements ?? []).map(el => (
              <div key={el.id} className="flex flex-col border-b py-1">
                <div className="flex items-center justify-between">
                  <span>{el.id} [{el.type}]</span>
                  <input
                    type="checkbox"
                    checked={el.visible !== false}
                    onChange={() =>
                      updateFrameElement(currentFrame, el.id, { visible: !(el.visible ?? true) })
                    }
                  />
                </div>
                {(el.type === 'player' || el.type === 'ball') && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm">Trace offset:</span>
                    <Slider
                      value={[el.traceOffset ?? 0]}
                      onValueChange={([val]) => updateFrameElement(currentFrame, el.id, { traceOffset: val })}
                      min={-50}
                      max={50}
                      step={1}
                      className="w-32"
                    />
                    <span className="text-xs">{el.traceOffset ?? 0}px</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Ingen elementer i keyframe {currentFrame + 1}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-center bg-white p-2 mb-4">
          <Button variant={tool === 'select' ? "default" : "outline"} size="sm" onClick={() => setTool('select')}>
            Select
          </Button>
          <Button variant={tool === 'player' ? "default" : "outline"} size="sm" onClick={() => setTool('player')}>
            Player
          </Button>
          <Button variant={tool === 'opponent' ? "default" : "outline"} size="sm" onClick={() => setTool('opponent')}>
            Opponent
          </Button>
          <Button variant={tool === 'ball' ? "default" : "outline"} size="sm" onClick={() => setTool('ball')}>
            Ball
          </Button>
          <Button variant={tool === 'cone' ? "default" : "outline"} size="sm" onClick={() => setTool('cone')}>
            Cone
          </Button>
          <Button variant={tool === 'line' ? "default" : "outline"} size="sm" onClick={() => setTool('line')}>
            Line
          </Button>
        </div>

        {tool === 'line' && (
          <LineStyleSelector
            lineStyleOptions={lineStyleOptions}
            selectedLineStyle={selectedLineStyle}
            setSelectedLineStyle={setSelectedLineStyle}
            curveOffset={curveOffset}
            setCurveOffset={setCurveOffset}
            getLineProperties={getLineProperties}
          />
        )}

        <div className="relative border rounded flex justify-center items-center overflow-hidden" style={{ 
          height: "calc(100vh - 220px)",
          width: "100%",
          maxWidth: pitch === 'full' ? "calc((100vh - 220px) * 0.647)" : "calc((100vh - 220px) * 1.295)",
          margin: "0 auto"
        }}>
          <svg
            ref={recordedSVGRef}
            className="w-full h-full"
            viewBox={`0 0 680 ${pitch === 'full' ? 1050 : 525}`}
            preserveAspectRatio="xMidYMid fit"
            xmlns="http://www.w3.org/2000/svg"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
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
                <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
              </marker>
              <marker id="endline" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
                <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="1" />
              </marker>
              <marker id="plus" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M 2,4 L 6,4 M 4,2 L 4,6" stroke="black" strokeWidth="1" />
              </marker>
              <marker id="xmark" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M 2,2 L 6,6 M 2,6 L 6,2" stroke="black" strokeWidth="1" />
              </marker>
            </defs>
            <rect x="0" y="0" width="680" height="1050" fill="white" />
            {getPitchTemplate()}
            {frames[currentFrame] && frames[currentFrame + 1] && renderTrace()}
            {(isRecording || (isPlaying && currentFrame < frames.length - 1) || (!isPlaying && progress === 1))
              ? interpolatedElements.map(renderElement)
              : (frames[currentFrame]?.elements ?? [])
                .filter(el => el.visible !== false)
                .map(renderElement)}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default FootballAnimator;