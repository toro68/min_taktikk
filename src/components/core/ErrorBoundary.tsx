import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Noe gikk galt</h1>
              <p className="text-gray-600">Appen har støtt på en uventet feil.</p>
            </div>
            
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">Feilmelding:</h3>
                <p className="text-red-700 text-sm font-mono">{this.state.error.message}</p>
              </div>
            )}
            
            {this.state.errorInfo && (
              <details className="bg-gray-50 border rounded p-4 mb-4">
                <summary className="font-semibold cursor-pointer">Stack Trace</summary>
                <pre className="text-xs mt-2 overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} variant="outline">
                Prøv igjen
              </Button>
              <Button onClick={this.handleReload}>
                Last siden på nytt
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-semibold text-blue-800 mb-2">Debugging tips:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Åpne utviklerverktøy (F12) og sjekk Console-fanen</li>
                <li>• Prøv å laste siden på nytt</li>
                <li>• Sjekk om du har nødvendige avhengigheter installert</li>
                <li>• Se etter feilmeldinger i Network-fanen</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;