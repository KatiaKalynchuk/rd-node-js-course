import fs from 'node:fs';
const path = './database.json';

export const readDatabase = () => {
  if (!fs.existsSync(path)) return [];
  const raw = fs.readFileSync(path);
  return JSON.parse(raw);
};

export const writeDatabase = (data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
