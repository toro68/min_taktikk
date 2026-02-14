import { Tool } from '../@types/elements';

// Type definitions for config file
export interface ToolButtonConfig {
  key: string;
  icon: string;
  label?: string;
  tooltip: string;
}

export interface ColorConfig {
  key: string;
  label: string;
  value: string;
}

export interface BaseStyleConfig {
  key: string;
  label: string;
  description: string;
}

export interface ModifierConfig {
  label: string;
  description?: string;
  options?: Array<{
    key: string;
    label: string;
  }>;
}

export interface ProfessionalStyleConfig {
  label: string;
  description: string;
  icon: string;
  strokeWidth?: number;
  dashed?: boolean;
  dashArray?: string;
  curved?: boolean;
  marker?: string;
  doubleLines?: boolean;
  sineWave?: boolean;
}

export interface CategoryConfig {
  label: string;
  styles: string[];
}

export interface LineStyleConfig {
  simplified: boolean;
  baseStyles: BaseStyleConfig[];
  professionalStyles?: {
    player: { [key: string]: ProfessionalStyleConfig };
    ball: { [key: string]: ProfessionalStyleConfig };
    tactical: { [key: string]: ProfessionalStyleConfig };
  };
  modifiers: {
    dashed: ModifierConfig;
    arrow: ModifierConfig;
    endMarker: ModifierConfig;
    hookDirection: ModifierConfig;
  };
  curveRange: {
    min: number;
    max: number;
    step: number;
  };
  colors: ColorConfig[];
  markers?: { key: string | null; icon: string; label: string; }[];
}

export interface KeyframeConfig {
  features: {
    downloadPng: {
      enabled: boolean;
      tooltip: string;
    };
  };
}

export interface TraceFeatureConfig {
  enabled?: boolean;
  opacity?: number;
  style?: string;
}

export interface TracesConfig {
  enabled: boolean;
  description?: string;
  curveRange: {
    min: number;
    max: number;
    step: number;
  };
  features?: {
    playerTraces?: TraceFeatureConfig;
    opponentTraces?: TraceFeatureConfig;
    ballTraces?: TraceFeatureConfig;
  };
}

export interface GuidelinesConfig {
  modes: string[];
}

export interface UIThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

export interface UIAnimationsConfig {
  enabled: boolean;
  duration: number;
}

export interface UIConfig {
  theme: UIThemeConfig;
  animations: UIAnimationsConfig;
}

export interface ExportPresetsConfig {
  png?: {
    scale?: number;
    background?: string;
  };
  gif?: {
    frameDuration?: number;
    quality?: number;
  };
  mp4?: {
    frameDuration?: number;
    fps?: number;
    crf?: number;
    preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium';
    audioBitrate?: string;
  };
}

export interface ToolbarGroupConfig {
  label?: string;
  collapsed?: boolean;
  buttons: ToolButtonConfig[];
}

export interface ToolbarSectionConfig {
  label?: string;
  compact?: boolean;
  grouped?: boolean;
  buttons?: ToolButtonConfig[];
  groups?: {
    [key: string]: ToolbarGroupConfig;
  };
}

export interface ToolbarConfig {
  layout: string;
  bottom?: ToolbarSectionConfig;
  top?: ToolbarSectionConfig;
  contextual?: {
    [key: string]: {
      position: string;
      expanded: boolean;
      compact?: boolean;
      showLabels?: boolean;
      controls: string[];
      styles?: string[]; // Added styles array for direct style selection
      categories?: { [key: string]: CategoryConfig };
    };
  };
}

export interface AppConfig {
  version: string;
  settings: {
    toolbar: ToolbarConfig;
    lineStyles: LineStyleConfig;
    keyframes: KeyframeConfig;
    traces: TracesConfig;
    pitchTypes: string[];
    guidelines: GuidelinesConfig;
    exportPresets?: ExportPresetsConfig;
    ui?: UIConfig; // Optional for backward compatibility
  };
}

