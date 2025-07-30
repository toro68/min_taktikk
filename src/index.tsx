import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/core/ErrorBoundary';
import { AppThemeProvider } from './providers/AppThemeProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);