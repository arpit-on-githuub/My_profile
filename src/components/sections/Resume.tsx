import { motion } from 'framer-motion';
import { profile, experience, skills } from '../../data/portfolio';
import { SECTION_MAP } from '../../data/sections';
import { downloadResume, printResume } from '../../lib/resume';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';
import GlowButton from '../ui/GlowButton';

export default function Resume() {
  const def = SECTION_MAP.resume;
  const topSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 10);

  return (
    <SectionShell id="resume">
      <SectionHeading
        index="09"
        icon={def.icon}
        title="Resume Artifact"
        command={def.command}
        blurb="The recruiter-friendly version. View the hosted PDF, or grab the live-generated copy."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="font-mono text-xs text-faint">// artifact</div>
            <div className="mt-1 font-display text-xl font-bold">
              {profile.name.replace(/\s+/g, '_')}_Resume
            </div>
            <p className="mt-2 text-sm text-muted">
              {profile.resumeUrl
                ? 'View the official PDF, or grab a copy generated live from this site.'
                : "Generated live from this portfolio's data — always in sync, never stale."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                  <GlowButton>↗ view resume</GlowButton>
                </a>
              )}
              <GlowButton variant="outline" onClick={downloadResume}>
                ⬇ download
              </GlowButton>
              <GlowButton variant="ghost" onClick={printResume}>
                🖨 print / PDF
              </GlowButton>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-2 font-mono text-xs text-faint">// quick facts</div>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <span className="text-acc">▸</span> 20 years of experience… of life
              </li>
              <li>
                <span className="text-acc">▸</span> {experience[0].role} @ {experience[0].company}
              </li>
              <li>
                <span className="text-acc">▸</span> {profile.availability}
              </li>
            </ul>
          </div>
        </motion.div>

        {/* preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-white/12 bg-white text-[#14161d] shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-black/10 bg-black/[0.03] px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-[11px] text-black/50">resume_preview.pdf</span>
          </div>
          <div className="max-h-[460px] overflow-y-auto p-6 text-sm">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-extrabold leading-tight">{profile.name}</div>
                <div className="font-semibold text-[#3b82f6]">{profile.role}</div>
              </div>
              <div className="text-right text-[11px] text-black/55">
                {profile.email}
                <br />
                {profile.location}
              </div>
            </div>

            <Hr label="Summary" />
            <p className="text-[13px] text-black/75">{profile.about[0]}</p>

            <Hr label="Top Skills" />
            <p className="text-[13px] text-[#3b82f6]">{topSkills.map((s) => s.name).join(' · ')}</p>

            <Hr label="Experience" />
            {experience.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-semibold">
                    {e.role} · {e.company}
                  </span>
                  <span className="text-[11px] text-black/55">{e.period}</span>
                </div>
                <ul className="ml-4 mt-1 list-disc text-[12.5px] text-black/70">
                  {e.achievements.slice(0, 2).map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

function Hr({ label }: { label: string }) {
  return (
    <div className="mb-2 mt-4 border-b border-black/10 pb-1 font-mono text-[11px] uppercase tracking-widest text-black/45">
      {label}
    </div>
  );
}
