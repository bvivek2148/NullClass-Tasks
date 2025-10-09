import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const NODE_ENV = (import.meta as any).env?.MODE || 'development';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-content">
              <AlertTriangle size={64} className="error-icon" />
              <h1 className="error-title">Oops! Something went wrong</h1>
              <p className="error-message">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              
              {NODE_ENV === 'development' && this.state.error && (
                <details className="error-details">
                  <summary>Error Details (Development)</summary>
                  <pre className="error-stack">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="error-actions">
                <button 
                  onClick={this.handleReload}
                  className="btn btn-primary"
                >
                  <RefreshCw size={16} />
                  Reload Page
                </button>
                <button 
                  onClick={this.handleReset}
                  className="btn btn-secondary"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
