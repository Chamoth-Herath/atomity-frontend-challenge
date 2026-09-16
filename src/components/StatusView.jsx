export default function StatusView({ state, onRetry, retrying }) {
  if (state === 'loading') return (
    <div className="flex min-h-[30rem] flex-col items-center justify-center gap-4 text-center max-[480px]:min-h-[22rem]" role="status" aria-label="Loading example costs">
      <div className="h-8 w-[35%] animate-pulse rounded-lg bg-[var(--color-muted-surface)] max-[480px]:w-[55%]" />
      <div className="my-6 flex h-48 w-full items-end justify-center gap-6 max-[480px]:h-36 max-[480px]:gap-3" aria-hidden="true">
        <span className="h-[90%] w-[14%] animate-pulse rounded-lg bg-[var(--color-muted-surface)]" />
        <span className="h-[65%] w-[14%] animate-pulse rounded-lg bg-[var(--color-muted-surface)]" />
        <span className="h-[45%] w-[14%] animate-pulse rounded-lg bg-[var(--color-muted-surface)]" />
        <span className="h-[25%] w-[14%] animate-pulse rounded-lg bg-[var(--color-muted-surface)]" />
      </div>
      <p className="text-[var(--color-muted)]">Loading your cost view…</p>
    </div>
  );

  const offline = state === 'offline';
  const empty = state === 'empty';
  return (
    <div className="flex min-h-[30rem] flex-col items-center justify-center gap-4 text-center max-[480px]:min-h-[22rem]" role={empty || offline ? 'status' : 'alert'}>
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-error-soft)] font-bold text-[var(--color-error)]" aria-hidden="true">{empty ? '—' : '!'}</span>
      <h3 className="font-bold text-[var(--color-text)]">{empty ? 'No costs to show yet' : offline ? 'You’re offline' : 'The costs couldn’t load'}</h3>
      <p className="text-[var(--color-muted)]">{empty ? 'The data service returned an empty list.' : offline ? 'Reconnect to load the example data.' : 'Check your connection, then try again.'}</p>
      {!offline && (
        <button
          className="mt-2 rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3 font-semibold text-[var(--color-on-ink)] shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
          onClick={onRetry}
          disabled={retrying}
        >
          {retrying ? 'Trying again…' : 'Try again'}
        </button>
      )}
    </div>
  );
}
