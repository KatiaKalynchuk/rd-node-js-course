#!/bin/sh
set -e

POST_ID=550e8400-e29b-41d4-a716-446655440000

echo "=== RESET DB ==="
node RC-vs-RU/init-db.js

echo
echo "=== DEMO: READ COMMITTED ==="
node RC-vs-RU/writer.js $POST_ID &
node RC-vs-RU/reader.js $POST_ID RC
wait

echo
echo "=== DEMO: EMULATED READ UNCOMMITTED ==="
node RC-vs-RU/init-db.js
node RC-vs-RU/writer.js $POST_ID &
node RC-vs-RU/reader.js $POST_ID RU
wait
