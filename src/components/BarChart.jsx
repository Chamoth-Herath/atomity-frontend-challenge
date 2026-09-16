import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { money } from '../utils/format';
import styles from './BarChart.module.css';

export default function BarChart({ rows, onExplore }) {
  const chartRef = useRef(null);
  const inView = useInView(chartRef, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const largest = Math.max(...rows.map((row) => row.total), 1);
  const highestId = rows.find((row) => row.total === largest)?.id;

  return (
    <div ref={chartRef} className={styles.chart} role="group" aria-label="Monthly cost comparison. Exact amounts are also in the table below.">
      <div className={styles.grid} aria-hidden="true"><span /><span /><span /><span /></div>
      <div className={styles.columns}>
        {rows.map((row, index) => {
          const canExplore = Boolean(onExplore) && (Boolean(row.children) || row.type === 'pod');
          const Element = canExplore ? 'button' : 'div';
          return (
            <Element
              key={row.id}
              className={styles.column}
              onClick={canExplore ? () => onExplore(row) : undefined}
              aria-label={canExplore ? `Explore ${row.name}, ${money(row.total)} per month` : undefined}
            >
              <span className={styles.value}>{money(row.total, true)}</span>
              <span className={styles.track} aria-hidden="true">
                <motion.span
                  className={`${styles.bar} ${row.id === highestId ? styles.highest : ''}`}
                  style={{ height: `${row.total / largest * 100}%` }}
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  animate={{ scaleY: inView || reduceMotion ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
              <span className={styles.label}>{row.name}{canExplore && <span aria-hidden="true"> ↗</span>}</span>
            </Element>
          );
        })}
      </div>
    </div>
  );
}
