import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const postId = process.argv[2];
const level = process.argv[3]; // 'RC' or 'RU'

console.log(new Date().toISOString(), `reader: BEGIN ${level}`);
await client.query('BEGIN');

if (level === 'RC') {
  await client.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
} else if (level === 'RU') {

  await client.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
  await client.query('SET default_transaction_read_only = on');
  await client.query('LOCK TABLE posts IN SHARE MODE');
}

for (let i = 1; i <= 3; i++) {
  const res = await client.query('SELECT title FROM posts WHERE id=$1', [
    postId,
  ]);
  console.log(
    new Date().toISOString(),
    `reader: attempt ${i}`,
    res.rows[0].title,
  );
  await new Promise((r) => setTimeout(r, 2000));
}

await client.query('COMMIT');
await client.end();
