import React from 'react';

export const Button = ({
  children,
  onClick,
  variant = "default",
  size = "md",
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button onClick={onClick} className={`btn ${variant} ${size} ${className}`} {...rest}>
      {children}
    </button>
  );
}; 