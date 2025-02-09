import React from 'react';

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

export const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-header">{children}</div>;
};

export const CardTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="card-title">{children}</h2>;
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-content">{children}</div>;
};