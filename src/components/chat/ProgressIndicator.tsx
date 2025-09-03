'use client';

import React from 'react';

interface ProgressIndicatorProps {
  isVisible: boolean;
  progress?: string | null;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  isVisible,
  progress,
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div className={`flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      {/* Animated spinner */}
      <div className="flex-shrink-0">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      </div>
      
      {/* Progress text */}
      <div className="flex-1">
        <p className="text-sm text-blue-800 font-medium">
          {progress || 'Processing your request...'}
        </p>
        
        {/* Animated dots */}
        <div className="flex space-x-1 mt-1">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
