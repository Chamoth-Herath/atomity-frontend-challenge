import ThemeToggle from './components/ThemeToggle';
import CostExplorer from './components/CostExplorer';
import styles from './App.module.css';

export default function App() {
  return (
    <>
      <a className={styles.skipLink} href="#explorer">Skip to cost explorer</a>
      <header className={styles.header}>
        <a href="#top" className={styles.brand} aria-label="Atomity home">
          <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 23V15H8V23ZM12 23V5H17V23ZM21 23V10H26V23Z" /></svg>
          atomity<span className={styles.brandDot}>.</span>
        </a>
        <ThemeToggle />
      </header>
      <main id="top" className={styles.main}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>CLOUD COST EXPLORER</p>
          <h1>A clear view.<br />Down to the <span>last pod.</span></h1>
          <p className={styles.description}>See where your cloud spend goes.<br />Start with a cluster. Keep exploring.</p>
          <a className={styles.exploreButton} href="#explorer">Explore the costs <span aria-hidden="true">↓</span></a>
        </div>
        <CostExplorer />
      </main>
      <footer className={styles.footer}><span>atomity.</span><span>Small details. A clearer picture.</span></footer>
    </>
  );
}
