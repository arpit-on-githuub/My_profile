import { motion } from 'framer-motion';
import { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function GlowButton({
  className,
  variant = 'solid',
  size = 'md',
  children,
  ...props
}: GlowButtonProps) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variants = {
    solid:
      'text-[var(--bg-0)] font-semibold bg-[rgb(var(--acc-rgb))] hover:brightness-110 shadow-[0_0_24px_rgba(var(--acc-rgb),0.45)]',
    outline:
      'text-[var(--fg)] border border-[rgba(var(--acc-rgb),0.5)] hover:bg-[rgba(var(--acc-rgb),0.1)]',
    ghost: 'text-[var(--muted)] hover:text-[var(--fg)] hover:bg-white/5',
  };
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 rounded-xl font-mono tracking-wide transition-colors',
        sizes[size],
        variants[variant],
        className,
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
