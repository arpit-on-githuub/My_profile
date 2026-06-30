import { motion } from 'framer-motion';
import { achievements, leadership, profile } from '../../data/portfolio';
import { SECTION_MAP } from '../../data/sections';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function Achievements() {
  const def = SECTION_MAP.achievements;
  return (
    <SectionShell id="achievements">
      <SectionHeading
        index="08"
        icon={def.icon}
        title="Achievements"
        command={def.command}
        blurb="Ranks, receipts, and the stuff beyond code."
      />

      {/* stat counters */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {profile.stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard className="p-5 text-center" animatedBorder={i === 0}>
              <div className="font-display text-3xl font-extrabold text-gradient sm:text-4xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-faint">
                {s.label}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* achievement cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-colors hover:border-[rgba(var(--acc-rgb),0.35)]"
          >
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-[rgba(var(--acc-rgb),0.1)] text-2xl transition-transform group-hover:scale-110">
              {a.icon}
            </div>
            <div>
              <h3 className="font-display text-base font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-muted">{a.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* leadership / beyond code */}
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-3 font-mono text-xs text-faint">
          <span className="text-acc">★</span>
          <span className="uppercase tracking-widest">Beyond Code — Leadership &amp; Campus</span>
          <span className="h-px flex-1 bg-gradient-to-r from-[rgba(var(--acc-rgb),0.5)] to-transparent" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {leadership.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: i % 2 ? 16 : -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur transition-colors hover:border-[rgba(var(--acc2-rgb),0.4)]"
            >
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-[rgba(var(--acc2-rgb),0.1)] text-xl">
                {l.icon}
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold">{l.role}</h4>
                <p className="mt-0.5 font-mono text-[11px] text-faint">{l.org}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
