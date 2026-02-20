import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const ErrorCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 3rem;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  color: #333;
`;

const ErrorTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #e74c3c;
`;

const ErrorMessage = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  color: #555;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-top: 1.5rem;
  text-align: left;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;

  summary {
    font-weight: 600;
    color: #666;
    margin-bottom: 0.5rem;
  }

  pre {
    margin-top: 0.5rem;
    overflow-x: auto;
    font-size: 0.875rem;
    color: #c7254e;
    background: #f9f2f4;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }
`;

const ReloadButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  handleReload = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorTitle>¡Algo salió mal!</ErrorTitle>
            <ErrorMessage>
              Lo sentimos, ha ocurrido un error inesperado en la aplicación.
              Nuestro equipo ha sido notificado y estamos trabajando para solucionarlo.
            </ErrorMessage>
            <ReloadButton onClick={this.handleReload}>
              Recargar Aplicación
            </ReloadButton>
            {this.state.error && import.meta.env.MODE === 'development' && (
              <ErrorDetails>
                <summary>Detalles técnicos (solo en desarrollo)</summary>
                <pre>{this.state.error.message}</pre>
                {this.state.error.stack && (
                  <pre>{this.state.error.stack}</pre>
                )}
              </ErrorDetails>
            )}
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
