import { pathToFileURL } from 'url';
import fsSync from 'fs';
import { resolveRoutePath } from '../utils/resolveRoutePath.js';
import { sendResponse } from '../utils/sendResponse.js';

const routeCache = new Map();

async function loadRouteModule(routePath) {
  watchRouteFile(routePath);
  const url = pathToFileURL(routePath).href + `#${Date.now()}`; // cache buster
  return await import(url);
}

function watchRouteFile(filePath) {
  if (routeCache.has(filePath)) return;

  fsSync.watch(filePath, () => {
    routeCache.delete(filePath);
  });

  routeCache.set(filePath, true);
}

export async function router(req, res) {
  const { method, url } = req;

  const { routePath, params } = await resolveRoutePath(url);
  const route = await loadRouteModule(routePath);

  const handler = route[method];

  if (!handler) {
    sendResponse(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  handler(req, res, params)
    .catch((err) => sendResponse(res, err.statusCode, { error: err.message }));
}
