import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  animatedBorder?: boolean;
  as?: 'div' | 'section' | 'article';
}

/** Translucent surface with optional animated border + accent glow. */
const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow, animatedBorder, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl glass-strong',
          animatedBorder && 'border-animated',
          glow && 'glow-acc',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
GlassCard.displayName = 'GlassCard';
export default GlassCard;
