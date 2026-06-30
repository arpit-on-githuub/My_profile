import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { skills, type SkillNode } from '../../data/portfolio';
import { SECTION_MAP } from '../../data/sections';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { cn } from '../../lib/utils';

const CATEGORIES: SkillNode['category'][] = [
  'Languages',
  'Frontend',
  'Backend',
  'AI/ML',
  'CS Core',
  'Tools',
];

export default function Skills() {
  const def = SECTION_MAP.skills;
  const [filter, setFilter] = useState<'All' | SkillNode['category']>('All');

  const grouped = useMemo(() => {
    const cats = filter === 'All' ? CATEGORIES : [filter];
    return cats.map((c) => ({ category: c, items: skills.filter((s) => s.category === c) }));
  }, [filter]);

  return (
    <SectionShell id="skills">
      <SectionHeading
        index="02"
        icon={def.icon}
        title="Skill Tree"
        command={def.command}
        blurb="Allocated skill points across the stack. Hover a node for the flavor text."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(['All', ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              'rounded-full border px-3 py-1 font-mono text-xs transition-colors',
              filter === c
                ? 'border-[rgba(var(--acc-rgb),0.5)] bg-[rgba(var(--acc-rgb),0.12)] text-acc'
                : 'border-white/10 text-muted hover:text-fg',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {grouped.map(({ category, items }) => (
          <GlassCard key={category} className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{category}</h3>
              <span className="font-mono text-[11px] text-faint">{items.length} nodes</span>
            </div>
            <div className="space-y-3.5">
              {items.map((s, i) => (
                <SkillBar key={s.name} skill={s} delay={i * 0.06} />
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </SectionShell>
  );
}

function SkillBar({ skill, delay }: { skill: SkillNode; delay: number }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="font-mono text-[11px] text-faint">{skill.level}</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgb(var(--acc-rgb)), rgb(var(--acc2-rgb)))',
            boxShadow: '0 0 12px rgba(var(--acc-rgb),0.5)',
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <motion.div
        initial={false}
        animate={{ height: hover ? 'auto' : 0, opacity: hover ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pt-1.5 font-mono text-[11px] text-faint">{skill.blurb}</p>
      </motion.div>
    </div>
  );
}
