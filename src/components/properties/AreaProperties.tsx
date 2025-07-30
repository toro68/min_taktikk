import React from 'react';
import { AreaElement } from '../../@types/elements';
import { Slider } from '../ui/slider';

interface AreaPropertiesProps {
  area: AreaElement;
  updateElement: (updates: Partial<AreaElement>) => void;
}

const AreaProperties: React.FC<AreaPropertiesProps> = ({ area, updateElement }) => {
  // Provide default values for optional properties
  const color = area.color || '#ff0000';
  const opacity = area.opacity ?? 0.3;

  return (
    <div className="p-4 bg-white border-t">
      <h3 className="text-sm font-medium mb-3">Area Properties</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm mb-2 block">Farge</label>
          <input 
            type="color" 
            value={color.substring(0, 7)} // Handle hex color
            onChange={(e) => {
              updateElement({ color: e.target.value });
            }} 
            className="w-full h-8 rounded border cursor-pointer"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Gjennomsiktighet</label>
            <span className="text-xs">{Math.round(opacity * 100)}%</span>
          </div>
          <Slider 
            value={[opacity]} 
            min={0} 
            max={1} 
            step={0.05}
            onValueChange={([value]) => updateElement({ opacity: value })}
            className="mt-2"
          />
        </div>
        
        <div>
          <label className="text-sm mb-2 block">Label</label>
          <input 
            type="text" 
            value={area.label || ''} 
            onChange={(e) => {
              updateElement({ label: e.target.value });
            }} 
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="Skriv inn label..."
          />
        </div>
      </div>
    </div>
  );
};

export default AreaProperties;