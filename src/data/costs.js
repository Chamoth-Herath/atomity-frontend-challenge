export const API_URL = 'https://dummyjson.com/products?limit=64&select=id,title,price,discountPercentage';

export const costColumns = [
  { key: 'cpu', label: 'CPU' },
  { key: 'ram', label: 'RAM' },
  { key: 'storage', label: 'Storage' },
  { key: 'network', label: 'Network' },
  { key: 'gpu', label: 'GPU' },
];

export function buildCostTree(products) {
  const seenIds = new Set();
  if (!Array.isArray(products) || products.some((product) => {
    const valid = product && Number.isInteger(product.id) && product.id > 0
      && !seenIds.has(product.id) && typeof product.title === 'string'
      && product.title.trim() && Number.isFinite(product.price) && product.price >= 0
      && Number.isFinite(product.discountPercentage)
      && product.discountPercentage >= 0 && product.discountPercentage <= 100;
    if (valid) seenIds.add(product.id);
    return !valid;
  })) {
    throw new Error('The data service returned an unexpected response.');
  }

  // Keep costs in cents so totals stay exact.
  const pods = products.map((product) => {
    const total = Math.round(product.price * 100);
    const cpu = Math.floor(total * 0.45);
    const ram = Math.floor(total * 0.25);
    const storage = Math.floor(total * 0.1);
    const gpu = Math.floor(total * 0.12);

    return {
      id: `pod-${product.id}`,
      name: `Pod ${String(product.id).padStart(2, '0')}`,
      type: 'pod',
      sourceTitle: product.title,
      total, cpu, ram, storage, gpu,
      network: total - cpu - ram - storage - gpu,
      waste: Math.round(total * product.discountPercentage / 100),
      podCount: 1,
    };
  });

  const clusters = [];
  for (let start = 0; start < pods.length; start += 16) {
    const clusterNumber = clusters.length + 1;
    const clusterPods = pods.slice(start, start + 16);
    const namespaces = [];
    for (let offset = 0; offset < clusterPods.length; offset += 4) {
      const number = namespaces.length + 1;
      namespaces.push(makeGroup(
        `namespace-${clusterNumber}-${number}`, `Namespace ${number}`, 'namespace',
        clusterPods.slice(offset, offset + 4),
      ));
    }
    clusters.push(makeGroup(`cluster-${clusterNumber}`, `Cluster ${clusterNumber}`, 'cluster', namespaces));
  }
  return clusters;
}

function makeGroup(id, name, type, children) {
  return { id, name, type, children, ...sumCosts(children) };
}

export function sumCosts(rows) {
  const keys = ['total', 'waste', 'podCount', ...costColumns.map(({ key }) => key)];
  return Object.fromEntries(keys.map((key) => [key, rows.reduce((sum, row) => sum + row[key], 0)]));
}

export function efficiency(row) {
  return row.total === 0 ? 100 : Math.round((1 - row.waste / row.total) * 100);
}

export async function fetchCosts() {
  // Reuse the pending request during quick remounts.
  const response = await fetch(API_URL, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('We could not load the example costs. Please try again.');
  const data = await response.json();
  return buildCostTree(data.products);
}
