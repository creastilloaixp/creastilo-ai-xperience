import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Optional: Send to error tracking service (Sentry, LogRocket, etc.)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    // }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#151c2f] border border-red-500/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="text-red-400" size={32} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Algo salió mal</h2>
            <p className="text-gray-400 mb-6">
              Ocurrió un error inesperado. Nuestro equipo ha sido notificado.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-black/50 rounded-lg text-left overflow-auto max-h-40">
                <p className="text-xs font-mono text-red-400 mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="text-[10px] text-gray-500 overflow-x-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Intentar de nuevo
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-3 bg-white/5 text-gray-300 border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
