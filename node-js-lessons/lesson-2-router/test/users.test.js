import test from 'node:test';
import assert from 'node:assert';
import http from 'http';

const BASE_URL = 'http://localhost:3000';

async function fetchJson(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(BASE_URL + path, { method: options.method || 'GET', headers: { 'Content-Type': 'application/json' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

test('GET /users returns array', async () => {
  const res = await fetchJson('/users');
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.data));
});

test('POST /users creates user', async () => {
  const res = await fetchJson('/users', {
    method: 'POST',
    body: { name: 'Alice' }
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.data.name, 'Alice');
  assert.ok(res.data.id);
});
