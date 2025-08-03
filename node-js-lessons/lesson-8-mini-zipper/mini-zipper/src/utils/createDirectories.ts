import * as fs from 'fs/promises';
import {
  TMP_DIR_UNZIPPED,
  OUTPUT_DIR,
  TMP_DIR_ZIPS,
} from '../system/constants.js';

const dirs = [TMP_DIR_ZIPS, TMP_DIR_UNZIPPED, OUTPUT_DIR];

export const createDirectories = async (dirsPaths: string[]) => {
  const promises = dirsPaths.map((item) => fs.mkdir(item, { recursive: true }));

  await Promise.all(promises);
};

export const createDistDirectories = async () => createDirectories(dirs);

export const remove = async (paths: string[]) => {
  const promises = paths.map((item) =>
    fs.rm(item, { recursive: true, force: true }),
  );

  await Promise.all(promises);
};