// Default configuration (fallback)
const defaultConfig: AppConfig = {
  version: "1.0",
  settings: {
    toolbar: {
      layout: "split",
      bottom: {
        label: "Hovedverktøy",
        compact: true,
        buttons: [
          {
            key: "select",
            icon: "MousePointer",
            label: "Velg",
            tooltip: "Velg og flytt elementer"
          },
          {
            key: "player",
            icon: "User",
            label: "Spiller",
            tooltip: "Legg til spiller"
          },
          {
            key: "opponent",
            icon: "Users",
            label: "Motspiller",
            tooltip: "Legg til motstander"
          },
          {
            key: "ball",
            icon: "Volleyball",
            label: "Ball",
            tooltip: "Legg til ball"
          },
          {
            key: "cone",
            icon: "Cone",
            label: "Kjegle",
            tooltip: "Legg til kjegle"
          },
          {
            key: "line",
            icon: "PenTool",
            label: "Linje",
            tooltip: "Tegn linje eller pil"
          },
          {
            key: "text",
            icon: "Type",
            label: "Tekst",
            tooltip: "Legg til tekst"
          },
          {
            key: "area",
            icon: "Square",
            label: "Område",
            tooltip: "Merk et område på banen"
          },
          {
            key: "togglePitch",
            icon: "SquareDashedBottom",
            label: "Bytt bane",
            tooltip: "Bytt banevisning"
          }
        ]
      },
      top: {
        label: "Animasjon og eksport",
        grouped: true,
        groups: {
          animation: {
            buttons: [
              {
                key: "playPause",
                icon: "Play",
                label: "Start/Pause",
                tooltip: "Start eller pause animasjonen"
              },
              {
                key: "rewind",
                icon: "SkipBack",
                label: "Spol tilbake",
                tooltip: "Spol tilbake til start"
              },
              {
                key: "addKeyframe",
                icon: "Plus",
                label: "Ny keyframe",
                tooltip: "Legg til ny keyframe"
              }
            ]
          },
          export: {
            buttons: [
              {
                key: "downloadJson",
                icon: "Download",
                label: "Lagre",
                tooltip: "Lagre animasjon som JSON"
              },
              {
                key: "downloadPng",
                icon: "Image",
                label: "PNG",
                tooltip: "Last ned som PNG"
              },
              {
                key: "downloadSvg",
                icon: "Download",
                label: "SVG",
                tooltip: "Last ned som SVG"
              },
              {
                key: "downloadFilm",
                icon: "Film",
                label: "Video",
                tooltip: "Eksporter som video"
              },
              {
                key: "downloadGif",
                icon: "FileImage",
                label: "GIF",
                tooltip: "Last ned som GIF"
              },
              {
                key: "loadAnimation",
                icon: "Upload",
                label: "Last inn",
                tooltip: "Last inn JSON-animasjon"
              },
              {
                key: "loadExample",
                icon: "BookOpen",
                label: "Eksempel",
                tooltip: "Last inn eksempel-animasjon"
              }
            ]
          }
        }
      },
      contextual: {
        line: {
          position: "bottom",
          expanded: true,
          compact: true,
          showLabels: false,
          controls: ["style", "curve", "color"],
          styles: [
            "solidStraight",
            "solidCurved", 
            "straightArrow",
            "curvedArrow",
            "dashedStraight",
            "dashedCurved",
            "sineWave",
            "sineWaveArrow"
          ]
        }
      }
    },
    lineStyles: {
      simplified: true,
      baseStyles: [
        {
          key: "straight",
          label: "Rett linje",
          description: "Rett linje mellom to punkter"
        },
        {
          key: "curved",
          label: "Kurvet linje",
          description: "Kurvet linje med justerbar buning"
        },
        {
          key: "sineWave",
          label: "Sinusbølge",
          description: "Bølgeformet linje"
        },
        {
          key: "fishHook",
          label: "Fiskekrok",
          description: "Linje med krok på slutten"
        },
        {
          key: "hook",
          label: "Krok",
          description: "Linje med krok i start eller slutt"
        }
      ],
      professionalStyles: {
        player: {
          playerRun: {
            label: "Spillerløp",
            description: "Standard løp uten ball",
            icon: "TrendingUp",
            strokeWidth: 2
          },
          playerSprint: {
            label: "Sprint",
            description: "Høy hastighet løp",
            icon: "Zap", 
            strokeWidth: 3,
            dashed: true,
            dashArray: "8,4"
          },
          playerRotation: {
            label: "Rotasjon",
            description: "Roterende bevegelse",
            icon: "RotateCcw",
            curved: true
          },
          playerWalk: {
            label: "Gange",
            description: "Lav hastighet bevegelse",
            icon: "Footprints",
            strokeWidth: 1,
            dashed: true,
            dashArray: "4,8"
          },
          playerOverlap: {
            label: "Overlapping",
            description: "Overlappende løp",
            icon: "ArrowRightLeft",
            strokeWidth: 2,
            doubleLines: true
          }
        },
        ball: {
          ballShortPass: {
            label: "Kort passing",
            description: "Kort passing på bakken",
            icon: "ArrowRight",
            strokeWidth: 2,
            marker: "smallArrow"
          },
          ballLongPass: {
            label: "Lang passing",
            description: "Lang passing eller cross",
            icon: "ArrowBigRight",
            strokeWidth: 3,
            marker: "arrow"
          },
          ballLob: {
            label: "Lob",
            description: "Lob eller chip",
            icon: "TrendingUp",
            curved: true,
            strokeWidth: 2,
            marker: "arrow"
          },
          ballShot: {
            label: "Skudd",
            description: "Skudd mot mål",
            icon: "Target",
            strokeWidth: 4,
            marker: "target"
          },
          ballDribble: {
            label: "Dribling",
            description: "Dribling med ball",
            icon: "Shuffle",
            sineWave: true,
            strokeWidth: 2
          },
          ballHeader: {
            label: "Heading",
            description: "Heading eller nick",
            icon: "Circle",
            strokeWidth: 2,
            marker: "circle"
          }
        },
        tactical: {
          offsideLine: {
            label: "Offside-linje",
            description: "Offside-linje",
            icon: "Minus",
            strokeWidth: 3,
            dashed: true,
            dashArray: "10,5"
          },
          pressingLine: {
            label: "Pressing-linje",
            description: "Pressingretning",
            icon: "ArrowBigUp",
            strokeWidth: 3,
            marker: "doubleArrow"
          },
          defensiveLine: {
            label: "Forsvarslinje",
            description: "Defensive posisjoner",
            icon: "Shield",
            strokeWidth: 4
          },
          zonalMarking: {
            label: "Sonemarkering",
            description: "Sonemarkering",
            icon: "Square",
            strokeWidth: 2,
            dashed: true,
            dashArray: "6,6"
          },
          passingOption: {
            label: "Pasningsalternativ",
            description: "Mulig pasning",
            icon: "GitBranch",
            strokeWidth: 1,
            dashed: true,
            dashArray: "3,6"
          }
        }
      },
      modifiers: {
        dashed: {
          label: "Stripet",
          description: "Gjør linjen stripet"
        },
        arrow: {
          label: "Pil",
          description: "Legg til pil på slutten"
        },
        endMarker: {
          label: "Slutt-markør",
          options: [
            { key: "none", label: "Ingen" },
            { key: "endline", label: "Endestrek" },
            { key: "plus", label: "Pluss" },
            { key: "xmark", label: "Kryss" }
          ]
        },
        hookDirection: {
          label: "Krok-retning",
          options: [
            { key: "start", label: "Start" },
            { key: "end", label: "Slutt" }
          ]
        }
      },
      curveRange: {
        min: -400,
        max: 400,
        step: 10
      },
      colors: [
        {
          key: "black",
          label: "Svart",
          value: "#000000"
        },
        {
          key: "red",
          label: "Rød",
          value: "#ff0000"
        },
        {
          key: "blue",
          label: "Blå",
          value: "#0000ff"
        },
        {
          key: "green",
          label: "Grønn",
          value: "#008000"
        },
        {
          key: "orange",
          label: "Oransje",
          value: "#ffa500"
        },
        {
          key: "purple",
          label: "Lilla",
          value: "#800080"
        },
        {
          key: "yellow",
          label: "Gul",
          value: "#ffff00"
        },
        {
          key: "custom",
          label: "Egendefinert",
          value: "custom"
        }
      ]
    },
    keyframes: {
      features: {
        downloadPng: {
          enabled: true,
          tooltip: "Last ned keyframe som PNG"
        }
      }
    },
    traces: {
      enabled: true,
      curveRange: {
        min: -400,
        max: 400,
        step: 10
      }
    },
    pitchTypes: [
      "offensive",
      "defensive", 
      "handball",
      "full",
      "fullLandscape",
      "blankPortrait",
      "blankLandscape"
    ],
    guidelines: {
      modes: ["lines", "colors", "full"]
    },
    exportPresets: {
      png: {
        scale: 2,
        background: "#ffffff"
      },
      gif: {
        frameDuration: 600,
        quality: 10
      },
      mp4: {
        frameDuration: 600,
        fps: 30,
        crf: 23,
        preset: 'veryfast',
        audioBitrate: '128k'
      }
    },
    ui: {
      theme: {
        primaryColor: "#3b82f6",
        secondaryColor: "#64748b",
        successColor: "#10b981",
        warningColor: "#f59e0b",
        errorColor: "#ef4444"
      },
      animations: {
        enabled: true,
        duration: 200
      }
    }
  }
};

