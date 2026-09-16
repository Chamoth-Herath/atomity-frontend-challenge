import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs({ trail, onBack }) {
  const items = [{ id: 'root', name: 'All clusters' }, ...trail];
  return (
    <nav aria-label="Cost explorer location" className={styles.breadcrumbs}>
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            {index > 0 && <span className={styles.separator} aria-hidden="true">/</span>}
            {index === items.length - 1
              ? <span aria-current="page" className={styles.current}>{item.name}</span>
              : <button onClick={() => onBack(index)}>{item.name}</button>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
