import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Props {
  index: string;
  icon: string;
  title: string;
  command: string;
  blurb?: string;
  className?: string;
}

/** Consistent header for each unlocked section. */
export default function SectionHeading({ index, icon, title, command, blurb, className }: Props) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="mb-2 flex items-center gap-3 font-mono text-xs text-faint">
        <span className="text-acc">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-[rgba(var(--acc-rgb),0.8)] to-transparent" />
        <span className="rounded-md border border-[rgba(var(--acc-rgb),0.25)] bg-[rgba(var(--acc-rgb),0.06)] px-2 py-0.5 text-acc">
          {command}
        </span>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
      >
        <span className="mr-3 text-acc" aria-hidden>{icon}</span>
        <span className="text-gradient">{title}</span>
      </motion.h2>
      {blurb && <p className="mt-3 max-w-2xl text-muted">{blurb}</p>}
    </div>
  );
}
