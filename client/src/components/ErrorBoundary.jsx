/**
 * Error Boundary Component
 * Catches and handles React errors gracefully
 */

import { Component } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary Caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full text-center animate-scale-in">
            {/* Error Icon */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-red-500/20 p-6 rounded-full border-2 border-red-400/50">
                <AlertTriangle className="w-16 h-16 text-red-400" strokeWidth={2} />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold mb-4 gradient-text">
              Oops! Something went wrong
            </h1>
            
            <p className="text-white/70 mb-8 text-lg">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-left">
                <p className="text-red-300 text-sm font-mono mb-2">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-red-300/70 text-xs font-mono mt-2">
                    <summary className="cursor-pointer hover:text-red-300">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 overflow-auto max-h-40 p-2 bg-black/20 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={this.handleReset}
                className="btn-primary flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                Reload Page
              </button>
            </div>

            {/* Help Text */}
            <p className="mt-8 text-sm text-white/50">
              If this problem persists, please contact support
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;