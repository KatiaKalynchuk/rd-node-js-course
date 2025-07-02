# 📂 Folder-based Router CRUD API (Node.js)

This project implements a minimalist REST API with **folder-based routing**, inspired by the Next.js App Router, using only built-in Node.js modules (`http`, `fs`, `path`, `url`).

## 🌟 Goals

* Gain a deeper understanding of `http.createServer`
* Learn how to implement file-based routing with support for dynamic segments (e.g., `/users/[id]`)
* Separate concerns using a layered structure: `route → controller → service → model`
* Discover the limitations of "raw" Node.js and prepare for using frameworks like Express or Nest

---

## 📁 Project Structure

```
.
├── index.js                 # Entry point (starts HTTP server)
├── lib/
│   └── router.js           # Core router logic
├── routes/                 # File-based route definitions
│   └── users/
│       ├── route.js        # Handles GET/POST /users
│       └── [id]/
│           └── route.js    # Handles GET/PUT/DELETE /users/:id
├── services/
│   └── users.service.js    # Data access logic for users
├── database.json           # JSON-based "DB"
├── test/
│   └── users.test.js       # Basic tests for /users routes
```

---

## ⚙️ Features

* ✅ **Folder-based routing**: `routes/users/route.js` → `/users`
* 🧩 **Dynamic segments**: `[id]` folders map to URL parameters like `/users/123`
* 🔁 **Hot reload**: Route files are re-imported automatically on each request using query-string invalidation
* ❌ **Zero dependencies**: Uses only core Node.js modules
* 🧱 **Layered architecture**: Clear separation between routing, logic, and data access
* 📂 **JSON-based database**: Simple flat file (`database.json`) for persistence
* ❌ **Error handling**: Proper `404`, `405`, `500` status codes with JSON responses
* 🧪 **Tests**: Minimal test suite using `node:test`

---

## 🚀 Usage

### 🛠 Installation

```bash
git clone https://github.com/KatiaKalynchuk/rd-node-js-course
cd rd-node-js-course/lesson-2-router
npm install
```

### 2. Start the server

```bash
npm start
```

Server will run on: [http://localhost:3000](http://localhost:3000)

---

## 🦪 Examples (using curl)

Create a user:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'
```

Get all users:

```bash
curl http://localhost:3000/users
```

Get single user:

```bash
curl http://localhost:3000/users/USER_ID
```

Update user:

```bash
curl -X PUT http://localhost:3000/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated"}'
```

Delete user:

```bash
curl -X DELETE http://localhost:3000/users/USER_ID
```

---

## 🪤 Error Examples

* `404 Not Found`: path not matched or user not found
* `405 Method Not Allowed`: unsupported HTTP method (e.g., `PATCH`)
* `500 Internal Server Error`: unhandled exception in route or service
