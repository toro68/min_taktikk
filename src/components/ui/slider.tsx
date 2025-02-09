import React from 'react';

export const Slider = ({
  value,
  onValueChange,
  min,
  max,
  step,
  className = ""
}: {
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      className={`slider ${className}`}
    />
  );
}; 