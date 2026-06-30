import { useEffect, useState } from 'react';

interface Props {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
}

/** Cycles through words with a typewriter effect + blinking cursor. */
export default function TypeWriter({
  words,
  className,
  typeSpeed = 70,
  deleteSpeed = 35,
  pause = 1400,
}: Props) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => {
          setText((t) =>
            deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1),
          );
        },
        deleting ? deleteSpeed : typeSpeed,
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause]);

  return (
    <span className={className}>
      {text}
      <span className="cursor-blink ml-0.5 inline-block w-[2px] -translate-y-[1px] align-middle" style={{ height: '1em', background: 'rgb(var(--acc-rgb))' }} />
    </span>
  );
}
