import FootballAnimator from './football-animator';
import { useAppConfig } from './hooks/useAppConfig';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
// Optional: dynamic imports for developer tooling can go here

function App() {
  // Load app configuration
  const { isLoading, error } = useAppConfig();

  // Show loading state while config is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laster konfigurasjon...</p>
        </div>
      </div>
    );
  }

  // Show error state if config failed to load
  if (error) {
    // Continue with default config
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-100">
          <FootballAnimator />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
