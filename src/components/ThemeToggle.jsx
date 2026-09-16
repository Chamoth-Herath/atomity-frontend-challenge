import { useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark');

  function toggleTheme() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setDark(!dark);
    try { localStorage.setItem('atomity-theme', next); } catch { /* Storage is optional. */ }
  }

  return (
    <button
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out hover:-translate-y-px hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)] hover:shadow-[var(--shadow-soft)] active:translate-y-0"
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="text-xl leading-none" aria-hidden="true">{dark ? '☀' : '☾'}</span>
      <span>{dark ? 'Light' : 'Dark'} mode</span>
    </button>
  );
}
