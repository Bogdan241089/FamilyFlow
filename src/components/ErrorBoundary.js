import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <FiAlertTriangle className="error-icon" />
          <h2>Что-то пошло не так</h2>
          <p>Произошла ошибка при загрузке приложения</p>
          <button onClick={() => window.location.reload()}>
            Перезагрузить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
