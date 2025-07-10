import http from 'node:http';
import { sendResponse, parseRequestData } from './utils.js';

const store = new Map();

const server = http.createServer(async (req, res) => {
  try {
    const { url, method, headers } = req;
    const { pathname, searchParams } = new URL(url, `http://${headers.host}`);

    if (method === 'GET' && pathname === '/get') {
      const key = searchParams.get('key');
      const value = store.get(key) ?? null;

      sendResponse(res, 200, { value: value || null });
      return;
    }

    if (method === 'POST' && pathname === '/set') {
      const { key, value } = await parseRequestData(req);

      if (key) {
        store.set(key, value);
      }

      sendResponse(res, 200, { message: 'Value set successfully' });
      return;
    }

    sendResponse(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, { error: 'Internal Server Error' });
  }
});

server.listen(4000, () => console.log('Redis-like running on port 4000'));