// Configuration from .aigenrc (built-in to avoid HTTP fetch issues)
const aigenrcConfig: AppConfig = {
  "version": "1.1",
  "settings": {
    "toolbar": {
      "layout": "split",
      "bottom": {
        "label": "Hovedverktøy",
        "compact": true,
        "buttons": [
          {
            "key": "select",
            "icon": "MousePointer",
            "tooltip": "Velg og flytt elementer"
          },
          {
            "key": "player",
            "icon": "User",
            "tooltip": "Legg til spiller"
          },
          {
            "key": "opponent",
            "icon": "Users",
            "tooltip": "Legg til motstander"
          },
          {
            "key": "ball",
            "icon": "Volleyball",
            "tooltip": "Legg til ball"
          },
          {
            "key": "cone",
            "icon": "Cone",
            "tooltip": "Legg til kjegle"
          },
          {
            "key": "line",
            "icon": "PenTool",
            "tooltip": "Tegn linje eller pil"
          },
          {
            "key": "text",
            "icon": "Type",
            "tooltip": "Legg til tekst"
          },
          {
            "key": "area",
            "icon": "Square",
            "tooltip": "Merk et område på banen"
          },
          {
            "key": "togglePitch",
            "icon": "SquareDashedBottom",
            "tooltip": "Bytt banevisning"
          }
        ]
      },
      "top": {
        "label": "Animasjon og eksport",
        "grouped": true,
        "groups": {
          "animation": {
            "buttons": [
              {
                "key": "playPause",
                "icon": "Play",
                "label": "Start/Pause",
                "tooltip": "Start eller pause animasjonen"
              },
              {
                "key": "rewind",
                "icon": "SkipBack",
                "label": "Spol tilbake",
                "tooltip": "Spol tilbake til start"
              },
              {
                "key": "addKeyframe",
                "icon": "Plus",
                "label": "Ny keyframe",
                "tooltip": "Legg til ny keyframe"
              }
            ]
          },
          "export": {
            "buttons": [
              {
                "key": "downloadJson",
                "icon": "Download",
                "label": "Lagre",
                "tooltip": "Lagre animasjon som JSON"
              },
              {
                "key": "downloadPng",
                "icon": "Image",
                "label": "PNG",
                "tooltip": "Last ned som PNG"
              },
              {
                "key": "downloadSvg",
                "icon": "Download",
                "label": "SVG",
                "tooltip": "Last ned som SVG"
              },
              {
                "key": "downloadFilm",
                "icon": "Film",
                "label": "Video",
                "tooltip": "Eksporter som video"
              },
              {
                "key": "downloadGif",
                "icon": "FileImage",
                "label": "GIF",
                "tooltip": "Last ned som GIF"
              },
              {
                "key": "loadAnimation",
                "icon": "Upload",
                "label": "Last inn",
                "tooltip": "Last inn JSON-animasjon"
              },
              {
                "key": "loadExample",
                "icon": "BookOpen",
                "label": "Eksempel",
                "tooltip": "Last inn eksempel-animasjon"
              },
              {
                "key": "loadSvgTemplate",
                "icon": "Upload",
                "label": "SVG",
                "tooltip": "Last inn SVG-mal"
              }
            ]
          }
        }
      },
      "contextual": {
        "line": {
          "position": "bottom",
          "expanded": true,
          "compact": true,
          "showLabels": false,
          "controls": ["style", "curve", "color"],
          "styles": [
            "solidStraight",
            "solidCurved", 
            "straightArrow",
            "curvedArrow",
            "dashedStraight",
            "dashedCurved",
            "sineWave",
            "sineWaveArrow"
          ]
        }
      }
    },
    "lineStyles": {
      "simplified": true,
      "baseStyles": [
        {
          "key": "straight",
          "label": "Rett linje",
          "description": "Rett linje mellom to punkter"
        },
        {
          "key": "curved",
          "label": "Kurvet linje", 
          "description": "Kurvet linje med justerbar buning"
        },
        {
          "key": "sineWave",
          "label": "Sinusbølge",
          "description": "Bølgeformet linje"
        },
        {
          "key": "fishHook",
          "label": "Fiskekrok",
          "description": "Linje med krok på slutten"
        },
        {
          "key": "hook",
          "label": "Krok",
          "description": "Linje med krok i start eller slutt"
        }
      ],
      "modifiers": {
        "dashed": {
          "label": "Stripet",
          "description": "Gjør linjen stripet"
        },
        "arrow": {
          "label": "Pil",
          "description": "Legg til pil på slutten"
        },
        "endMarker": {
          "label": "Slutt-markør",
          "options": [
            { "key": "none", "label": "Ingen" },
            { "key": "endline", "label": "Endestrek" },
            { "key": "plus", "label": "Pluss" },
            { "key": "xmark", "label": "Kryss" },
            { "key": "target", "label": "Mål" },
            { "key": "circle", "label": "Sirkel" }
          ]
        },
        "hookDirection": {
          "label": "Krok-retning",
          "options": [
            { "key": "start", "label": "Start" },
            { "key": "end", "label": "Slutt" }
          ]
        }
      },
      "curveRange": {
        "min": -400,
        "max": 400,
        "step": 10
      },
      "colors": [
        {
          "key": "black",
          "label": "Svart",
          "value": "#000000"
        },
        {
          "key": "red",
          "label": "Rød",
          "value": "#ff0000"
        },
        {
          "key": "blue",
          "label": "Blå",
          "value": "#0000ff"
        },
        {
          "key": "green",
          "label": "Grønn",
          "value": "#008000"
        },
        {
          "key": "orange",
          "label": "Oransje",
          "value": "#ffa500"
        },
        {
          "key": "purple",
          "label": "Lilla",
          "value": "#800080"
        },
        {
          "key": "yellow",
          "label": "Gul",
          "value": "#ffff00"
        },
        {
          "key": "custom",
          "label": "Egendefinert",
          "value": "custom"
        }
      ]
    },
    "keyframes": {
      "features": {
        "downloadPng": {
          "enabled": true,
          "tooltip": "Last ned keyframe som PNG"
        }
      }
    },
    "traces": {
      "enabled": true,
      "curveRange": {
        "min": -400,
        "max": 400,
        "step": 10
      }
    },
    "pitchTypes": [
      "offensive",
      "defensive", 
      "handball",
      "full",
      "fullLandscape",
      "blankPortrait",
      "blankLandscape"
    ],
    "guidelines": {
      "modes": ["lines", "colors", "full"]
    },
    "exportPresets": {
      "png": {
        "scale": 2,
        "background": "#ffffff"
      },
      "gif": {
        "frameDuration": 600,
        "quality": 10
      },
      "mp4": {
        "frameDuration": 600,
        "fps": 30,
        "crf": 23,
        "preset": "veryfast",
        "audioBitrate": "128k"
      }
    },
    "ui": {
      "theme": {
        "primaryColor": "#3b82f6",
        "secondaryColor": "#64748b",
        "successColor": "#10b981",
        "warningColor": "#f59e0b",
        "errorColor": "#ef4444"
      },
      "animations": {
        "enabled": true,
        "duration": 200
      }
    }
  }
};

