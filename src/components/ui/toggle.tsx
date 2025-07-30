import React from 'react';

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, onPressedChange, children, onClick, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
    // A simple visual representation for the pressed state.
    const variantClasses = pressed ? "bg-gray-200" : "bg-transparent";
    
    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${className || ''}`}
        onClick={(e) => {
          if (onPressedChange) {
            onPressedChange(!pressed);
          }
          if (onClick) {
            onClick(e);
          }
        }}
        aria-pressed={pressed}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';
