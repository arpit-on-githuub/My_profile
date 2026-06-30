import { motion } from 'framer-motion';
import { experience } from '../../data/portfolio';
import { SECTION_MAP } from '../../data/sections';
import { executeCommand } from '../../lib/commands';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';
import Pill from '../ui/Pill';

export default function Experience() {
  const def = SECTION_MAP.experience;
  return (
    <SectionShell id="experience">
      <SectionHeading
        index="06"
        icon={def.icon}
        title="Career Stack Trace"
        command={def.command}
        blurb="Research & build roles at IIT Jodhpur. No panics, just progress."
      />

      <div className="relative pl-6 sm:pl-8">
        {/* timeline rail */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[rgba(var(--acc-rgb),0.7)] via-[rgba(var(--acc2-rgb),0.4)] to-transparent sm:left-[9px]" />

        <div className="space-y-8">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative"
            >
              {/* node */}
              <span className="absolute -left-6 top-1.5 grid h-4 w-4 place-items-center sm:-left-8">
                <span className="absolute h-4 w-4 animate-ping rounded-full bg-[rgba(var(--acc-rgb),0.3)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--acc-rgb))] ring-4 ring-[rgba(var(--acc-rgb),0.15)]" />
              </span>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-colors hover:border-white/20 sm:p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="font-display text-lg font-bold">{exp.role}</h3>
                  <span className="font-mono text-xs text-faint sm:whitespace-nowrap">{exp.period}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-[11px] text-faint">
                  <span className="text-acc">{exp.company}</span>
                  <span>· {exp.location}</span>
                  {exp.link && exp.link.url !== '#' && (
                    <a
                      href={exp.link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border border-[rgba(var(--acc-rgb),0.3)] px-1.5 py-0.5 text-acc transition-colors hover:bg-[rgba(var(--acc-rgb),0.1)]"
                    >
                      {exp.link.label} ↗
                    </a>
                  )}
                </div>
                <p className="mt-3 text-sm text-muted">{exp.summary}</p>

                <ul className="mt-4 space-y-2">
                  {exp.achievements.map((a, j) => (
                    <li key={j} className="flex gap-2 text-sm text-[var(--fg)]/85">
                      <span className="text-acc">▸</span> {a}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.stack.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* subtle nudge toward the hidden research glimpse */}
      <div className="mt-6 text-center font-mono text-[11px] text-faint/70">
        <span className="opacity-70">// some of the research is still under wraps —</span>{' '}
        <button
          onClick={() => executeCommand('decrypt research')}
          className="text-acc/80 underline-offset-2 transition-colors hover:text-acc hover:underline"
        >
          decrypt research
        </button>
      </div>
    </SectionShell>
  );
}
