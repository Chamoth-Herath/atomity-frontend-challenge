const labels = ['All Clusters', 'Clusters', 'Namespace', 'Pod'];

export default function Breadcrumbs({ trail, onBack }) {
  const items = labels.slice(0, Math.min(trail.length + 1, labels.length));

  return (
    <nav aria-label="Cost explorer location" className="min-w-0 max-w-full">
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 max-[480px]:gap-1">
        {items.map((name, index) => (
          <li key={name} className="flex min-h-11 items-center gap-2 text-sm max-[480px]:gap-1 max-[480px]:text-[0.8125rem]">
            {index > 0 && <span className="px-1 text-[var(--color-muted)] opacity-70 max-[480px]:px-0" aria-hidden="true">&gt;</span>}
            {index === items.length - 1
              ? <span aria-current="page" className="px-2 font-bold text-[var(--color-accent)] max-[480px]:px-1">{name}</span>
              : (
                <button
                  className="min-h-11 rounded-lg border-0 bg-transparent px-2 py-2 text-[var(--color-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] max-[480px]:px-1"
                  onClick={() => onBack(index)}
                >
                  {name}
                </button>
              )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
