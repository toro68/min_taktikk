import React, { createContext, useContext, useEffect } from 'react';
import { getConfig } from '../lib/config';
import { UIThemeConfig } from '../lib/config';

interface ThemeContextType {
  theme: UIThemeConfig;
  setThemeColor: (key: keyof UIThemeConfig, value: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const config = getConfig();
  const theme = config.settings.ui?.theme || {
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b", 
    successColor: "#10b981",
    warningColor: "#f59e0b",
    errorColor: "#ef4444"
  };

  // Apply CSS custom properties for theme colors
  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS custom properties based on theme
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-success', theme.successColor);
    root.style.setProperty('--color-warning', theme.warningColor);
    root.style.setProperty('--color-error', theme.errorColor);
    
    // Set Tailwind-compatible CSS variables
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--success', theme.successColor);
    root.style.setProperty('--warning', theme.warningColor);
    root.style.setProperty('--destructive', theme.errorColor);
    
    // Additional color variations for better integration
    root.style.setProperty('--primary-foreground', '#ffffff');
    root.style.setProperty('--secondary-foreground', '#ffffff');
    root.style.setProperty('--success-foreground', '#ffffff');
    root.style.setProperty('--warning-foreground', '#ffffff');
    root.style.setProperty('--destructive-foreground', '#ffffff');
    
  }, [theme]);

  const setThemeColor = (key: keyof UIThemeConfig, value: string) => {
    // This could be extended to persist changes or update config
    // Theme color updated: ${key} = ${value}
  };

  const contextValue: ThemeContextType = {
    theme,
    setThemeColor
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
};

export default AppThemeProvider;
