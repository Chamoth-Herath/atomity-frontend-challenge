import styles from './StatusView.module.css';

export default function StatusView({ state, onRetry, retrying }) {
  if (state === 'loading') return (
    <div className={styles.loading} role="status" aria-label="Loading example costs">
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonBars} aria-hidden="true"><span /><span /><span /><span /></div>
      <p>Loading your cost view…</p>
    </div>
  );

  const offline = state === 'offline';
  const empty = state === 'empty';
  return (
    <div className={styles.message} role={empty || offline ? 'status' : 'alert'}>
      <span className={styles.symbol} aria-hidden="true">{empty ? '—' : '!'}</span>
      <h3>{empty ? 'No costs to show yet' : offline ? 'You’re offline' : 'The costs couldn’t load'}</h3>
      <p>{empty ? 'The data service returned an empty list.' : offline ? 'Reconnect to load the example data.' : 'Check your connection, then try again.'}</p>
      {!offline && <button onClick={onRetry} disabled={retrying}>{retrying ? 'Trying again…' : 'Try again'}</button>}
    </div>
  );
}
