import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { costColumns, efficiency } from '../data/costs';
import { money } from '../utils/format';

const easeOut = [0.22, 1, 0.36, 1];

const headCell = 'overflow-hidden text-ellipsis whitespace-nowrap px-[0.45rem] py-[0.7rem] text-right text-xs font-bold tracking-[0.01em] text-[var(--color-muted)] max-[768px]:px-[0.3rem] max-[768px]:py-[0.6rem] max-[768px]:text-[0.6875rem] max-[480px]:px-[0.15rem] max-[480px]:py-2 max-[480px]:text-[0.58rem] max-[480px]:tracking-[-0.02em]';
const bodyCell = 'overflow-hidden text-ellipsis whitespace-nowrap px-[0.45rem] py-[0.7rem] text-right text-[var(--color-muted)] max-[768px]:px-[0.3rem] max-[768px]:py-[0.6rem] max-[480px]:px-[0.15rem] max-[480px]:py-2 max-[480px]:tracking-[-0.015em]';

export default function ResourceTable({ rows, onExplore, type, activeId, onActiveChange }) {
  const tableRef = useRef(null);
  const inView = useInView(tableRef, { once: true, amount: 0.18 });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={tableRef}>
      <div className="mx-4 overflow-hidden rounded-[0.875rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] max-[768px]:mx-2 max-[480px]:mx-0 max-[480px]:rounded-lg" role="region" aria-label="Detailed resource costs">
        <table className="w-full table-fixed border-collapse text-right text-[0.8125rem] tabular-nums max-[768px]:text-xs max-[480px]:text-[0.625rem]">
          <thead className="bg-[var(--color-muted-surface)]">
            <tr>
              <th scope="col" className={`${headCell} w-[22%] pl-3 text-left max-[768px]:w-[21%] max-[480px]:w-[20%] max-[480px]:pl-[0.35rem]`}>{type}</th>
              {costColumns.map(({ key, label }) => <th key={key} scope="col" className={headCell}>{label}</th>)}
              <th scope="col" className={`${headCell} w-[12%] max-[768px]:w-[12.5%] max-[480px]:w-[13%]`}>Efficiency</th>
              <th scope="col" className={`${headCell} w-[12%] pr-3 max-[768px]:w-[12.5%] max-[480px]:w-[12%] max-[480px]:pr-[0.35rem]`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isActive = activeId === row.id;
              const isDimmed = Boolean(activeId) && !isActive;
              const canExplore = Boolean(onExplore) && (Boolean(row.children) || row.type === 'pod');

              return (
                <motion.tr
                  key={row.id}
                  className={`group border-t border-[var(--color-border)] bg-[var(--color-surface)] outline-none transition-[opacity,background-color,box-shadow] duration-150 ease-out first:border-t-0 hover:bg-[var(--surface-accent)] hover:[box-shadow:inset_3px_0_0_var(--color-accent)] focus-visible:[box-shadow:inset_3px_0_0_var(--color-accent)] ${canExplore ? 'cursor-pointer' : ''} ${isActive ? 'bg-[var(--surface-accent-strong)] [box-shadow:inset_3px_0_0_var(--color-accent)]' : ''} ${isDimmed ? 'opacity-45' : 'opacity-100'}`}
                  tabIndex={canExplore ? 0 : undefined}
                  onClick={canExplore ? () => onExplore(row) : undefined}
                  onKeyDown={canExplore ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onExplore(row);
                    }
                  } : undefined}
                  onMouseEnter={() => onActiveChange?.(row.id)}
                  onMouseLeave={() => onActiveChange?.(null)}
                  onFocus={() => onActiveChange?.(row.id)}
                  onBlur={() => onActiveChange?.(null)}
                  aria-label={canExplore ? `Open ${row.name}` : undefined}
                  initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                  animate={{ opacity: inView || reduceMotion ? 1 : 0, y: inView || reduceMotion ? 0 : 7 }}
                  transition={{ duration: reduceMotion ? 0 : 0.34, delay: reduceMotion ? 0 : index * 0.045, ease: easeOut }}
                >
                  <th scope="row" className={`${bodyCell} w-[22%] pl-3 text-left max-[768px]:w-[21%] max-[480px]:w-[20%] max-[480px]:pl-[0.35rem]`}>
                    <span
                      className={`inline-flex min-h-[38px] w-full items-center whitespace-normal p-0 text-left font-bold leading-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] group-focus-visible:text-[var(--color-accent)] max-[480px]:min-h-[34px] max-[480px]:text-[0.625rem] ${isActive ? 'text-[var(--color-accent)]' : ''}`}
                      title={row.sourceTitle ? `Source reference: ${row.sourceTitle}` : undefined}
                    >
                      {row.name}
                    </span>
                  </th>

                  {costColumns.map(({ key }) => <td key={key} className={bodyCell}>{money(row[key])}</td>)}

                  <td className={`${bodyCell} w-[12%] max-[768px]:w-[12.5%] max-[480px]:w-[13%]`}>
                    <span className="inline-block max-w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-[0.35rem] py-[0.2rem] text-[var(--color-accent)] max-[480px]:px-[0.2rem] max-[480px]:py-[0.15rem]">
                      {efficiency(row)}%
                    </span>
                  </td>
                  <td className={`${bodyCell} w-[12%] pr-3 font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] group-focus-visible:text-[var(--color-accent)] max-[768px]:w-[12.5%] max-[480px]:w-[12%] max-[480px]:pr-[0.35rem] ${isActive ? 'text-[var(--color-accent)]' : ''}`}>
                    {money(row.total)}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