let cachedConfig: AppConfig | null = null;
let configValidationWarnings: string[] = [];

const ALLOWED_MP4_PRESETS = ['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium'] as const;

const isRecord = (value: unknown): value is Record<string, any> => {
  return typeof value === 'object' && value !== null;
};

const toPositiveNumber = (value: unknown): number | null => {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;
};

const toBoolean = (value: unknown): boolean | null => {
  return typeof value === 'boolean' ? value : null;
};

const cloneDefaultConfig = (): AppConfig => {
  return JSON.parse(JSON.stringify(defaultConfig)) as AppConfig;
};

const sanitizeCurveRange = (
  input: unknown,
  fallback: { min: number; max: number; step: number },
  fieldPath: string,
  warnings: string[]
) => {
  if (!isRecord(input)) {
    warnings.push(`${fieldPath} mangler eller er ugyldig, bruker standardverdier.`);
    return fallback;
  }

  const min = typeof input.min === 'number' && Number.isFinite(input.min) ? input.min : fallback.min;
  const max = typeof input.max === 'number' && Number.isFinite(input.max) ? input.max : fallback.max;
  const step = typeof input.step === 'number' && Number.isFinite(input.step) && input.step > 0
    ? input.step
    : fallback.step;

  if (min >= max) {
    warnings.push(`${fieldPath} har ugyldig intervall (min >= max), bruker standardverdier.`);
    return fallback;
  }

  return { min, max, step };
};

