import { motion } from 'framer-motion';
import { profile, aiKnowledge } from '../../data/portfolio';
import { SECTION_MAP } from '../../data/sections';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import Pill from '../ui/Pill';

export default function About() {
  const def = SECTION_MAP.about;
  return (
    <SectionShell id="about">
      <SectionHeading index="01" icon={def.icon} title="About" command={def.command} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <GlassCard className="p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs text-faint">
            <span className="text-acc">$</span> cat about/origin-story.md
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-[var(--fg)]/90">
            {profile.about.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {p}
              </motion.p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Pill tone="accent">📍 {profile.location}</Pill>
            <Pill tone="accent">🟢 {profile.availability}</Pill>
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8" animatedBorder>
          <div className="mb-4 font-mono text-xs uppercase tracking-widest text-faint">
            Operating Principles
          </div>
          <ul className="space-y-3">
            {aiKnowledge.values.map((v, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-3 text-sm text-muted"
              >
                <span className="mt-0.5 font-mono text-acc">{String(i + 1).padStart(2, '0')}</span>
                <span>{v}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.02] p-3 font-mono text-xs text-faint">
            <span className="text-acc">// tl;dr</span>
            <br />
            {aiKnowledge.bestAt}
          </div>
        </GlassCard>
      </div>
    </SectionShell>
  );
}
