import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ text = 'Đang tải...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="relative flex items-center justify-center space-x-3 p-6">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50 rounded-2xl opacity-80 animate-pulse"></div>
      
      {/* Glowing orb effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl blur-xl animate-pulse"></div>
      
      {/* Main content */}
      <div className="relative flex items-center space-x-3">
        {/* Spinner with enhanced styling */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-75 animate-spin`}></div>
          
          {/* Main spinner */}
          <Loader2 className={`${sizeClasses[size]} animate-spin text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text relative z-10`} 
                   style={{
                     background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     backgroundClip: 'text'
                   }} />
          
          {/* Inner highlight */}
          <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-white/30 rounded-full animate-pulse`}></div>
        </div>
        
        {/* Text with modern styling */}
        <div className="relative">
          {/* Text shadow/glow */}
          <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-medium tracking-wide blur-sm opacity-50">
            {text}
          </span>
          
          {/* Main text */}
          <span className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent font-medium tracking-wide">
            {text}
          </span>
          
          {/* Animated underline */}
          <div className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse rounded-full" 
               style={{ width: '100%', animation: 'pulse 2s ease-in-out infinite' }}></div>
        </div>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute top-2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-60" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-4 left-8 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-50" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-6 right-4 w-1 h-1 bg-indigo-400 rounded-full animate-ping opacity-70" style={{animationDelay: '1.5s'}}></div>
      </div>
    </div>
  );
}