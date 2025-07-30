import React from 'react';
import { Check } from 'lucide-react';
import { PREDEFINED_COLORS } from '../../constants/colors';

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  onColorChange,
}) => {
  return (
    <div className="flex items-center gap-1 p-2 bg-white border-t">
      <span className="text-xs text-gray-600 mr-2">Farge:</span>
      <div className="flex gap-1">
        {PREDEFINED_COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={`
              w-6 h-6 rounded-full border-2 transition-colors flex items-center justify-center
              ${selectedColor === color.value 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-300 hover:border-gray-500'
              }
            `}
            style={{ backgroundColor: color.hex }}
            title={color.label}
          >
            {selectedColor === color.value && (
              <Check size={12} className="text-white drop-shadow-lg" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};