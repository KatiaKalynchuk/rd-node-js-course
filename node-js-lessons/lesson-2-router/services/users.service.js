import fs from 'fs/promises';
import { randomUUID } from 'node:crypto';

const DB_PATH = new URL('../database.json', import.meta.url);

async function readDb() {
  const data = await fs.readFile(DB_PATH);
  return JSON.parse(data);
}

async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getAllUsers() {
  const db = await readDb();
  return db.users || [];
}

export async function getUserById(id) {
  const db = await readDb();
  return (db.users || []).find((user) => user.id === id);
}

export async function createUser(data) {
  const db = await readDb();
  const newUser = { id: randomUUID(), ...data };

  await writeDb({
    ...db,
    users: [...db.users, newUser],
  });

  return newUser;
}

export async function updateUser(id, data) {
  const db = await readDb();
  const users = db.users || [];

  const userId = users.findIndex((user) => user.id === id);
  if (userId === -1) return null;

  users[userId] = { ...users[userId], ...data };

  await writeDb({
    ...db,
    users,
  });
  return users[userId];
}

export async function deleteUser(id) {
  const db = await readDb();
  const users = db.users || [];

  const userId = users.findIndex((user) => user.id === id);
  if (userId === -1) return null;

  users.splice(userId, 1);

  await writeDb({
    ...db,
    users,
  });

  return true;
}
