import { motion } from 'framer-motion';
import { SECTION_MAP } from '../../data/sections';
import { aiKnowledge, projects } from '../../data/portfolio';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import AIChat from '../system/AIChat';

const EXPERIMENTS = [
  {
    title: 'Intent Router',
    desc: 'Maps fuzzy natural language to the right command — typos welcome.',
    icon: '🎯',
  },
  {
    title: 'Project Matcher',
    desc: 'Recommends the best project to inspect based on the role you mention.',
    icon: '🧩',
  },
  {
    title: 'Code Coach',
    desc: 'Drops subtle hints in the terminal when you look stuck.',
    icon: '⌬',
  },
  {
    title: 'Auto-Summaries',
    desc: 'Each project ships an AI-style summary tuned for hiring signals.',
    icon: '📝',
  },
];

export default function AIPlayground() {
  const def = SECTION_MAP.ai;
  return (
    <SectionShell id="ai">
      <SectionHeading
        index="11"
        icon={def.icon}
        title="AI Playground"
        command={def.command}
        blurb="A small, useful AI layer — runs entirely in your browser, no keys required."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* chat */}
        <GlassCard className="flex flex-col p-5" animatedBorder>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[rgba(var(--acc-rgb),0.12)] text-lg">
              ⌬
            </span>
            <div>
              <div className="font-display font-semibold leading-tight">Portfolio Co-Pilot</div>
              <div className="font-mono text-[11px] text-faint">online · intent-aware</div>
            </div>
            <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-[var(--color-success)]" />
          </div>
          <div className="min-h-[420px] flex-1">
            <AIChat />
          </div>
        </GlassCard>

        {/* experiments */}
        <div className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {EXPERIMENTS.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-[rgba(var(--acc-rgb),0.35)]"
              >
                <div className="text-xl">{e.icon}</div>
                <div className="mt-2 font-display text-sm font-semibold">{e.title}</div>
                <p className="mt-1 text-xs text-muted">{e.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl border border-[rgba(var(--acc-rgb),0.3)] bg-[rgba(var(--acc-rgb),0.06)] p-5">
            <div className="font-mono text-[11px] uppercase tracking-widest text-acc">
              guide's verdict
            </div>
            <p className="mt-2 text-sm text-[var(--fg)]/90">
              Best-fit flagship: <strong className="text-acc">{projects.find((p) => p.id === aiKnowledge.impressivePick)?.name}</strong>.
              In one line — {aiKnowledge.bestAt}
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
