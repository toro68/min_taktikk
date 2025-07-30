import { getLineStylesConfig } from '../lib/config';

// Get colors from configuration
const getColorsFromConfig = () => {
  const config = getLineStylesConfig();
  return config.colors.map(color => ({
    value: color.key,
    label: color.label,
    hex: color.value === 'custom' ? '#000000' : color.value
  }));
};

// Default colors as fallback
const defaultColors = [
  { value: 'black', label: 'Svart', hex: '#000000' },
  { value: 'red', label: 'Rød', hex: '#ff0000' },
  { value: 'blue', label: 'Blå', hex: '#0000ff' },
  { value: 'green', label: 'Grønn', hex: '#008000' },
  { value: 'orange', label: 'Oransje', hex: '#ffa500' },
  { value: 'purple', label: 'Lilla', hex: '#800080' },
];

export const PREDEFINED_COLORS = (() => {
  try {
    return getColorsFromConfig();
  } catch (error) {
    console.warn('Using default colors due to config error:', error);
    return defaultColors;
  }
})();