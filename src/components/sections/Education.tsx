import { motion } from 'framer-motion';
import { education, courses } from '../../data/portfolio';
import { SECTION_MAP } from '../../data/sections';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import Pill from '../ui/Pill';

export default function Education() {
  const def = SECTION_MAP.education;

  // Unique skills derived from coursework.
  const derived = Array.from(new Set(courses.flatMap((c) => c.skills)));

  return (
    <SectionShell id="education">
      <SectionHeading
        index="03"
        icon={def.icon}
        title="Education"
        command={def.command}
        blurb="Where the foundations were laid — degrees, entrance ranks, and the coursework behind the skills."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* timeline */}
        <div className="relative pl-6">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[rgba(var(--acc-rgb),0.7)] via-[rgba(var(--acc2-rgb),0.4)] to-transparent" />
          <div className="space-y-5">
            {education.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <span className="absolute -left-6 top-2 grid h-3.5 w-3.5 place-items-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--acc-rgb))] ring-4 ring-[rgba(var(--acc-rgb),0.15)]" />
                </span>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-colors hover:border-white/20">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-display text-base font-bold">{e.school}</h3>
                    <span className="font-mono text-xs text-faint">{e.period}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted">{e.qualification}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Pill tone="accent">{e.score}</Pill>
                    <Pill>📍 {e.location}</Pill>
                  </div>
                  {e.note && (
                    <div className="mt-3 rounded-xl border border-[rgba(var(--acc-rgb),0.25)] bg-[rgba(var(--acc-rgb),0.06)] p-2.5 font-mono text-[11px] text-acc">
                      {e.note}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* coursework + derived skills */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-5" animatedBorder>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">
              Relevant Coursework
            </div>
            <div className="flex flex-wrap gap-2">
              {courses.map((c) => (
                <span
                  key={c.name}
                  title={`Built: ${c.skills.join(', ')}`}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-[rgba(var(--acc-rgb),0.4)] hover:text-acc"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-faint">
              Skills built from coursework
            </div>
            <p className="mb-3 text-xs text-faint">// derived directly from the courses above</p>
            <div className="flex flex-wrap gap-2">
              {derived.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-full border border-[rgba(var(--acc2-rgb),0.35)] bg-[rgba(var(--acc2-rgb),0.08)] px-2.5 py-1 text-[12px] text-[rgb(var(--acc2-rgb))]"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </SectionShell>
  );
}
