# NestJS Auth + Admin API

## Project Overview

This is a NestJS mini-project demonstrating server-side authentication, authorization, and rate-limiting:

* JWT authentication with **accessToken** (short-lived) and **refreshToken** (long-lived)
* Basic authentication (Base64 encoded)
* Role-based authorization (`user` and `admin` roles)
* Protected routes
* Global rate-limiting

---

## 📦 Installation

```bash
npm install
```

### 🧪 Run in dev mode

```bash
npm run start:dev
```

## Modules

### Auth Module

* `POST /auth/login` — login with JSON body or Basic Auth header
* `POST /auth/refresh` — refresh access token using refresh token
* `GET /auth/profile` — protected route, returns user profile

### Admin Module

* `GET /admin/metrics` — admin-only route returning application metrics

---

## Users

Two initial users are included:

| ID | Email                                             | Password | Roles |
| -- | ------------------------------------------------- | -------- | ----- |
| 1  | [thewitcher@test.com](mailto:thewitcher@test.com) | 123123   | admin |
| 2  | [geralt@test.com](mailto:geralt@test.com)         | qwerty   | user  |

---

## Example cURL Requests

### 1. Login with JSON body (admin)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"thewitcher@test.com","password":"123123"}'
```

### 2. Login with JSON body (user)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"geralt@test.com","password":"qwerty"}'
```

### 3. Login with Basic Auth (admin)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Authorization: Basic dGhld2l0Y2hlckB0ZXN0LmNvbToxMjMxMjM="
```

### 4. Login with Basic Auth (user)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Authorization: Basic Z2VyYWx0QHRlc3QuY29tOnF3ZXJ0eQ=="
```

### 5. Refresh access token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<YOUR_REFRESH_TOKEN>"}'
```

### 6. Get profile (protected route)

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 7. Admin-only metrics

```bash
curl -X GET http://localhost:3000/admin/metrics \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

> Using a non-admin token will return `403 Forbidden`.

---

## Notes

* Access token expires quickly (e.g., 5 minutes). Refresh token lasts longer (e.g., 7 days).
* `req.user` is populated from JWT payload. Roles are always a flat array (e.g., `roles: ['admin']`).
* Exceeding rate limits will return `429 Too Many Requests`.
* Passwords are stored hashed with bcrypt.
* Basic Auth is just Base64 encoding, not encryption.

---

## Technologies

* NestJS
* JWT (`@nestjs/jwt`)
* Passport (`@nestjs/passport`)
* Class-validator & class-transformer
* bcryptjs
* Global rate-limiting (`@nestjs/throttler` or custom middleware)
