import { Tool } from '../@types/elements';
import { getToolbarConfig } from '../lib/config';
import { getIconComponent } from '../lib/iconMap';

// Get tool definitions from configuration
const getToolsFromConfig = () => {
  const config = getToolbarConfig();
  
  // Filter to only include basic tools (not animation controls)
  const basicTools = ['select', 'player', 'opponent', 'ball', 'cone', 'line', 'text', 'area'];
  
  // Get buttons from bottom toolbar
  const buttons = config.bottom?.buttons || [];
  
  return buttons
    .filter((button: any) => basicTools.includes(button.key))
    .map((button: any) => ({
      key: button.key as Tool,
      icon: getIconComponent(button.icon),
      label: button.label || button.key,
      shortcut: getDefaultShortcut(button.key),
      tooltip: button.tooltip
    }));
};

// Default shortcuts mapping
const getDefaultShortcut = (key: string): string => {
  const shortcuts: Record<string, string> = {
    'select': 'V',
    'player': 'P',
    'opponent': 'O',
    'ball': 'B',
    'cone': 'C',
    'line': 'L',
    'text': 'X',
    'area': 'A'
  };
  return shortcuts[key] || '';
};

// Default tool definitions as fallback
const defaultToolDefinitions = [
  { 
    key: 'select' as Tool, 
    icon: getIconComponent('MousePointer'), 
    label: 'Velg', 
    shortcut: 'V',
    tooltip: 'Velg og flytt elementer'
  },
  { 
    key: 'player' as Tool, 
    icon: getIconComponent('User'), 
    label: 'Spiller', 
    shortcut: 'P',
    tooltip: 'Legg til spiller'
  },
  { 
    key: 'opponent' as Tool, 
    icon: getIconComponent('Users'), 
    label: 'Motspiller', 
    shortcut: 'O',
    tooltip: 'Legg til motstander'
  },
  { 
    key: 'ball' as Tool, 
    icon: getIconComponent('Volleyball'), 
    label: 'Ball', 
    shortcut: 'B',
    tooltip: 'Legg til ball'
  },
  { 
    key: 'cone' as Tool, 
    icon: getIconComponent('Cone'), 
    label: 'Kjegle', 
    shortcut: 'C',
    tooltip: 'Legg til kjegle'
  },
  { 
    key: 'line' as Tool, 
    icon: getIconComponent('PenTool'), 
    label: 'Linje', 
    shortcut: 'L',
    tooltip: 'Tegn linje eller pil'
  },
  { 
    key: 'text' as Tool, 
    icon: getIconComponent('Type'), 
    label: 'Tekst', 
    shortcut: 'X',
    tooltip: 'Legg til tekst'
  },
  { 
    key: 'area' as Tool, 
    icon: getIconComponent('Square'), 
    label: 'Område', 
    shortcut: 'A',
    tooltip: 'Merk et område på banen'
  }
];

export const TOOL_DEFINITIONS = (() => {
  try {
    return getToolsFromConfig();
  } catch (error) {
    console.warn('Using default tool definitions due to config error:', error);
    return defaultToolDefinitions;
  }
})();