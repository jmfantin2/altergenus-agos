'use client';

import { useTranslation } from '@/hooks';

// Windows 98/2000 style hourglass animation
export function Hourglass({ size = 48 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        className="animate-hourglass"
        style={{ transformOrigin: 'center center' }}
      >
        {/* Hourglass frame */}
        <path
          d="M6 4h20v2H6V4zm0 22h20v2H6v-2z"
          fill="var(--ag-primary)"
        />
        
        {/* Top glass */}
        <path
          d="M8 6h16v2l-6 6v4l6 6v2H8v-2l6-6v-4L8 8V6z"
          fill="var(--ag-surface)"
          stroke="var(--ag-primary)"
          strokeWidth="1"
        />
        
        {/* Sand in top */}
        <path
          d="M10 8h12l-4.5 4.5h-3L10 8z"
          fill="var(--ag-accent)"
          className="origin-center"
        >
          <animate
            attributeName="d"
            dur="1.5s"
            repeatCount="indefinite"
            values="M10 8h12l-4.5 4.5h-3L10 8z;M14 8h4l-1 1h-2L14 8z;M15 8h2l-.5.5h-1L15 8z"
            keyTimes="0;0.4;0.5"
            calcMode="spline"
            keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
          />
        </path>
        
        {/* Falling sand stream */}
        <line
          x1="16"
          y1="14"
          x2="16"
          y2="18"
          stroke="var(--ag-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <animate
            attributeName="opacity"
            dur="1.5s"
            repeatCount="indefinite"
            values="0;1;1;0"
            keyTimes="0;0.1;0.4;0.5"
          />
        </line>
        
        {/* Sand in bottom */}
        <path
          d="M16 24h0l0 0h0L16 24z"
          fill="var(--ag-accent)"
        >
          <animate
            attributeName="d"
            dur="1.5s"
            repeatCount="indefinite"
            values="M16 24h0l0 0h0L16 24z;M14 24h4l-1.5-1.5h-1L14 24z;M10 24h12l-4.5-4.5h-3L10 24z"
            keyTimes="0;0.2;0.5"
            calcMode="spline"
            keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
          />
        </path>
      </svg>
    </div>
  );
}

export function LoadingScreen() {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-ag-background z-50">
      <Hourglass size={64} />
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ag-background/80 backdrop-blur-sm z-40">
      <Hourglass size={48} />
    </div>
  );
}
