import React, { createContext, useContext, useEffect } from 'react';
import { useAppConfig } from '../hooks/useAppConfig';

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { config } = useAppConfig();
  
  // Provide default theme values if config is not available
  const theme = config?.settings?.ui?.theme || {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444'
  };

  // Apply CSS custom properties to the root element
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-success', theme.successColor);
    root.style.setProperty('--color-warning', theme.warningColor);
    root.style.setProperty('--color-error', theme.errorColor);

    // Also set Tailwind CSS custom properties
    root.style.setProperty('--tw-color-primary', theme.primaryColor);
    root.style.setProperty('--tw-color-secondary', theme.secondaryColor);
    root.style.setProperty('--tw-color-success', theme.successColor);
    root.style.setProperty('--tw-color-warning', theme.warningColor);
    root.style.setProperty('--tw-color-error', theme.errorColor);
  }, [theme]);

  const value: ThemeContextType = {
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    successColor: theme.successColor,
    warningColor: theme.warningColor,
    errorColor: theme.errorColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
