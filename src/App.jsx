import ThemeToggle from './components/ThemeToggle';
import CostExplorer from './components/CostExplorer';

const pageWidth = 'mx-auto w-[calc(100%_-_2_*_clamp(1rem,4vw,3rem))] max-w-[70rem] max-[480px]:w-[calc(100%_-_2rem)]';

export default function App() {
  return (
    <>
      <a
        className="fixed left-3 top-3 z-50 -translate-y-[200%] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[var(--color-text)] shadow-[var(--shadow-soft)] transition-transform focus:translate-y-0"
        href="#explorer"
      >
        Skip to cost explorer
      </a>

      <header className={`${pageWidth} flex items-center justify-between gap-6 border-b border-[var(--color-border)] py-6 max-[480px]:gap-3 max-[480px]:py-4`}>
        <a
          href="#top"
          className="inline-flex items-center gap-2 text-[1.75rem] font-bold tracking-[-0.06em] text-[var(--color-text)] no-underline transition-opacity hover:opacity-85 max-[480px]:text-[1.55rem]"
          aria-label="Atomity home"
        >
          <svg className="h-6 w-6 fill-[var(--color-accent)] max-[480px]:h-[1.35rem] max-[480px]:w-[1.35rem]" viewBox="0 0 28 28" aria-hidden="true">
            <path d="M3 23V15H8V23ZM12 23V5H17V23ZM21 23V10H26V23Z" />
          </svg>
          atomity<span className="-ml-[0.45rem] text-[var(--color-accent)]">.</span>
        </a>
        <ThemeToggle />
      </header>

      <main id="top" className={pageWidth}>
        <div className="py-[clamp(3.5rem,7vw,6rem)] pb-[clamp(3rem,5vw,4.5rem)] text-center max-[768px]:py-[clamp(3rem,8vw,4.5rem)] max-[768px]:pb-[clamp(2.5rem,7vw,3.5rem)] max-[480px]:py-12 max-[480px]:pb-11">
          <p className="text-xs font-bold tracking-[0.17em] text-[var(--color-accent)]">CLOUD COST EXPLORER</p>
          <h1 className="mx-auto my-6 max-w-[58rem] text-balance text-[clamp(2.5rem,5.8vw,4.65rem)] leading-[1.05] tracking-[-0.055em] text-[var(--color-text)] max-[480px]:my-4 max-[480px]:text-[clamp(2.2rem,11vw,2.7rem)] max-[480px]:leading-[1.06]">
            Find where your cloud <span className="text-[var(--color-accent)]">money goes.</span>
          </h1>
          <p className="mx-auto max-w-[46rem] text-balance text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.65] text-[var(--color-muted)] max-[480px]:text-[0.975rem]">
            Start with a cluster, drill into a namespace, select a pod, and see exactly how its resource costs are distributed.
          </p>
          <a
            className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3 text-sm font-bold text-[var(--color-on-ink)] no-underline shadow-[0_10px_26px_rgba(22,122,82,0.18)] transition-[transform,box-shadow,background-color,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-hover)] hover:shadow-[0_14px_32px_rgba(22,122,82,0.24)] active:translate-y-0 max-[480px]:mt-4"
            href="#explorer"
          >
            Explore the costs
          </a>
        </div>
        <CostExplorer />
      </main>

      <footer className={`${pageWidth} mt-12 flex justify-between gap-4 border-t border-[var(--color-border)] py-12 text-sm text-[var(--color-muted)] max-[768px]:py-8 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-2`}>
        <span className="font-bold text-[var(--color-text)]">atomity.</span>
        <span>Small details. A clearer picture.</span>
      </footer>
    </>
  );
}
