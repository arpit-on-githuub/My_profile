import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { useKonami } from './lib/useKonami';
import { SECTIONS } from './data/sections';

import AnimatedBackground from './components/effects/AnimatedBackground';
import CursorAura from './components/effects/CursorAura';
import BootScreen from './components/system/BootScreen';
import ToastStack from './components/system/ToastStack';
import AssistantPanel from './components/system/AssistantPanel';
import HelpModal from './components/system/HelpModal';
import Nav from './components/Nav';
import Footer from './components/Footer';

import Terminal from './components/terminal/Terminal';
import MissionPanel from './components/mission/MissionPanel';

import Home from './components/sections/Home';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Education from './components/sections/Education';
import Toolbox from './components/sections/Toolbox';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';
import Resume from './components/sections/Resume';
import AIPlayground from './components/sections/AIPlayground';
import Research from './components/sections/Research';

const SECTION_COMPONENTS = {
  about: About,
  skills: Skills,
  education: Education,
  toolbox: Toolbox,
  projects: Projects,
  experience: Experience,
  research: Research,
  achievements: Achievements,
  contact: Contact,
  resume: Resume,
  ai: AIPlayground,
} as const;

export default function App() {
  const unlocked = useGameStore((s) => s.unlocked);
  const theme = useGameStore((s) => s.theme);
  const crtMode = useGameStore((s) => s.crtMode);
  const activeSection = useGameStore((s) => s.activeSection);
  const unlockSection = useGameStore((s) => s.unlockSection);

  useKonami();

  // Apply theme to <html>.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Deep-link: unlock + scroll to a section referenced in the URL hash.
  useEffect(() => {
    const hash = window.location.hash.replace('#section-', '').replace('#', '');
    const match = SECTIONS.find((s) => s.id === hash);
    if (match) {
      unlockSection(match.id, { silent: true });
      setTimeout(
        () =>
          document
            .getElementById(`section-${match.id}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        700,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to a section when it becomes active (after unlock).
  useEffect(() => {
    if (!activeSection) return;
    const el = document.getElementById(`section-${activeSection}`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#section-${activeSection}`);
      }, 140);
    }
  }, [activeSection]);

  // "Inspect source" easter egg.
  useEffect(() => {
    const style =
      'color:#5eead4;font-family:monospace;font-size:13px;background:#05060a;padding:8px 12px;border-radius:6px;';
    // eslint-disable-next-line no-console
    console.log(
      '%c⌬ Curious dev detected.\nType `help` in the on-page terminal, or try the Konami code.\nSecret commands exist. Go find them.',
      style,
    );
  }, []);

  return (
    <>
      <AnimatedBackground />
      <CursorAura />
      <BootScreen />

      {crtMode && (
        <div
          className="pointer-events-none fixed inset-0 z-[95]"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0, rgba(0,0,0,0.18) 1px, transparent 2px, transparent 3px)',
          }}
        />
      )}

      <a
        href="#section-home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-lg focus:bg-[rgb(var(--acc-rgb))] focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-[var(--bg-0)]"
      >
        Skip to content
      </a>

      <Nav />

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Home />

        {/* The two-zone console: left challenge / right mission control */}
        <div id="console" className="mt-10 grid scroll-mt-24 gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="h-[560px] lg:h-[600px]">
            <Terminal />
          </div>
          <div className="h-auto lg:h-[600px]">
            <MissionPanel />
          </div>
        </div>

        {/* Unlocked sections appear here, in order. */}
        <div>
          {SECTIONS.map((s) => {
            if (!unlocked[s.id]) return null;
            const Comp = SECTION_COMPONENTS[s.id];
            return <Comp key={s.id} />;
          })}
        </div>

        <Footer />
      </main>

      <ToastStack />
      <AssistantPanel />
      <HelpModal />
    </>
  );
}
