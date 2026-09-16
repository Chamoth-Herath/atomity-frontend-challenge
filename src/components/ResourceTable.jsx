import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { costColumns, efficiency } from '../data/costs';
import { money } from '../utils/format';
import styles from './ResourceTable.module.css';

const easeOut = [0.22, 1, 0.36, 1];

export default function ResourceTable({ rows, onExplore, type }) {
  const tableRef = useRef(null);
  const inView = useInView(tableRef, { once: true, amount: 0.18 });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={tableRef}>
      <p className={styles.scrollHint}>Scroll sideways to see every cost.</p>
      <div className={styles.scrollArea} role="region" aria-label="Detailed resource costs, scroll horizontally if needed" tabIndex={0}>
        <table className={styles.table}>
          <caption className="srOnly">Monthly resource costs in US dollars, grouped by {type.toLowerCase()}. Efficiency is shown as a percentage.</caption>
          <thead><tr>
            <th scope="col" className={styles.resourceColumn}>{type}</th>
            {costColumns.map(({ key, label }) => <th key={key} scope="col" className={styles[key]}>{label}</th>)}
            <th scope="col" className={styles.efficiencyColumn}>Efficiency</th><th scope="col" className={styles.totalColumn}>Total</th>
          </tr></thead>
          <tbody>
            {rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                animate={{ opacity: inView || reduceMotion ? 1 : 0, y: inView || reduceMotion ? 0 : 7 }}
                transition={{ duration: reduceMotion ? 0 : 0.34, delay: reduceMotion ? 0 : index * 0.045, ease: easeOut }}
              >
                <th scope="row" className={styles.resourceColumn}>
                  {onExplore && (row.children || row.type === 'pod')
                    ? <button className={styles.resource} onClick={() => onExplore(row)} title={row.type === 'pod' ? `Source reference: ${row.sourceTitle}` : undefined}>{row.name}<span aria-hidden="true"> ↗</span></button>
                    : <span className={styles.pod} title={row.sourceTitle ? `Source reference: ${row.sourceTitle}` : undefined}>{row.name}</span>}
                </th>
                {costColumns.map(({ key }) => <td key={key} className={styles[key]}>{money(row[key])}</td>)}
                <td className={styles.efficiencyColumn}><span className={styles.efficiency}>{efficiency(row)}%</span></td>
                <td className={`${styles.total} ${styles.totalColumn}`}>{money(row.total)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
