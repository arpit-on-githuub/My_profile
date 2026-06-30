import { motion } from 'framer-motion';
import { research } from '../../data/portfolio';
import { SECTION_MAP } from '../../data/sections';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';

export default function Research() {
  const def = SECTION_MAP.research;
  return (
    <SectionShell id="research">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-md border border-[rgba(var(--acc2-rgb),0.4)] bg-[rgba(var(--acc2-rgb),0.1)] px-2 py-0.5 font-mono text-[11px] text-[rgb(var(--acc2-rgb))]">
          ✦ HIDDEN · you found it
        </span>
      </div>
      <SectionHeading
        index="✦"
        icon={def.icon}
        title="From the Lab"
        command={def.command}
        blurb="A quiet peek at the research I'm building — a few things shown, a few still under wraps."
      />

      <GlassCard className="max-w-3xl p-6 sm:p-7" animatedBorder>
        {/* status header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
          <div>
            <div className="font-mono text-[11px] text-faint">// project</div>
            <div className="font-display text-xl font-bold">
              {research.project}{' '}
              <span className="text-sm font-normal text-muted">— {research.subtitle}</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-faint">{research.lab}</div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--acc-rgb),0.3)] bg-[rgba(var(--acc-rgb),0.06)] px-3 py-1 font-mono text-[11px] text-acc">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[rgb(var(--acc-rgb))]" />
            {research.status}
          </span>
        </div>

        {/* revealed */}
        <div className="mt-5">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-faint">
            What I can show
          </div>
          <ul className="space-y-2">
            {research.revealed.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-2 text-sm text-[var(--fg)]/85"
              >
                <span className="text-acc">▸</span> {r}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* redacted */}
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-faint">
            Still under wraps
            <span className="rounded border border-white/10 px-1.5 py-0.5 text-[9px] text-faint">redacted</span>
          </div>
          <ul className="space-y-2">
            {research.redacted.map((r, i) => (
              <li key={i} className="flex items-center gap-2 font-mono text-xs text-faint">
                <span className="text-[rgb(var(--acc2-rgb))]">▸</span>
                <span className="select-none rounded bg-white/[0.04] px-1.5 py-0.5">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
          <span className="font-mono text-[11px] text-faint">// {research.note}</span>
          {research.link.url && research.link.url !== '#' && (
            <a
              href={research.link.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[rgba(var(--acc-rgb),0.35)] bg-[rgba(var(--acc-rgb),0.08)] px-3 py-1.5 font-mono text-xs text-acc transition-colors hover:brightness-125"
            >
              {research.link.label} ↗
            </a>
          )}
        </div>
      </GlassCard>
    </SectionShell>
  );
}