export const validateAndSanitizeConfig = (input: unknown): { config: AppConfig; warnings: string[] } => {
  const warnings: string[] = [];
  const sanitized = cloneDefaultConfig();

  if (!isRecord(input)) {
    warnings.push('Konfigurasjonsroten er ugyldig, bruker standardkonfigurasjon.');
    return { config: sanitized, warnings };
  }

  if (typeof input.version === 'string') {
    sanitized.version = input.version;
  } else {
    warnings.push('Feltet version er ugyldig eller mangler, bruker standardverdi.');
  }

  const rawSettings = input.settings;
  if (!isRecord(rawSettings)) {
    warnings.push('Feltet settings er ugyldig eller mangler, bruker standardinnstillinger.');
    return { config: sanitized, warnings };
  }

  if (isRecord(rawSettings.toolbar)) {
    sanitized.settings.toolbar = {
      ...sanitized.settings.toolbar,
      ...rawSettings.toolbar,
    };
  } else {
    warnings.push('settings.toolbar er ugyldig, bruker standardverdi.');
  }

  if (isRecord(rawSettings.lineStyles)) {
    sanitized.settings.lineStyles = {
      ...sanitized.settings.lineStyles,
      ...rawSettings.lineStyles,
      curveRange: sanitizeCurveRange(
        rawSettings.lineStyles.curveRange,
        sanitized.settings.lineStyles.curveRange,
        'settings.lineStyles.curveRange',
        warnings
      ),
      colors: Array.isArray(rawSettings.lineStyles.colors) && rawSettings.lineStyles.colors.length > 0
        ? rawSettings.lineStyles.colors.filter(
            (color: any) => isRecord(color) && typeof color.value === 'string' && color.value.length > 0
          )
        : sanitized.settings.lineStyles.colors,
    };

    if (!Array.isArray(rawSettings.lineStyles.colors) || rawSettings.lineStyles.colors.length === 0) {
      warnings.push('settings.lineStyles.colors er ugyldig eller tom, bruker standardfarger.');
    }
  } else {
    warnings.push('settings.lineStyles er ugyldig, bruker standardverdi.');
  }

  if (isRecord(rawSettings.keyframes)) {
    sanitized.settings.keyframes = {
      ...sanitized.settings.keyframes,
      ...rawSettings.keyframes,
    };
  } else {
    warnings.push('settings.keyframes er ugyldig, bruker standardverdi.');
  }

  if (isRecord(rawSettings.traces)) {
    const rawTraces = rawSettings.traces;
    sanitized.settings.traces = {
      ...sanitized.settings.traces,
      ...rawTraces,
      enabled: toBoolean(rawTraces.enabled) ?? sanitized.settings.traces.enabled,
      curveRange: sanitizeCurveRange(
        rawTraces.curveRange,
        sanitized.settings.traces.curveRange,
        'settings.traces.curveRange',
        warnings
      ),
    };
  } else {
    warnings.push('settings.traces er ugyldig, bruker standardverdi.');
  }

  if (Array.isArray(rawSettings.pitchTypes) && rawSettings.pitchTypes.every((pitchType) => typeof pitchType === 'string')) {
    sanitized.settings.pitchTypes = rawSettings.pitchTypes;
  } else {
    warnings.push('settings.pitchTypes er ugyldig, bruker standardverdi.');
  }

  if (isRecord(rawSettings.guidelines) && Array.isArray(rawSettings.guidelines.modes)) {
    sanitized.settings.guidelines = {
      ...sanitized.settings.guidelines,
      ...rawSettings.guidelines,
      modes: rawSettings.guidelines.modes.filter((mode: any) => typeof mode === 'string'),
    };
  } else {
    warnings.push('settings.guidelines er ugyldig, bruker standardverdi.');
  }

  if (isRecord(rawSettings.exportPresets)) {
    const rawExportPresets = rawSettings.exportPresets;
    const fallbackPresets = sanitized.settings.exportPresets;

    const pngScale = toPositiveNumber(rawExportPresets.png?.scale);
    const gifDuration = toPositiveNumber(rawExportPresets.gif?.frameDuration);
    const gifQuality = toPositiveNumber(rawExportPresets.gif?.quality);
    const mp4Duration = toPositiveNumber(rawExportPresets.mp4?.frameDuration);
    const mp4Fps = toPositiveNumber(rawExportPresets.mp4?.fps);
    const mp4Crf = toPositiveNumber(rawExportPresets.mp4?.crf);
    const mp4Preset = typeof rawExportPresets.mp4?.preset === 'string' &&
      (ALLOWED_MP4_PRESETS as readonly string[]).includes(rawExportPresets.mp4.preset)
      ? rawExportPresets.mp4.preset
      : fallbackPresets?.mp4?.preset;

    sanitized.settings.exportPresets = {
      png: {
        scale: pngScale ?? fallbackPresets?.png?.scale,
        background: typeof rawExportPresets.png?.background === 'string'
          ? rawExportPresets.png.background
          : fallbackPresets?.png?.background,
      },
      gif: {
        frameDuration: gifDuration ?? fallbackPresets?.gif?.frameDuration,
        quality: gifQuality ?? fallbackPresets?.gif?.quality,
      },
      mp4: {
        frameDuration: mp4Duration ?? fallbackPresets?.mp4?.frameDuration,
        fps: mp4Fps ?? fallbackPresets?.mp4?.fps,
        crf: mp4Crf ?? fallbackPresets?.mp4?.crf,
        preset: mp4Preset,
        audioBitrate: typeof rawExportPresets.mp4?.audioBitrate === 'string'
          ? rawExportPresets.mp4.audioBitrate
          : fallbackPresets?.mp4?.audioBitrate,
      },
    };
  }

  if (isRecord(rawSettings.ui)) {
    const rawUI = rawSettings.ui;
    sanitized.settings.ui = {
      theme: {
        primaryColor: typeof rawUI.theme?.primaryColor === 'string'
          ? rawUI.theme.primaryColor
          : sanitized.settings.ui?.theme.primaryColor || defaultConfig.settings.ui!.theme.primaryColor,
        secondaryColor: typeof rawUI.theme?.secondaryColor === 'string'
          ? rawUI.theme.secondaryColor
          : sanitized.settings.ui?.theme.secondaryColor || defaultConfig.settings.ui!.theme.secondaryColor,
        successColor: typeof rawUI.theme?.successColor === 'string'
          ? rawUI.theme.successColor
          : sanitized.settings.ui?.theme.successColor || defaultConfig.settings.ui!.theme.successColor,
        warningColor: typeof rawUI.theme?.warningColor === 'string'
          ? rawUI.theme.warningColor
          : sanitized.settings.ui?.theme.warningColor || defaultConfig.settings.ui!.theme.warningColor,
        errorColor: typeof rawUI.theme?.errorColor === 'string'
          ? rawUI.theme.errorColor
          : sanitized.settings.ui?.theme.errorColor || defaultConfig.settings.ui!.theme.errorColor,
      },
      animations: {
        enabled: toBoolean(rawUI.animations?.enabled)
          ?? sanitized.settings.ui?.animations.enabled
          ?? defaultConfig.settings.ui!.animations.enabled,
        duration: toPositiveNumber(rawUI.animations?.duration)
          ?? sanitized.settings.ui?.animations.duration
          ?? defaultConfig.settings.ui!.animations.duration,
      }
    };
  } else if (rawSettings.ui !== undefined) {
    warnings.push('settings.ui er ugyldig, bruker standardverdi.');
  }

  return { config: sanitized, warnings };
};

