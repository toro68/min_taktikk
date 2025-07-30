import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const theme = useTheme();

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 4000
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, newToast.duration);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.successColor + '15',
          borderColor: theme.successColor,
          iconColor: theme.successColor
        };
      case 'error':
        return {
          backgroundColor: theme.errorColor + '15',
          borderColor: theme.errorColor,
          iconColor: theme.errorColor
        };
      case 'warning':
        return {
          backgroundColor: theme.warningColor + '15',
          borderColor: theme.warningColor,
          iconColor: theme.warningColor
        };
      case 'info':
        return {
          backgroundColor: theme.primaryColor + '15',
          borderColor: theme.primaryColor,
          iconColor: theme.primaryColor
        };
      default:
        return {
          backgroundColor: '#f3f4f6',
          borderColor: '#d1d5db',
          iconColor: '#6b7280'
        };
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  const value: ToastContextType = {
    showToast,
    hideToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          const IconComponent = getIcon(toast.type);
          
          return (
            <div
              key={toast.id}
              className="flex items-start p-4 rounded-lg border shadow-lg bg-white transition-all duration-300 transform translate-x-0"
              style={{
                backgroundColor: styles.backgroundColor,
                borderColor: styles.borderColor
              }}
            >
              <IconComponent
                size={20}
                className="flex-shrink-0 mt-0.5"
                style={{ color: styles.iconColor }}
              />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-sm text-gray-600 mt-1">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => hideToast(toast.id)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
