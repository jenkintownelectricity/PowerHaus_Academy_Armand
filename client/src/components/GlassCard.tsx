import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70',
        'border border-white/20 dark:border-gray-700/30',
        'rounded-2xl shadow-xl',
        'transition-all duration-300',
        hover && 'hover:shadow-2xl hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-gray-900/80',
        className
      )}
    >
      {children}
    </div>
  );
}
