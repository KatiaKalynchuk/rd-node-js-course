// CommonJS варіант
const { Client } = require('pg');
const fs = require('fs');

(async () => {
  const sql = fs.readFileSync('./RC-vs-RU/init.sql', 'utf8');
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  await client.connect();
  await client.query(sql);
  await client.end();
})();
