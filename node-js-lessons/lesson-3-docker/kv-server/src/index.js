import http from 'http';
import { URL } from 'url';
import { sendResponse, parseRequestData } from './utils.js';

const redisUrl = process.env.REDIS_URL || 'http://localhost:4000';
const port = 3000;

const server = http.createServer(async (req, res) => {
  try {
    const { url, method, headers } = req;
    const { pathname, searchParams } = new URL(url, `http://${headers.host}`);

    if (method === 'GET' && pathname === '/get') {
      const key = searchParams.get('key');
      const response = await fetch(`${redisUrl}/get?key=${encodeURIComponent(key)}`);
      const data = await response.json();
      sendResponse(res, 200, data);
      return;
    }

    if (method === 'POST' && pathname === '/set') {
      const data = await parseRequestData(req);

      const { key, value } = data;

      if (key) {
        await fetch(`${redisUrl}/set`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value })
        });
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

server.listen(port, () => {
  console.log(`KV-server running on port ${port}`);
});
