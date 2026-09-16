import styles from './Breadcrumbs.module.css';

const labels = ['All Clusters', 'Clusters', 'Namespace', 'Pod'];

export default function Breadcrumbs({ trail, onBack }) {
  const items = labels.slice(0, Math.min(trail.length + 1, labels.length));

  return (
    <nav aria-label="Cost explorer location" className={styles.breadcrumbs}>
      <ol>
        {items.map((name, index) => (
          <li key={name}>
            {index > 0 && <span className={styles.separator} aria-hidden="true">&gt;</span>}
            {index === items.length - 1
              ? <span aria-current="page" className={styles.current}>{name}</span>
              : <button onClick={() => onBack(index)}>{name}</button>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
