import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Cargando...',
  fullScreen = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2
        className={`${sizeClasses[size]} text-blue-600 animate-spin`}
        aria-label="Cargando contenido"
      />
      {message && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50"
        role="status"
        aria-live="polite"
        aria-label="Cargando página"
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center py-8"
      role="status"
      aria-live="polite"
    >
      {content}
    </div>
  );
};

export default LoadingSpinner;