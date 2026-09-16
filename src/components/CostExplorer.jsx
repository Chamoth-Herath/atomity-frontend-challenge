import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import useCosts from '../hooks/useCosts';
import { sumCosts } from '../data/costs';
import { money, percent } from '../utils/format';
import AnimatedNumber from './AnimatedNumber';
import BarChart from './BarChart';
import Breadcrumbs from './Breadcrumbs';
import ResourceTable from './ResourceTable';
import StatusView from './StatusView';
import styles from './CostExplorer.module.css';

const levels = [
  { name: 'Cluster', plural: 'Clusters', hint: 'A group of computers', action: 'Choose a cluster to see its workspaces.' },
  { name: 'Namespace', plural: 'Namespaces', hint: 'A workspace inside a cluster', action: 'Choose a namespace to see its running apps.' },
  { name: 'Pod', plural: 'Pods', hint: 'A small unit that runs an app', action: 'You’ve reached the individual apps. Compare their costs below.' },
];

export default function CostExplorer() {
  const { data, isPending, isError, isFetching, fetchStatus, refetch } = useCosts();
  const [path, setPath] = useState([]);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const focusAfterNavigation = useRef(false);
  const inView = useInView(sectionRef, { once: true, amount: 0.12 });
  const reduceMotion = useReducedMotion();

  const clusters = data ?? [];
  const cluster = clusters.find((item) => item.id === path[0]);
  const namespace = cluster?.children.find((item) => item.id === path[1]);
  const trail = [cluster, namespace].filter(Boolean);
  const current = namespace ?? cluster;
  const rows = current?.children ?? clusters;
  const level = levels[trail.length];
  const total = sumCosts(rows);
  const rootTotal = sumCosts(clusters).total;
  const biggest = rows.reduce((best, row) => !best || row.total > best.total ? row : best, null);

  function navigate(nextPath) {
    focusAfterNavigation.current = true;
    setPath(nextPath);
  }

  useEffect(() => {
    if (focusAfterNavigation.current) {
      titleRef.current?.focus({ preventScroll: true });
      focusAfterNavigation.current = false;
    }
  }, [path]);

  let state;
  if (isPending) state = fetchStatus === 'paused' ? 'offline' : 'loading';
  else if (isError && !data) state = 'error';
  else if (!clusters.length) state = 'empty';

  return (
    <section id="explorer" ref={sectionRef} className={styles.section} aria-labelledby="explorer-title">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>FOLLOW THE COST</p><h2 id="explorer-title">One bill. Every layer.</h2></div>
        <span className={styles.demoBadge}>Example data · USD / month</span>
      </div>
      <motion.div
        className={styles.panel}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: inView || reduceMotion ? 1 : 0, y: inView || reduceMotion ? 0 : 20 }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-busy={isPending && fetchStatus !== 'paused'}
      >
        <div className={styles.panelHeader}>
          <Breadcrumbs trail={trail} onBack={(index) => navigate(path.slice(0, index))} />
          <span className={styles.step}>LAYER 0{trail.length + 1} / 03</span>
        </div>
        <div className={styles.panelBody}>
          {state ? <StatusView state={state} onRetry={() => refetch()} retrying={isFetching} /> : (
            <>
              {isError && <p className={styles.refreshError} role="status">The update failed. Your last loaded costs are still shown. <button onClick={() => refetch()} disabled={isFetching}>Try again</button></p>}
              <div className={styles.summary}>
                <div className={styles.primaryMetric}>
                  <p>{current ? `${current.name} cost` : 'Total monthly cost'}</p>
                  <strong><AnimatedNumber value={total.total} format={money} active={inView} /></strong>
                  <span>{current ? `${percent(total.total, rootTotal)}% of the full example bill` : `${total.podCount} pods across ${clusters.length} clusters`}</span>
                </div>
                <div className={styles.metric}>
                  <p>Resources in this view</p>
                  <strong>{rows.length} <span>{level.plural.toLowerCase()}</span></strong>
                  <span>{level.hint}</span>
                </div>
                <div className={styles.insight}>
                  <p>Largest share</p>
                  <strong>{percent(biggest.total, total.total)}<span>%</span></strong>
                  <span>{total.total > 0 ? `${biggest.name} leads this view` : 'No spend in this view'}</span>
                </div>
              </div>
              <div className={styles.chartHeading}>
                <div>
                  <h3 ref={titleRef} tabIndex={-1}>{level.plural}</h3>
                  <p>{level.action}</p>
                </div>
                <span className={styles.legend}><i aria-hidden="true" /> Monthly cost</span>
              </div>
              <motion.div
                key={current?.id ?? 'all'}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
              >
                <BarChart rows={rows} onExplore={(row) => navigate([...path, row.id])} />
                <ResourceTable rows={rows} type={level.name} onExplore={(row) => navigate([...path, row.id])} />
              </motion.div>
              <div className={styles.panelNote}>
                <span>{current ? 'Use the breadcrumb above to go back.' : 'Select any chart bar or resource name to look closer.'}</span>
                <span>{isFetching ? 'Updating…' : 'All amounts in USD'}</span>
              </div>
              <p className="srOnly" role="status" aria-live="polite">Showing {rows.length} {level.plural.toLowerCase()}{current ? ` in ${current.name}` : ''}.</p>
            </>
          )}
        </div>
      </motion.div>
      <ol className={styles.guide} aria-label="The three cost layers">
        {levels.map((item, index) => <li key={item.name} aria-current={index === trail.length ? 'step' : undefined}>
          <span className={styles.guideNumber}>0{index + 1}</span>
          <div><h3>{item.name}</h3><p>{item.hint}</p></div>
        </li>)}
      </ol>
      <p className={styles.disclosure}>A sample bill for exploring, not a real cloud account. Costs and efficiency are calculated from <a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">DummyJSON product data<span className="srOnly"> (opens in a new tab)</span></a>.</p>
    </section>
  );
}
