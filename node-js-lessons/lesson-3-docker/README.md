# 🐳 Docker Deep Dive: Build, Ship & Orchestrate Your Own Node Stack

This project demonstrates how to containerize and orchestrate a minimal two-service Node.js stack using Docker and Docker Compose.

You’ll build:
- A primitive in-memory key/value store (`redis-like`);
- A proxy API service (`kv-server`) that connects to it via HTTP.

---

## 📦 Services

### 1. `redis-like`
A minimalistic HTTP-based key/value store, built with core Node.js. It stores all data in-memory using a JavaScript `Map`.

#### Endpoints:
- `GET /get?key=foo` → `{"value": "bar" | null}`
- `POST /set` with body: `{"key": "foo", "value": "bar"}` → `{"ok": true}`

---

### 2. `kv-server`
An API server that talks to the redis-like service via HTTP. Also built with core Node.js (no frameworks like Express).

#### Endpoints:
- `GET /kv/:key` → retrieves a value by key.
- `POST /kv` with body: `{"key": "foo", "value": "bar"}` → stores the value via redis-like service.

Reads Redis service URL from the environment: `REDIS_URL`.

---

## 🐳 Docker & Orchestration

### 🔧 Build the project

```bash
docker-compose build
```

### 🚀 Start the services

```bash
docker-compose up
```
This will start both:

`redis` on internal port `4000` (not exposed)

`kv-server` on `localhost:8080`

### 📬 Example Requests
#### Set a key-value pair:
```bash
curl -X POST http://localhost:8080/set \
  -H "Content-Type: application/json" \
  -d '{"key":"hello","value":"world"}'
```

#### Get a value by key:
```bash
curl http://localhost:8080/kv/hello
```

### 🧪 Development mode
The kv-server service supports hot reload using nodemon.
```yaml
volumes:
  - ./kv-server/src:/usr/src/app/src
```
Dev Dockerfile: `Dockerfile.dev`

### 📁 Project Structure
```pgsql
.
├── redis-like/
│   ├── src/index.js
│   ├── package.json
│   ├── eslint.config.js
│   └── Dockerfile
│
├── kv-server/
│   ├── src/index.js
│   ├── package.json
│   ├── eslint.config.js
│   ├── Dockerfile
│   └── Dockerfile.dev
│
└── docker-compose.yml
```

### 🧹 Cleanup
```bash
docker-compose down
```

### 📌 Requirements
- Node.js LTS
- Docker
- Docker Compose