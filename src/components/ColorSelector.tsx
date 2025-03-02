import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Predefinerte farger som kan brukes
const predefinedColors = [
  { value: 'black', label: 'Svart', hex: '#000000' },
  { value: 'red', label: 'Rød', hex: '#ff0000' },
  { value: 'blue', label: 'Blå', hex: '#0000ff' },
  { value: 'green', label: 'Grønn', hex: '#008000' },
  { value: 'orange', label: 'Oransje', hex: '#ffa500' },
  { value: 'purple', label: 'Lilla', hex: '#800080' },
];

interface ColorSelectorProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
}) => {
  // Håndterer endring av egendefinert farge
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setSelectedColor('custom'); // Sett valgt farge til 'custom' når brukeren endrer fargeverdien
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="p-4 border rounded bg-white mb-4">
        <h3 className="text-sm font-semibold mb-2">Linjefarge</h3>
        
        {/* Predefinerte farger */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {predefinedColors.map(color => (
            <Tooltip key={color.value}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSelectedColor(color.value)}
                  className={`flex flex-col items-center p-2 border rounded hover:bg-gray-50 ${
                    selectedColor === color.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-full mb-1" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs">{color.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
                <div className="flex flex-col">
                  <p className="text-[10px] font-medium">{color.label}</p>
                  <p className="text-[9px] text-gray-300">Klikk for å velge farge</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        {/* Egendefinert farge */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSelectedColor('custom')}
                className={`flex items-center p-2 border rounded hover:bg-gray-50 ${
                  selectedColor === 'custom' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div 
                  className="w-6 h-6 rounded-full mr-2" 
                  style={{ backgroundColor: customColor }}
                />
                <span className="text-xs">Egendefinert</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={2} className="py-0.5 px-1.5 bg-black/90 text-white border-0">
              <div className="flex flex-col">
                <p className="text-[10px] font-medium">Egendefinert farge</p>
                <p className="text-[9px] text-gray-300">Velg din egen farge</p>
              </div>
            </TooltipContent>
          </Tooltip>
          
          <input 
            type="color" 
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ColorSelector; 