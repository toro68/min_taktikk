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

export interface TracesConfig {
  enabled: boolean;
  curveRange: {
    min: number;
    max: number;
    step: number;
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

// Function to load configuration
export const loadConfig = async (): Promise<AppConfig> => {
  if (cachedConfig) {
    return cachedConfig;
  }

  // Use the built-in .aigenrc configuration
  cachedConfig = aigenrcConfig;
  console.log('✅ Loaded configuration from built-in .aigenrc');
  return aigenrcConfig;
};

// Function to get config synchronously (returns default if not loaded)
export const getConfig = (): AppConfig => {
  return cachedConfig || defaultConfig;
};

// Function to clear cache (useful for testing or hot reloading)
export const clearConfigCache = (): void => {
  cachedConfig = null;
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

export const getUIConfig = (): UIConfig | null => {
  return getConfig().settings.ui || null;
};
