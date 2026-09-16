import { costColumns, efficiency } from '../data/costs';
import { money } from '../utils/format';
import styles from './ResourceTable.module.css';

export default function ResourceTable({ rows, onExplore, type }) {
  return (
    <div>
      <p className={styles.scrollHint}>Scroll sideways to see every cost.</p>
      <div className={styles.scrollArea} role="region" aria-label="Detailed resource costs, scroll horizontally if needed" tabIndex={0}>
        <table className={styles.table}>
          <caption className="srOnly">Monthly example costs in US dollars, grouped by {type.toLowerCase()}. Efficiency is an illustrative percentage.</caption>
          <thead><tr>
            <th scope="col">{type}</th>
            {costColumns.map(({ key, label }) => <th key={key} scope="col">{label}</th>)}
            <th scope="col">Efficiency</th><th scope="col">Total</th>
          </tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  {onExplore && (row.children || row.type === 'pod')
                    ? <button className={styles.resource} onClick={() => onExplore(row)} title={row.type === 'pod' ? `Sample source: ${row.sourceTitle}` : undefined}>{row.name}<span aria-hidden="true"> ↗</span></button>
                    : <span className={styles.pod} title={row.sourceTitle ? `Sample source: ${row.sourceTitle}` : undefined}>{row.name}</span>}
                </th>
                {costColumns.map(({ key }) => <td key={key}>{money(row[key])}</td>)}
                <td><span className={styles.efficiency}>{efficiency(row)}%</span></td>
                <td className={styles.total}>{money(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
