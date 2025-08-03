import { parentPort, workerData } from 'worker_threads';
import * as path from 'path';
import sharp from 'sharp';
import { WorkerData } from '../types.js';

const run = async () => {
  const { inputPath, outputPath } = workerData as WorkerData;

  const filename = path.basename(inputPath);
  const output = path.join(outputPath, filename);

  try {
    await sharp(inputPath).resize({ width: 150 }).toFile(output);
    parentPort?.postMessage('processed');
  } catch {
    parentPort?.postMessage('skipped');
  }
};

run();
