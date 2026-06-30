import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Props {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  height?: number;
}

export default function ProgressBar({ value, className, showLabel, height = 8 }: Props) {
  return (
    <div className={cn('w-full', className)}>
      <div
        className="relative w-full overflow-hidden rounded-full bg-white/8"
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              'linear-gradient(90deg, rgb(var(--acc-rgb)), rgb(var(--acc2-rgb)))',
            boxShadow: '0 0 16px rgba(var(--acc-rgb),0.6)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
        <div className="pointer-events-none absolute inset-0 animate-gradient opacity-30"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
      </div>
      {showLabel && (
        <div className="mt-1 text-right font-mono text-[11px] text-faint">{Math.round(value)}%</div>
      )}
    </div>
  );
}
