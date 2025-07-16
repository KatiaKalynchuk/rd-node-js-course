# ☕️ Coffee Brew Log API

A small but production-ready API to log your coffee brewing sessions. Ideal for practicing modern Express.js architecture and design patterns.

---

## 🌟 Features

* RESTful CRUD for `Brew` resource (one cup = one record)
* Filter brews by method and rating.
* Zod validation with clear error messages
* Swagger UI docs at `/docs` generated from Zod DTOs
* Middleware pipeline: `helmet`, `cors`, `compression`, logging
* Rate limit: 10 `POST /api/brews` per minute
* Awilix DI container with scoped/singleton layers
* Graceful shutdown on SIGINT/SIGTERM
* ESBuild bundling and lightweight Docker image (<150 MB)

---

## 📊 Data Model: BrewDTO

| Field      | Type                                             | Required | Description                         |
| ---------- | ------------------------------------------------ | -------- | ----------------------------------- |
| `beans`    | `string` (3-40 chars)                            | Yes      | Name or blend of the beans          |
| `method`   | `'v60'`, `'aeropress'`, `'chemex'`, `'espresso'` | Yes      | Brewing method                      |
| `rating`   | `number` (1–5)                                   | No       | How much you liked the brew         |
| `notes`    | `string` (max 200)                               | No       | Free-form notes                     |
| `brewedAt` | `string` (ISO date)                              | No       | Brew date/time; defaults to `now()` |

---

## 📅 API Endpoints

| Method | Path             | Description                       |
| ------ | ---------------- | --------------------------------- |
| GET    | `/api/brews`     | List all brews (optional filters) |
| GET    | `/api/brews/:id` | Get a brew by ID                  |
| POST   | `/api/brews`     | Create a new brew                 |
| PUT    | `/api/brews/:id` | Update a brew by ID               |
| DELETE | `/api/brews/:id` | Delete a brew by ID               |

---

## 🔍 Example Filters (GET /api/brews)

```http
GET /api/brews?method=espresso&ratingMin=4
GET /api/brews?beans=ethiopia
GET /api/brews?brewedBefore=2025-07-01
```

---

## 📄 Swagger Docs

View full API schema at:

**[http://localhost:3000/docs](http://localhost:3000/docs)**

Powered by `@asteasolutions/zod-to-openapi` + `swagger-ui-express`.

---

## ⚙️ Scripts

```bash
# Dev mode with live reload
npm run dev

# Production build (ESBuild)
npm run build

# Run compiled bundle
npm start
```

---

## 🛥️ Docker

```bash
# Build Docker image
docker build -t brew-api .

# Run container on port 3000
docker run -p 3000:3000 brew-api
```

Multi-stage build, Alpine base, image size < 150 MB.

---

## 📁 Project Structure

```
.
├── src/
│   ├── dto/              # BrewDTO Zod schema
│   ├── models/           # In-memory BrewModel
│   ├── services/         # BrewService (logic layer)
│   ├── controllers/      # BrewController (handlers)
│   ├── routes/           # Routes + Swagger registry
│   ├── middlewares/      # Error handling, validation
│   ├── docs/             # OpenAPI registry
│   ├── container.js      # Awilix container config
    ├── app.js            # Express setup
│   └── server.js         # HTTP + graceful shutdown
├── eslint.config.js      # Eslint config
├── build.mjs             # ESBuild bundler
├── package.json          
├── package-lock.json
├── Dockerfile            # Multi-stage Docker build
└── .dockerignore
```
