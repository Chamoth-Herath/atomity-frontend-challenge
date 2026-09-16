import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCostTree, costColumns, efficiency, fetchCosts, sumCosts } from '../src/data/costs.js';

const products = Array.from({ length: 64 }, (_, index) => ({
  id: index + 1,
  title: `Example record ${index + 1}`,
  price: (index + 1) * 3.27,
  discountPercentage: index % 20,
}));

test('all 64 records appear once and every level reconciles to the same bill', () => {
  const clusters = buildCostTree(products);
  const namespaces = clusters.flatMap((cluster) => cluster.children);
  const pods = namespaces.flatMap((namespace) => namespace.children);
  assert.equal(clusters.length, 4);
  assert.equal(namespaces.length, 16);
  assert.equal(pods.length, 64);
  assert.equal(new Set(pods.map((pod) => pod.id)).size, 64);
  assert.equal(sumCosts(clusters).total, 680160);
  assert.equal(sumCosts(namespaces).total, 680160);
  assert.equal(sumCosts(pods).total, 680160);
  for (const row of [...clusters, ...namespaces, ...pods]) {
    assert.equal(costColumns.reduce((sum, { key }) => sum + row[key], 0), row.total);
  }
});

test('partial groups keep the final record, while empty data stays empty', () => {
  const clusters = buildCostTree(products.slice(0, 17));
  assert.equal(clusters.length, 2);
  assert.equal(clusters[1].children[0].children[0].id, 'pod-17');
  assert.equal(sumCosts(clusters).podCount, 17);
  assert.deepEqual(buildCostTree([]), []);
});

test('zero and one-cent costs do not create NaN or negative amounts', () => {
  const clusters = buildCostTree([
    { id: 1, title: 'Zero', price: 0, discountPercentage: 0 },
    { id: 2, title: 'Small', price: 0.01, discountPercentage: 100 },
  ]);
  const [zero, small] = clusters[0].children[0].children;
  assert.equal(efficiency(zero), 100);
  assert.equal(efficiency(small), 0);
  assert.equal(small.total, 1);
  assert.equal(small.network, 1);
  assert.ok(costColumns.every(({ key }) => small[key] >= 0));
});

test('invalid or duplicate API records fail instead of showing made-up costs', () => {
  for (const input of [undefined, [null], [{}], [products[0], products[0]],
    [{ ...products[0], price: '5' }], [{ ...products[0], price: -1 }],
    [{ ...products[0], discountPercentage: 101 }]]) {
    assert.throws(() => buildCostTree(input), /unexpected response/);
  }
});

test('failed HTTP responses reach the error path', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));
  await assert.rejects(fetchCosts(), /could not load/);
});

test('malformed JSON reaches the error path', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('not json'));
  await assert.rejects(fetchCosts(), SyntaxError);
});
