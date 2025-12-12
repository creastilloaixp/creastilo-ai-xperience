import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-white/5 overflow-hidden';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: ''
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Preset Skeletons for common UI patterns
export const SkeletonCard: React.FC = () => (
  <div className="bg-[#151c2f] border border-white/5 rounded-xl p-6 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="rectangular" height={120} />
    <div className="flex gap-2">
      <Skeleton variant="rectangular" className="flex-1" height={36} />
      <Skeleton variant="rectangular" className="flex-1" height={36} />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-[#151c2f] border border-white/5 rounded-xl overflow-hidden">
    <div className="p-4 border-b border-white/5 flex justify-between">
      <Skeleton variant="text" width={150} />
      <Skeleton variant="rectangular" width={100} height={32} />
    </div>
    <div className="divide-y divide-white/5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="40%" />
          </div>
          <Skeleton variant="rectangular" width={80} height={28} />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="bg-[#151c2f] border border-white/5 rounded-xl p-6">
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-2">
        <Skeleton variant="text" width={150} />
        <Skeleton variant="text" width={100} />
      </div>
      <Skeleton variant="rectangular" width={120} height={36} />
    </div>
    <Skeleton variant="rectangular" height={250} />
  </div>
);

export const SkeletonStats: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-[#151c2f] border border-white/5 rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <Skeleton variant="text" width={100} />
          <Skeleton variant="circular" width={40} height={40} />
        </div>
        <Skeleton variant="text" width={120} height={32} className="mb-2" />
        <Skeleton variant="text" width={80} />
      </div>
    ))}
  </div>
);
