import React from 'react';

interface SelectProps<T extends string> {
  children: React.ReactNode;
  value: T;
  onValueChange: (value: T) => void;
}

export function Select<T extends string>({ children, value, onValueChange }: SelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelectToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (newValue: T) => {
    onValueChange(newValue);
    setIsOpen(false);
  };

  // Gå gjennom children og injiser props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    // Hvis dette er SelectTrigger, injiser onClick for toggling
    if (child.type === SelectTrigger) {
      return React.cloneElement(child as React.ReactElement<SelectTriggerProps>, {
        onClick: handleSelectToggle,
      });
    }
    // Hvis dette er SelectContent, injiser verdien og handler for å velge element
    if (child.type === SelectContent) {
      return isOpen
        ? React.cloneElement(child as React.ReactElement<SelectContentProps<T>>, {
            value,
            onSelect: handleSelect,
          })
        : null;
    }
    return child;
  });

  return <div className="select relative inline-block">{enhancedChildren}</div>;
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className, ...props }) => {
  return (
    <button
      type="button"
      className={`select-trigger w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface SelectValueProps {
  placeholder: string;
  value?: string;
}

export const SelectValue = ({ placeholder, value }: SelectValueProps) => {
  return <span className="select-value">{value || placeholder}</span>;
};

interface SelectContentProps<T extends string> {
  children: React.ReactNode;
  value?: T;
  onSelect?: (value: T) => void;
}

export const SelectContent = <T extends string>({ children, onSelect }: SelectContentProps<T>) => {
  return (
    <div className="select-content absolute top-full mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-10">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if (child.type === SelectItem) {
          return React.cloneElement(child as React.ReactElement<SelectItemProps<T>>, { onSelect });
        }
        return child;
      })}
    </div>
  );
};

interface SelectItemProps<T extends string> {
  value: T;
  children: React.ReactNode;
  onSelect?: (value: T) => void;
}

export const SelectItem = <T extends string>({ value, children, onSelect }: SelectItemProps<T>) => {
  return (
    <div
      className="select-item cursor-pointer px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out hover:bg-blue-100"
      onClick={() => onSelect && onSelect(value)}
    >
      {children}
    </div>
  );
};