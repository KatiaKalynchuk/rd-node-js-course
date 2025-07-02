import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROUTES_DIR = path.resolve(__dirname, '../routes');

export async function resolveRoutePath(url) {
  const segments = url.split('/').filter(Boolean);
  let currPath = ROUTES_DIR;
  const params = {};

  for (const segment of segments) {
    const entries = await fs.readdir(currPath);
    if (entries.includes(segment)) {
      currPath = path.join(currPath, segment);
    } else {
      const dynamic = entries.find(e => /^\[.+\]$/.test(e));
      if (dynamic) {
        const paramName = dynamic.slice(1, -1);
        params[paramName] = segment;
        currPath = path.join(currPath, dynamic);
      } else {
        const err = new Error('Not found');
        err.statusCode = 404;
        throw err;
      }
    }
  }

  const routePath = path.join(currPath, 'route.js');
  await fs.access(routePath);

  return { routePath, params };
}
