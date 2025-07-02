import http from 'http';
import { router } from './lib/router.js';
import { sendResponse } from './utils/sendResponse.js';

const server = http.createServer(async (req, res) => {
  try {
    await router(req, res);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, { error: 'Internal Server Error' });
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
