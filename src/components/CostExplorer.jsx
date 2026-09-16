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
    <section id="explorer" ref={sectionRef} className="scroll-mt-6" aria-labelledby="explorer-title">
      <motion.div className="mb-6 flex flex-wrap items-end justify-between gap-4 max-[480px]:mb-4 max-[480px]:items-start max-[480px]:gap-3" {...reveal(0)}>
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-[var(--color-accent)]">FOLLOW THE COST</p>
          <h2 id="explorer-title" className="mt-2 text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] tracking-[-0.035em] text-[var(--color-text)]">One bill. Every layer.</h2>
        </div>
      </motion.div>

      <motion.div
        className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-panel)] transition-[background-color,border-color,box-shadow] duration-300 max-[480px]:rounded-[0.875rem]"
        initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.995 }}
        animate={{ opacity: inView || reduceMotion ? 1 : 0, y: inView || reduceMotion ? 0 : 20, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.08, ease: easeOut }}
        aria-busy={isPending && fetchStatus !== 'paused'}
      >
        <motion.div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--surface-header)] px-[clamp(1rem,3vw,2rem)] py-3 transition-colors duration-300 max-[480px]:items-start max-[480px]:gap-2 max-[480px]:px-3 max-[480px]:py-2" {...reveal(0.14, 8)}>
          <Breadcrumbs trail={trail} onBack={(index) => navigate(path.slice(0, index))} />
          <span className="shrink-0 text-xs font-bold tracking-[0.08em] text-[var(--color-muted)] max-[480px]:hidden">LAYER 0{Math.min(trail.length + 1, 3)} / 03</span>
        </motion.div>

        <div className="min-w-0 p-[clamp(1rem,3vw,2rem)] max-[768px]:p-[clamp(1rem,3.5vw,1.5rem)] max-[480px]:px-3 max-[480px]:py-4">
          {state ? <StatusView state={state} onRetry={() => refetch()} retrying={isFetching} /> : (
            <>
              {isError && (
                <p className="mb-4 rounded-lg bg-[var(--color-error-soft)] p-3 text-sm text-[var(--color-error)]" role="status">
                  The update failed. Your last loaded costs are still shown.{' '}
                  <button className="ml-2 min-h-11 border-0 bg-transparent text-inherit underline" onClick={() => refetch()} disabled={isFetching}>Try again</button>
                </p>
              )}

              <div className="grid min-w-0 grid-cols-[1.3fr_1fr_0.8fr] items-stretch gap-6 border-b border-[var(--color-border)] pb-8 max-[768px]:grid-cols-2 max-[768px]:gap-4 max-[480px]:grid-cols-1 max-[480px]:gap-4 max-[480px]:pb-6">
                <motion.div className="flex min-w-0 flex-col justify-center gap-2 max-[768px]:col-span-2 max-[480px]:col-auto" {...reveal(0.2, 10)}>
                  <p className="text-sm text-[var(--color-muted)]">{current ? `${current.name} cost` : 'Total monthly cost'}</p>
                  <strong className="text-[clamp(2rem,4vw,2.8rem)] font-medium leading-[1.2] tracking-[-0.04em] text-[var(--color-text)] tabular-nums max-[480px]:text-[clamp(2rem,12vw,2.55rem)]">
                    <AnimatedNumber value={total.total} format={money} active={inView} />
                  </strong>
                  <span className="text-sm text-[var(--color-muted)]">{current ? `${percent(total.total, rootTotal)}% of the full bill` : `${total.podCount} pods across ${clusters.length} clusters`}</span>
                </motion.div>

                <motion.div className="flex min-w-0 flex-col justify-center gap-2 border-l border-[var(--color-border)] pl-6 max-[768px]:border-l-0 max-[768px]:pl-0 max-[480px]:border-t max-[480px]:pt-4" {...reveal(0.27, 10)}>
                  <p className="text-sm text-[var(--color-muted)]">Resources in this view</p>
                  <strong className="text-3xl font-medium leading-[1.2] tracking-[-0.04em] text-[var(--color-text)] tabular-nums max-[480px]:text-[1.75rem]">
                    <AnimatedNumber value={rows.length} format={(value) => Math.round(value)} active={inView} /> <span className="text-base tracking-normal">{level.plural.toLowerCase()}</span>
                  </strong>
                  <span className="text-sm text-[var(--color-muted)]">{level.hint}</span>
                </motion.div>

                <motion.div className="flex min-w-0 flex-col justify-center gap-2 rounded-[0.875rem] border border-[var(--color-border)] bg-[var(--surface-accent)] px-6 py-4 transition-colors duration-300 max-[480px]:p-3" {...reveal(0.34, 10)}>
                  <p className="text-sm text-[var(--color-accent)]">Largest share</p>
                  <strong className="text-3xl font-medium leading-[1.2] tracking-[-0.04em] text-[var(--color-accent)] tabular-nums max-[480px]:text-[1.75rem]">
                    <AnimatedNumber value={biggestShare} format={(value) => Math.round(value)} active={inView} /><span className="text-xl">%</span>
                  </strong>
                  <span className="text-sm text-[var(--color-accent)]">{total.total > 0 && biggest ? `${biggest.name} leads this view` : 'No spend in this view'}</span>
                </motion.div>
              </div>

              <motion.div className="mt-8 flex min-w-0 items-start justify-between gap-4 max-[480px]:mt-6 max-[480px]:flex-col max-[480px]:gap-3" {...reveal(0.4, 10)}>
                <div>
                  <h3 ref={titleRef} tabIndex={-1} className="text-lg font-bold text-[var(--color-text)]">{level.plural}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{level.action}</p>
                </div>
                <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-[var(--color-muted)] max-[480px]:whitespace-normal">
                  <i className="h-2.5 w-2.5 rounded-sm bg-[var(--color-bar-strong)] shadow-[0_0_0_3px_var(--color-accent-soft)]" aria-hidden="true" />
                  Monthly cost
                </span>
              </motion.div>

              <motion.div
                className="mx-4 mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 border-l-2 border-[var(--color-accent)] py-[0.2rem] pl-3 max-[480px]:mx-0 max-[480px]:grid-cols-1 max-[480px]:gap-[0.2rem] max-[480px]:py-[0.15rem]"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.32, ease: easeOut }}
              >
                <strong className="whitespace-nowrap text-[0.72rem] font-bold uppercase tracking-[0.07em] text-[var(--color-accent)]">Cost insight</strong>
                <p className="text-sm leading-[1.55] text-[var(--color-muted)]">{smartInsight}</p>
              </motion.div>

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

              <motion.div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-[var(--color-border)] pt-3 text-sm text-[var(--color-muted)] max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-2" {...reveal(0.5, 8)}>
                <span>{pod ? 'Use the breadcrumb above to go back.' : 'Hover to compare. Click any table row to drill into the next layer.'}</span>
                <span>{isFetching ? 'Updating…' : 'All amounts in USD'}</span>
              </motion.div>
              <p className="sr-only" role="status" aria-live="polite">Showing {rows.length} {level.plural.toLowerCase()}{current ? ` in ${current.name}` : ''}.</p>
            </>
          )}
        </div>
      </motion.div>

      <motion.ol
        ref={guideRef}
        className="my-8 grid list-none grid-cols-3 gap-6 p-0 max-[768px]:gap-2 max-[480px]:my-6 max-[480px]:grid-cols-1"
        aria-label="The three cost layers"
        initial="hidden"
        animate={guideInView || reduceMotion ? 'show' : 'hidden'}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: reduceMotion ? 0 : 0.05 } },
        }}
      >
        {levels.map((item, index) => {
          const currentStep = index === Math.min(trail.length, levels.length - 1);
          return (
            <motion.li
              key={item.name}
              aria-current={currentStep ? 'step' : undefined}
              className={`flex items-start gap-3 rounded-[0.875rem] border p-4 transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)] hover:shadow-[var(--shadow-soft)] max-[480px]:p-3 ${currentStep ? 'border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]' : 'border-transparent bg-[var(--color-surface)]'}`}
              variants={{
                hidden: reduceMotion ? {} : { opacity: 0, y: 12 },
                show: reduceMotion ? {} : { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
              }}
              whileHover={!reduceMotion ? { y: -2, transition: { duration: 0.16, ease: easeOut } } : undefined}
            >
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">{item.name}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{item.hint}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ol>

      <motion.p
        className="mx-auto max-w-[45rem] text-center text-sm text-[var(--color-muted)] max-[480px]:px-1 max-[480px]:text-[0.8125rem]"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: guideInView || reduceMotion ? 1 : 0, y: guideInView || reduceMotion ? 0 : 8 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.32, ease: easeOut }}
      >
        Every cloud dollar has a path. Follow it from cluster to pod.
      </motion.p>
    </section>
  );
}
