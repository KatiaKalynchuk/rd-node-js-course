# Profiles API (NestJS)

Demo project with Profiles CRUD, validation, logging, and tests.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Endpoints

- `POST /profiles (Auth required: Authorization: Bearer test)`
- `GET /profiles`
- `GET /profiles/:id`

## Curl examples

```bash
curl -X POST http://localhost:3000/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test" \
  -d '{
    "email": "thewitcher@test.com",
    "displayName": "Geralt of Rivia",
    "age": 150
  }'
```

```bash
curl http://localhost:3000/profiles/1
```

```bash
curl http://localhost:3000/profiles
```
