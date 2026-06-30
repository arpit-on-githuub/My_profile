import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/** Listens for the Konami code; rewards a badge + secret + theme flourish. */
export function useKonami() {
  const awardBadge = useGameStore((s) => s.awardBadge);
  const findSecret = useGameStore((s) => s.findSecret);
  const setTheme = useGameStore((s) => s.setTheme);
  const pushToast = useGameStore((s) => s.pushToast);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[pos]) {
        pos++;
        if (pos === SEQUENCE.length) {
          pos = 0;
          awardBadge('konami');
          findSecret('konami');
          setTheme('synthwave');
          pushToast({
            kind: 'secret',
            title: 'KONAMI CODE',
            detail: '30 extra lives… of portfolio. Theme switched.',
            icon: '🎮',
          });
        }
      } else {
        pos = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [awardBadge, findSecret, setTheme, pushToast]);
}
