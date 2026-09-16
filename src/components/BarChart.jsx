import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { money } from '../utils/format';
import AnimatedNumber from './AnimatedNumber';

const easeOut = [0.22, 1, 0.36, 1];

export default function BarChart({ rows, onExplore, activeId, onActiveChange }) {
  const chartRef = useRef(null);
  const inView = useInView(chartRef, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const largest = Math.max(...rows.map((row) => row.total), 1);
  const highestId = rows.find((row) => row.total === largest)?.id;
  const single = rows.length === 1;

  return (
    <div
      ref={chartRef}
      className="relative mx-4 my-6 rounded-[0.875rem] border border-[var(--color-border)] bg-[var(--surface-chart)] px-4 pb-4 pt-5 transition-colors duration-300 max-[480px]:mx-0 max-[480px]:my-5 max-[480px]:px-2 max-[480px]:pb-3 max-[480px]:pt-4"
      role="group"
      aria-label="Monthly cost comparison. Exact amounts are also in the table below."
    >
      <div className="pointer-events-none absolute bottom-16 left-4 right-4 top-[3.8rem] flex flex-col justify-between max-[480px]:bottom-[3.75rem] max-[480px]:left-2 max-[480px]:right-2 max-[480px]:top-[3.3rem]" aria-hidden="true">
        <span className="w-full border-t border-dashed border-[var(--color-border)] opacity-80" />
        <span className="w-full border-t border-dashed border-[var(--color-border)] opacity-80" />
        <span className="w-full border-t border-dashed border-[var(--color-border)] opacity-80" />
        <span className="w-full border-t border-dashed border-[var(--color-border)] opacity-80" />
      </div>

      <div className={single
        ? 'relative grid grid-cols-[minmax(10rem,22rem)] justify-center gap-8 max-[480px]:grid-cols-1 max-[480px]:gap-2'
        : 'relative grid grid-cols-4 gap-[clamp(0.5rem,4vw,3rem)] max-[768px]:gap-[clamp(0.75rem,3vw,1.5rem)] max-[480px]:gap-2'}>
        {rows.map((row, index) => {
          const canExplore = Boolean(onExplore) && (Boolean(row.children) || row.type === 'pod');
          const Element = canExplore ? motion.button : motion.div;
          const isActive = activeId === row.id;
          const isDimmed = Boolean(activeId) && !isActive;

          const stateClasses = isActive
            ? 'border-[var(--color-accent)] bg-[var(--surface-accent-strong)] shadow-[var(--shadow-soft)]'
            : 'border-transparent bg-transparent';
          const dimClasses = isDimmed ? 'opacity-45 saturate-[0.72]' : 'opacity-100';

          return (
            <Element
              layout
              key={row.id}
              className={`group m-0 flex min-w-0 flex-col items-center gap-3 rounded-[0.875rem] border p-2 text-center text-[var(--color-text)] transition-[opacity,filter,background-color,border-color,box-shadow] duration-150 ease-out hover:border-[var(--color-border-strong)] hover:bg-[var(--surface-accent)] hover:shadow-[var(--shadow-soft)] focus-visible:border-[var(--color-accent)] focus-visible:bg-[var(--surface-accent)] ${stateClasses} ${dimClasses} max-[480px]:px-0`}
              onClick={canExplore ? () => onExplore(row) : undefined}
              onMouseEnter={() => onActiveChange?.(row.id)}
              onMouseLeave={() => onActiveChange?.(null)}
              onFocus={() => onActiveChange?.(row.id)}
              onBlur={() => onActiveChange?.(null)}
              aria-label={canExplore ? `Explore ${row.name}, ${money(row.total)} per month` : undefined}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: inView || reduceMotion ? 1 : 0, y: inView || reduceMotion ? 0 : 10 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : index * 0.07, ease: easeOut }}
              whileHover={!reduceMotion ? { y: -3, transition: { duration: 0.16, ease: easeOut } } : undefined}
              whileTap={canExplore && !reduceMotion ? { scale: 1.02, transition: { duration: 0.12 } } : undefined}
            >
              <span className={`text-[clamp(0.875rem,2vw,1.125rem)] font-bold tabular-nums transition-colors group-hover:text-[var(--color-accent)] group-focus-visible:text-[var(--color-accent)] max-[480px]:text-[0.8125rem] ${isActive ? 'text-[var(--color-accent)]' : ''}`}>
                <AnimatedNumber value={row.total} format={(value) => money(value, true)} active={inView} />
              </span>

              <span className={`flex h-[clamp(8rem,22vw,12rem)] w-full items-end justify-center max-[480px]:h-[7.5rem] ${single ? 'max-w-64 justify-self-center max-[480px]:w-[70%] max-[480px]:max-w-48' : ''}`} aria-hidden="true">
                <motion.span
                  layout
                  className={`block w-[min(100%,7rem)] origin-bottom rounded-t-[0.875rem] rounded-b-[0.25rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-[filter,box-shadow] duration-150 group-hover:brightness-[0.97] group-hover:saturate-110 group-focus-visible:brightness-[0.97] ${row.id === highestId ? 'bg-[var(--color-bar-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_7px_18px_rgba(22,122,82,0.12)]' : 'bg-[var(--color-bar)]'} ${isActive ? 'brightness-[1.03] saturate-110 shadow-[0_10px_24px_rgba(22,122,82,0.18)]' : ''} max-[480px]:rounded-t-lg`}
                  style={{ height: `${row.total / largest * 100}%` }}
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  animate={{ scaleY: inView || reduceMotion ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.08 + index * 0.08, ease: easeOut }}
                />
              </span>

              <span className={`min-h-[2.7em] text-sm leading-[1.35] transition-colors group-hover:text-[var(--color-accent)] group-focus-visible:text-[var(--color-accent)] max-[480px]:text-xs max-[480px]:leading-tight ${isActive ? 'text-[var(--color-accent)]' : ''}`}>
                {row.name}
              </span>
            </Element>
          );
        })}
      </div>
    </div>
  );
}
