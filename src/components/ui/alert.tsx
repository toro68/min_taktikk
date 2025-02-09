import React from 'react';

export const Alert = ({ children }: { children: React.ReactNode }) => {
  return <div className="alert">{children}</div>;
};

export const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="alert-description">{children}</p>;
}; 