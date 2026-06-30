import { motion } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';
import type { SectionId } from '../../data/sections';
import { cn } from '../../lib/utils';

interface Props {
  id: SectionId;
  children: ReactNode;
  className?: string;
}

/** Wraps each unlocked section: anchor target + reveal animation. */
const SectionShell = forwardRef<HTMLElement, Props>(({ id, children, className }, ref) => {
  return (
    <motion.section
      ref={ref as never}
      id={`section-${id}`}
      data-section={id}
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn('scroll-mt-24 py-12 sm:py-16', className)}
    >
      {children}
    </motion.section>
  );
});
SectionShell.displayName = 'SectionShell';
export default SectionShell;
