import test from 'node:test';
import assert from 'node:assert/strict';
import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { cacheSettings, costQuery } from '../src/data/queryClient.js';

const responseData = { products: [{ id: 1, title: 'Example', price: 12.5, discountPercentage: 10 }] };

test('a brief unmount and remount share one pending request', async (t) => {
  let finishRequest;
  const request = t.mock.method(globalThis, 'fetch', () => new Promise((resolve) => {
    finishRequest = () => resolve(Response.json(responseData));
  }));
  const client = new QueryClient({ defaultOptions: { queries: cacheSettings } });
  const first = new QueryObserver(client, costQuery);
  const stopFirst = first.subscribe(() => {});
  stopFirst();
  const second = new QueryObserver(client, costQuery);
  const stopSecond = second.subscribe(() => {});
  try {
    finishRequest();
    const result = await client.fetchQuery(costQuery);
    assert.equal(request.mock.callCount(), 1);
    assert.equal(result[0].total, 1250);
    assert.deepEqual(client.getQueryData(costQuery.queryKey), result);
  } finally {
    stopSecond();
    client.clear();
  }
});

test('fresh revisits use cached data; a stale request gets new data', async (t) => {
  const request = t.mock.method(globalThis, 'fetch', async () => Response.json(responseData));
  const client = new QueryClient({ defaultOptions: { queries: cacheSettings } });
  try {
    const first = await client.fetchQuery(costQuery);
    assert.equal(await client.fetchQuery(costQuery), first);
    assert.equal(request.mock.callCount(), 1);
    client.setQueryData(costQuery.queryKey, first, { updatedAt: Date.now() - cacheSettings.staleTime - 1 });
    await client.fetchQuery(costQuery);
    assert.equal(request.mock.callCount(), 2);
  } finally {
    client.clear();
  }
});
