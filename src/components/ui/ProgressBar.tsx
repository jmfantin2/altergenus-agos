'use client';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ 
  progress, 
  className = '', 
  showLabel = false,
  size = 'md' 
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-ag-accent/30 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="h-full bg-ag-primary transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-sans text-ag-accent mt-1">
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
}
