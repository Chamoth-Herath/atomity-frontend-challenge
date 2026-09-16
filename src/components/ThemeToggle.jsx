import { useState } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark');

  function toggleTheme() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setDark(!dark);
    try { localStorage.setItem('atomity-theme', next); } catch { /* Storage is optional. */ }
  }

  return (
    <button className={styles.toggle} onClick={toggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
      <span>{dark ? 'Light' : 'Dark'} mode</span>
    </button>
  );
}
