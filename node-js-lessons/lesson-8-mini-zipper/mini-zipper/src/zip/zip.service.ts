import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import { performance } from 'node:perf_hooks';
import { Worker } from 'node:worker_threads';
import { Mutex } from 'async-mutex';
import AdmZip from 'adm-zip';

import { randomUUID } from 'crypto';
import { createDirectories, remove } from '../utils/createDirectories.js';
import {
  TMP_DIR_UNZIPPED,
  OUTPUT_DIR,
  WORKER_PATH,
} from '../system/constants.js';
import { getRelativePath, getAllImagePaths } from '../utils/path.js';
import { SharedState, WorkerData } from '../types.js';

const createDistFileDirectories = async () => {
  const reqId = randomUUID();

  const tmpDirUnzipped = path.join(TMP_DIR_UNZIPPED, reqId);
  const outputDir = path.join(OUTPUT_DIR, reqId);

  await createDirectories([tmpDirUnzipped, outputDir]);

  return { tmpDirUnzipped, outputDir };
};

const extractFiles = async (zipFilePath: string, outputPath: string) => {
  const zip = new AdmZip(zipFilePath);
  zip.extractAllTo(outputPath, true);

  return getAllImagePaths(outputPath);
};

const mutex = new Mutex();

const runThumbnailWorker = (
  workerPath: string,
  workerData: WorkerData,
  state: SharedState,
) => {
  return new Promise<void>((resolve) => {
    const worker = new Worker(workerPath, {
      workerData,
    });

    worker.on('message', async (status: 'processed' | 'skipped') => {
      const release = await mutex.acquire();
      state[status]++;
      release();
    });

    worker.on('error', async () => {
      const release = await mutex.acquire();
      state.skipped++;
      release();
    });

    worker.on('exit', () => resolve());
  });
};

@Injectable()
export class ZipService {
  async processZip(zipFilePath: string) {
    const startTime = performance.now();

    const { tmpDirUnzipped, outputDir } = await createDistFileDirectories();

    const files = await extractFiles(zipFilePath, tmpDirUnzipped);

    const state: SharedState = { processed: 0, skipped: 0 };

    const workers = files.map((imgPath: string) =>
      runThumbnailWorker(
        getRelativePath(WORKER_PATH),
        { inputPath: imgPath, outputPath: outputDir },
        state,
      ),
    );

    await Promise.allSettled(workers);
    const endTime = performance.now();

    await remove([tmpDirUnzipped, zipFilePath]);

    return {
      processed: state.processed,
      skipped: state.skipped,
      durationMs: Math.round(endTime - startTime),
    };
  }
}
