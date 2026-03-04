import React from 'react';
import '../../styles/ErrorBoundary.css'; // Create this CSS file

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (you can also send to a logging service)
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Optional: Send to your backend logging service
    // this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // You can implement this later to send errors to your backend
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   body: JSON.stringify({ error: error.toString(), errorInfo })
    // });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // You can customize this based on where the error occurred
      const { fallback } = this.props;
      
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="container">
            <div className="error-content">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h2>Something Went Wrong</h2>
              <p className="error-message">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <p className="error-help">
                Please try refreshing the page or contact support if the problem persists.
              </p>
              <div className="error-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={this.handleRefresh}
                >
                  <i className="fas fa-sync-alt"></i> Refresh Page
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={this.handleGoHome}
                >
                  <i className="fas fa-home"></i> Go to Home
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="error-details">
                  <summary>Error Details (Development Only)</summary>
                  <pre>{this.state.error?.toString()}</pre>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;