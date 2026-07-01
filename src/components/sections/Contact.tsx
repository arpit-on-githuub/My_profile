import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../../data/portfolio';
import { SECTION_MAP } from '../../data/sections';
import { useGameStore } from '../../store/useGameStore';
import SectionShell from './SectionShell';
import SectionHeading from '../ui/SectionHeading';
import GlowButton from '../ui/GlowButton';

/* ============================================================================
   📬 TO MAKE THE FORM DELIVER TO YOUR INBOX (one-time, ~60 seconds):
   1. Go to  https://web3forms.com
   2. Type the email where you want messages delivered → "Create Access Key".
   3. Copy the key from your email and paste it between the quotes below.
   That's it. No account, no server, free. Works for every visitor.
   (If this stays empty, the form falls back to opening the mail app.)
============================================================================ */
const WEB3FORMS_ACCESS_KEY = 'ba985bd8-5be0-4657-8350-226cc7d0dd9b'; // ← paste your key here

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const def = SECTION_MAP.contact;
  const pushToast = useGameStore((s) => s.pushToast);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const openMailApp = () => {
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || 'a visitor'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    // No key configured → fall back to opening the visitor's mail app.
    if (!WEB3FORMS_ACCESS_KEY) {
      openMailApp();
      setStatus('sent');
      pushToast({
        kind: 'info',
        title: 'Opening your mail app 📨',
        detail: 'Just hit send there to reach me!',
        icon: '📨',
      });
      return;
    }

    // Real delivery via Web3Forms — lands straight in the inbox.
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Portfolio contact from ${form.name || 'a visitor'}`,
          from_name: 'arpit.exe portfolio',
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
        pushToast({
          kind: 'info',
          title: 'Boss defeated 🐉',
          detail: 'Message delivered. Thanks for reaching out!',
          icon: '🤝',
        });
      } else {
        throw new Error(data.message || 'failed');
      }
    } catch {
      // Service/network hiccup → don't lose the message, open the mail app.
      openMailApp();
      setStatus('error');
    }
  };

  const buttonLabel =
    status === 'sending'
      ? 'transmitting…'
      : status === 'sent'
        ? WEB3FORMS_ACCESS_KEY
          ? 'sent ✓ — send another'
          : 'opened mail app ↗'
        : status === 'error'
          ? 'opened your mail app ↗'
          : WEB3FORMS_ACCESS_KEY
            ? 'send message ↗'
            : 'open mail app ↗';

  const statusLine =
    status === 'sending'
      ? '// status: sending…'
      : status === 'sent'
        ? '// status: 200 OK — message on its way'
        : status === 'error'
          ? '// status: fell back to your mail app'
          : WEB3FORMS_ACCESS_KEY
            ? '// delivered straight to my inbox'
            : '// opens your mail app, pre-filled & addressed to me';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      pushToast({ kind: 'info', title: 'Email copied ✓', detail: profile.email, icon: '📋' });
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <SectionShell id="contact">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-md border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-2 py-0.5 font-mono text-[11px] text-[var(--color-danger)]">
          ⚔ BOSS LEVEL
        </span>
      </div>
      <SectionHeading
        index="09"
        icon={def.icon}
        title="Make Contact"
        command={def.command}
        blurb="You've reached the final challenge. Defeat it by saying hello."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* form */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-animated rounded-2xl p-[1px]"
        >
          <div className="space-y-4 rounded-2xl bg-[var(--bg-1)]/85 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="// your name">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  placeholder="Ada Lovelace"
                />
              </Field>
              <Field label="// reply-to">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                  placeholder="ada@compute.dev"
                />
              </Field>
            </div>
            <Field label="// message payload">
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input resize-none"
                placeholder="Tell me about the role, the team, or just say hi…"
              />
            </Field>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-faint">{statusLine}</span>
              <GlowButton type="submit" disabled={status === 'sending'}>
                {buttonLabel}
              </GlowButton>
            </div>
          </div>
        </motion.form>

        {/* info / socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="font-mono text-xs text-faint">// availability</div>
            <div className="mt-1 flex items-center gap-2 font-display text-lg font-semibold">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-success)]" />
              {profile.availability}
            </div>
            <p className="mt-2 text-sm text-muted">
              Based {profile.location}. Replies usually land within a day.
            </p>
            <div className="mt-3 flex flex-col gap-1">
              <button
                onClick={copyEmail}
                title="Click to copy"
                className="group flex items-center gap-1.5 text-left font-mono text-sm text-acc hover:underline"
              >
                ✉ {profile.email}
                <span className="text-[10px] text-faint opacity-0 transition-opacity group-hover:opacity-100">
                  copy
                </span>
              </button>
              {profile.phone && (
                <a href={`tel:${profile.phone}`} className="font-mono text-sm text-muted hover:text-acc">
                  ☎ {profile.phone}
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {profile.socials.map((s) =>
              s.label === 'Email' ? (
                <button
                  key={s.label}
                  onClick={copyEmail}
                  title="Click to copy"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-[rgba(var(--acc-rgb),0.4)]"
                >
                  <div>
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="font-mono text-[11px] text-faint">{s.handle}</div>
                  </div>
                  <span className="font-mono text-[11px] text-faint transition-colors group-hover:text-acc">
                    copy
                  </span>
                </button>
              ) : (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-[rgba(var(--acc-rgb),0.4)]"
                >
                  <div>
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="font-mono text-[11px] text-faint">{s.handle}</div>
                  </div>
                  <span className="text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-acc">↗</span>
                </a>
              ),
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          padding: 0.65rem 0.85rem;
          font-size: 0.9rem;
          color: var(--fg);
          font-family: var(--font-sans);
        }
        .input::placeholder { color: var(--faint); }
        .input:focus { outline: none; border-color: rgba(var(--acc-rgb),0.5); box-shadow: 0 0 0 3px rgba(var(--acc-rgb),0.08); }
      `}</style>
    </SectionShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] text-faint">{label}</span>
      {children}
    </label>
  );
}
