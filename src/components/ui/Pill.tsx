import { type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'accent' | 'muted' | 'outline';
}

export default function Pill({ className, tone = 'muted', children, ...props }: Props) {
  const tones = {
    accent:
      'border-[rgba(var(--acc-rgb),0.4)] bg-[rgba(var(--acc-rgb),0.10)] text-acc',
    muted: 'border-white/10 bg-white/5 text-muted',
    outline: 'border-white/15 bg-transparent text-faint',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
