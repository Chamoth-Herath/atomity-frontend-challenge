import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import useCosts from '../hooks/useCosts';
import { costColumns, sumCosts } from '../data/costs';
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

const easeOut = [0.22, 1, 0.36, 1];

export default function CostExplorer() {
  const { data, isPending, isError, isFetching, fetchStatus, refetch } = useCosts();
  const [path, setPath] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const sectionRef = useRef(null);
  const guideRef = useRef(null);
  const titleRef = useRef(null);
  const focusAfterNavigation = useRef(false);
  const inView = useInView(sectionRef, { once: true, amount: 0.12 });
  const guideInView = useInView(guideRef, { once: true, amount: 0.35 });
  const reduceMotion = useReducedMotion();

  const clusters = data ?? [];
  const cluster = clusters.find((item) => item.id === path[0]);
  const namespace = cluster?.children.find((item) => item.id === path[1]);
  const pod = namespace?.children.find((item) => item.id === path[2]);
  const trail = [cluster, namespace, pod].filter(Boolean);
  const current = pod ?? namespace ?? cluster;
  const rows = pod ? [pod] : current?.children ?? clusters;
  const level = pod
    ? { name: 'Pod', plural: 'Pod', hint: 'An individual app workload', action: 'Review the monthly cost for this pod.' }
    : levels[trail.length];
  const total = sumCosts(rows);
  const rootTotal = sumCosts(clusters).total;
  const biggest = rows.reduce((best, row) => !best || row.total > best.total ? row : best, null);
  const biggestShare = biggest ? percent(biggest.total, total.total) : 0;
  const activeRow = rows.find((row) => row.id === activeId) ?? null;

  const resourceMix = useMemo(() => {
    if (!pod) return [];
    return costColumns.map(({ key, label }) => ({
      key,
      label,
      value: pod[key],
      share: percent(pod[key], pod.total),
    }));
  }, [pod]);

  const largestResource = resourceMix.reduce((best, item) => !best || item.value > best.value ? item : best, null);

  let smartInsight = 'Select or hover a resource to connect the chart with the detailed costs below.';
  if (pod && largestResource) {
    smartInsight = `${largestResource.label} is ${largestResource.share}% of this pod’s monthly cost, making it the largest cost driver.`;
  } else if (activeRow) {
    smartInsight = `${activeRow.name} represents ${percent(activeRow.total, total.total)}% of this view at ${money(activeRow.total)} per month.`;
  } else if (biggest) {
    smartInsight = `${biggest.name} currently has the largest share at ${biggestShare}% of this view.`;
  }

  function navigate(nextPath) {
    focusAfterNavigation.current = true;
    setActiveId(null);
    setPath(nextPath);
  }

  useEffect(() => {
    if (focusAfterNavigation.current) {
      titleRef.current?.focus({ preventScroll: true });
      focusAfterNavigation.current = false;
    }
  }, [path]);

  useEffect(() => {
    if (activeId && !rows.some((row) => row.id === activeId)) setActiveId(null);
  }, [activeId, rows]);

  let state;
  if (isPending) state = fetchStatus === 'paused' ? 'offline' : 'loading';
  else if (isError && !data) state = 'error';
  else if (!clusters.length) state = 'empty';

  const reveal = (delay = 0, y = 14) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    animate: { opacity: inView || reduceMotion ? 1 : 0, y: inView || reduceMotion ? 0 : y },
    transition: { duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : delay, ease: easeOut },
  });

  return (
    <section id="explorer" ref={sectionRef} className={styles.section} aria-labelledby="explorer-title">
      <motion.div className={styles.sectionHeading} {...reveal(0)}>
        <div><p className={styles.eyebrow}>FOLLOW THE COST</p><h2 id="explorer-title">One bill. Every layer.</h2></div>
      </motion.div>
      <motion.div
        className={styles.panel}
        initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.995 }}
        animate={{ opacity: inView || reduceMotion ? 1 : 0, y: inView || reduceMotion ? 0 : 20, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.08, ease: easeOut }}
        aria-busy={isPending && fetchStatus !== 'paused'}
      >
        <motion.div className={styles.panelHeader} {...reveal(0.14, 8)}>
          <Breadcrumbs trail={trail} onBack={(index) => navigate(path.slice(0, index))} />
          <span className={styles.step}>LAYER 0{Math.min(trail.length + 1, 3)} / 03</span>
        </motion.div>
        <div className={styles.panelBody}>
          {state ? <StatusView state={state} onRetry={() => refetch()} retrying={isFetching} /> : (
            <>
              {isError && <p className={styles.refreshError} role="status">The update failed. Your last loaded costs are still shown. <button onClick={() => refetch()} disabled={isFetching}>Try again</button></p>}
              <div className={styles.summary}>
                <motion.div className={styles.primaryMetric} {...reveal(0.2, 10)}>
                  <p>{current ? `${current.name} cost` : 'Total monthly cost'}</p>
                  <strong><AnimatedNumber value={total.total} format={money} active={inView} /></strong>
                  <span>{current ? `${percent(total.total, rootTotal)}% of the full bill` : `${total.podCount} pods across ${clusters.length} clusters`}</span>
                </motion.div>
                <motion.div className={styles.metric} {...reveal(0.27, 10)}>
                  <p>Resources in this view</p>
                  <strong><AnimatedNumber value={rows.length} format={(value) => Math.round(value)} active={inView} /> <span>{level.plural.toLowerCase()}</span></strong>
                  <span>{level.hint}</span>
                </motion.div>
                <motion.div className={styles.insight} {...reveal(0.34, 10)}>
                  <p>Largest share</p>
                  <strong><AnimatedNumber value={biggestShare} format={(value) => Math.round(value)} active={inView} /><span>%</span></strong>
                  <span>{total.total > 0 && biggest ? `${biggest.name} leads this view` : 'No spend in this view'}</span>
                </motion.div>
              </div>

              <motion.div className={styles.chartHeading} {...reveal(0.4, 10)}>
                <div>
                  <h3 ref={titleRef} tabIndex={-1}>{level.plural}</h3>
                  <p>{level.action}</p>
                </div>
                <span className={styles.legend}><i aria-hidden="true" /> Monthly cost</span>
              </motion.div>

              <motion.div
                className={styles.smartInsight}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.32, ease: easeOut }}
              >
                <strong>Cost insight</strong>
                <p>{smartInsight}</p>
              </motion.div>

              {pod && resourceMix.length > 0 && (
                <motion.div
                  className={styles.compositionCard}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, ease: easeOut }}
                >
                  <div className={styles.compositionHeader}>
                    <div><p className={styles.compositionEyebrow}>POD COST MIX</p><h4>Where {pod.name} spends</h4></div>
                    <span>{money(pod.total)} / month</span>
                  </div>
                  <div className={styles.compositionBar} aria-label={`${pod.name} resource cost composition`}>
                    {resourceMix.map((item, index) => (
                      <motion.span
                        key={item.key}
                        className={styles.compositionSegment}
                        style={{ flexGrow: Math.max(item.value, 1) }}
                        title={`${item.label}: ${money(item.value)} (${item.share}%)`}
                        initial={reduceMotion ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : index * 0.06, ease: easeOut }}
                      />
                    ))}
                  </div>
                  <div className={styles.compositionLegend}>
                    {resourceMix.map((item) => (
                      <div key={item.key}><i aria-hidden="true" /><span>{item.label}</span><strong>{item.share}%</strong></div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                key={current?.id ?? 'all'}
                initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 250, damping: 30, mass: 0.82 }}
              >
                <BarChart
                  rows={rows}
                  onExplore={pod ? undefined : (row) => navigate([...path, row.id])}
                  activeId={activeId}
                  onActiveChange={setActiveId}
                />
                <ResourceTable
                  rows={rows}
                  type={level.name}
                  onExplore={pod ? undefined : (row) => navigate([...path, row.id])}
                  activeId={activeId}
                  onActiveChange={setActiveId}
                />
              </motion.div>
              <motion.div className={styles.panelNote} {...reveal(0.5, 8)}>
                <span>{pod ? 'Use the breadcrumb above to go back.' : 'Hover to compare. Click any table row to drill into the next layer.'}</span>
                <span>{isFetching ? 'Updating…' : 'All amounts in USD'}</span>
              </motion.div>
              <p className="srOnly" role="status" aria-live="polite">Showing {rows.length} {level.plural.toLowerCase()}{current ? ` in ${current.name}` : ''}.</p>
            </>
          )}
        </div>
      </motion.div>
      <motion.ol
        ref={guideRef}
        className={styles.guide}
        aria-label="The three cost layers"
        initial="hidden"
        animate={guideInView || reduceMotion ? 'show' : 'hidden'}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: reduceMotion ? 0 : 0.05 } },
        }}
      >
        {levels.map((item, index) => (
          <motion.li
            key={item.name}
            aria-current={index === Math.min(trail.length, levels.length - 1) ? 'step' : undefined}
            variants={{
              hidden: reduceMotion ? {} : { opacity: 0, y: 12 },
              show: reduceMotion ? {} : { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
            }}
            whileHover={!reduceMotion ? { y: -2, transition: { duration: 0.16, ease: easeOut } } : undefined}
          >
            <div><h3>{item.name}</h3><p>{item.hint}</p></div>
          </motion.li>
        ))}
      </motion.ol>
      <motion.p
        className={styles.disclosure}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: guideInView || reduceMotion ? 1 : 0, y: guideInView || reduceMotion ? 0 : 8 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.32, ease: easeOut }}
      >Every cloud dollar has a path. Follow it from cluster to pod.</motion.p>
    </section>
  );
}
