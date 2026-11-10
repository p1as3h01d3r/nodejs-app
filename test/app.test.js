import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { createApp } from '../src/app.js';

test('returns only the helloworld JSON string', async (t) => {
  const server = createApp();

  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  server.listen(0, '127.0.0.1');
  await once(server, 'listening');

  const response = await fetch(`http://127.0.0.1:${server.address().port}/`);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
  assert.equal(body, '"helloworld"');
  assert.equal(JSON.parse(body), 'helloworld');
});
