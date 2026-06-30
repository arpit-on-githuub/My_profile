import { motion } from 'framer-motion';
import type { TermLine } from '../../store/useGameStore';
import { cn } from '../../lib/utils';

const STYLES: Record<TermLine['type'], string> = {
  input: 'text-[var(--fg)]',
  output: 'text-muted',
  success: 'text-[rgb(var(--acc-rgb))]',
  error: 'text-[var(--color-danger)]',
  system: 'text-[rgb(var(--acc2-rgb))]',
  ai: 'text-[var(--acc3,#f472b6)]',
  hint: 'text-faint italic',
  art: 'text-acc tracking-[0.2em]',
};

export default function OutputLine({ line }: { line: TermLine }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
      className="font-mono text-[13px] leading-relaxed"
    >
      {line.type === 'input' ? (
        <div className="flex gap-2">
          <span className="select-none text-[rgb(var(--acc-rgb))]">❯</span>
          <span className="text-[var(--fg)]">{line.text}</span>
        </div>
      ) : (
        <div className={cn('whitespace-pre-wrap break-words', STYLES[line.type])}>{line.text}</div>
      )}
      {line.lines?.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap break-words pl-4 text-faint">
          {l}
        </div>
      ))}
    </motion.div>
  );
}
