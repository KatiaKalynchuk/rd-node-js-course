# 🍵 Tea Tracker API

A production-ready, modular API for tracking tea consumption — built with **NestJS**, **TypeScript**, and **Zod**. Includes custom decorators, guards, rate limiting, Swagger docs, and Docker support.

---

## 🚀 Features

* ✅ **NestJS** + **TypeScript strict mode**
* ✅ **Zod-based validation** via custom `@ZBody()`
* ✅ **API Key authentication** via `x-api-key` header
* ✅ **Custom decorators**: `@Public()`, `@ZBody()`
* ✅ **Global exception filters and interceptors**
* ✅ **Swagger** docs with schema generation
* ✅ **Rate limiting**
* ✅ **Dockerized**
* ✅ **Graceful shutdown**
* ✅ **In-memory database** (ideal for prototyping)

---

## 📦 Installation

```bash
npm install
```

### 🧪 Run in dev mode

```bash
npm run start:dev
```

### 🐳 Run with Docker

```bash
docker build -t tea-tracker .
docker run -p 3000:3000 -e API_KEY=im_rd_student tea-tracker
```

---

## 🔐 Authentication

All endpoints are protected by default and require an `x-api-key` header.

Set your API key via `.env`:

```
API_KEY=im_rd_student
```

Or pass it in Swagger UI using **"Authorize"**.

---

## 📘 API Docs

Once running:

* Swagger UI: [http://localhost:3000/docs](http://localhost:3000/docs)
* OpenAPI JSON: [http://localhost:3000/docs-json](http://localhost:3000/docs-json)

---

## 🧪 Example Endpoints

### Create a Tea Entry

```http
POST /tea
x-api-key: im_rd_student
Content-Type: application/json

{
  "name": "Sencha",
  "origin": "Japan",
  "temperature": 70
}
```

### Get All Teas

```http
GET /tea
x-api-key: im_rd_student
```

---

## 💠 Tech Stack

* **Framework:** [NestJS](https://nestjs.com/)
* **Validation:** [Zod](https://zod.dev/)
* **Swagger:** [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)
* **DI/Config:** `@nestjs/config`
* **Rate Limiting:** `@nestjs/throttler`
* **Dockerized:** Alpine + Node.js 20

---

## 𞷼 Code Quality

* ESLint + Prettier
* Zod schema safety
* TypeScript `strict` mode
* Linted Dockerfile
* Guarded against unsafe `.env`

---
