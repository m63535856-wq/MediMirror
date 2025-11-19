/**
 * Loading Spinner Component
 * Premium animated loading indicator
 */

import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = '', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
        
        {/* Spinning loader */}
        <Loader2 
          className={`${sizeClasses[size]} text-blue-400 animate-spin relative z-10`}
          strokeWidth={2.5}
        />
      </div>
      
      {text && (
        <p className="text-sm text-white/70 animate-pulse font-medium">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;