// Function to load configuration
export const loadConfig = async (): Promise<AppConfig> => {
  if (cachedConfig) {
    return cachedConfig;
  }

  // Use the built-in .aigenrc configuration
  const { config, warnings } = validateAndSanitizeConfig(aigenrcConfig);
  configValidationWarnings = warnings;
  if (warnings.length > 0) {
    console.warn('Konfigurasjonsvalidering fant avvik. Fallbacks ble brukt:', warnings);
  }
  cachedConfig = config;
  return config;
};

// Function to get config synchronously (returns default if not loaded)
export const getConfig = (): AppConfig => {
  return cachedConfig || defaultConfig;
};

// Function to clear cache (useful for testing or hot reloading)
export const clearConfigCache = (): void => {
  cachedConfig = null;
  configValidationWarnings = [];
};

export const getConfigValidationWarnings = (): string[] => {
  return [...configValidationWarnings];
};

// Helper functions to get specific config sections
export const getToolbarConfig = (): ToolbarConfig => {
  return getConfig().settings.toolbar;
};

export const getLineStylesConfig = (): LineStyleConfig => {
  return getConfig().settings.lineStyles;
};

export const getKeyframesConfig = (): KeyframeConfig => {
  return getConfig().settings.keyframes;
};

export const getTracesConfig = (): TracesConfig => {
  return getConfig().settings.traces;
};

export const getPitchTypes = (): string[] => {
  return getConfig().settings.pitchTypes;
};

export const getGuidelinesConfig = (): GuidelinesConfig => {
  return getConfig().settings.guidelines;
};

export const getExportPresets = (): ExportPresetsConfig | null => {
  return getConfig().settings.exportPresets || null;
};

export const getUIConfig = (): UIConfig | null => {
  return getConfig().settings.ui || null;
};
