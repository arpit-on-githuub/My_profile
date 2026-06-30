import { motion } from 'framer-motion';
import { toolbox } from '../../data/portfolio';
import { SECTION_MAP } from '../../data/sections';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';

export default function Toolbox() {
  const def = SECTION_MAP.toolbox;

  return (
    <SectionShell id="toolbox">
      <SectionHeading
        index="04"
        icon={def.icon}
        title="Things I've Worked With"
        command={def.command}
        blurb="My everyday arsenal — the frameworks, platforms, and tools I actually reach for (skills live next door)."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {toolbox.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: gi * 0.06 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[rgba(var(--acc-rgb),0.1)] text-lg">
                {group.icon}
              </span>
              <h3 className="font-display text-base font-semibold">{group.category}</h3>
              <span className="ml-auto font-mono text-[11px] text-faint">{group.items.length}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.items.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.06 + i * 0.04 }}
                  whileHover={{ y: -4, scale: 1.04 }}
                  className="group relative cursor-default overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5"
                >
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: 'radial-gradient(120% 120% at 0% 0%, rgba(var(--acc-rgb),0.18), transparent 65%)' }}
                  />
                  <div className="relative z-10 text-sm font-medium">{t.name}</div>
                  <div className="relative z-10 font-mono text-[10px] text-faint transition-colors group-hover:text-acc">
                    {t.note}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
