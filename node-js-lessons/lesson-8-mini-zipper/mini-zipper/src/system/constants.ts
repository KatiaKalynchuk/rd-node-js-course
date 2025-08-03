import path from 'node:path';

export const TMP_DIR = './tmp';
export const TMP_DIR_ZIPS = path.join(TMP_DIR, 'zips');
export const TMP_DIR_UNZIPPED = path.join(TMP_DIR, 'unzipped');
export const OUTPUT_DIR = './output';

export const WORKER_PATH = '../workers/thumbnail.worker.js';
