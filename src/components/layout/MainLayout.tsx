import React from 'react';
import { TooltipProvider } from '../ui/tooltip';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen">
        {children}
      </div>
    </TooltipProvider>
  );
};

export default MainLayout;