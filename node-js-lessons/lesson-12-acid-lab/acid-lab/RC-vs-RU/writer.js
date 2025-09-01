import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const postId = process.argv[2];

console.log(new Date().toISOString(), 'writer: BEGIN');
await client.query('BEGIN');

console.log(new Date().toISOString(), 'writer: UPDATE...');
await client.query(`UPDATE posts SET title='Temp' WHERE id=$1`, [postId]);

console.log(new Date().toISOString(), 'writer: sleeping 5s...');
await client.query('SELECT pg_sleep(5)');

console.log(new Date().toISOString(), 'writer: COMMIT');
await client.query('COMMIT');

await client.end();
