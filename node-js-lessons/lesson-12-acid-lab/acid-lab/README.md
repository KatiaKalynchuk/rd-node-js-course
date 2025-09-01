# ACID Lab - PostgreSQL + NestJS/TypeORM

This project demonstrates ACID properties in PostgreSQL using NestJS and TypeORM.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
$ docker-compose up --build
```

## Running Migrations in Docker

```bash
$ docker-compose exec app npm run migration:create
```

```bash
$ docker-compose exec app npm run migration:generate
```

```bash
$ docker-compose exec app npm run typeorm migration:run
```

## Run tests

```bash
$ docker-compose exec app npm run test:e2e
```

#### Why PostgreSQL Requires Emulation for RU

```bash
$ docker-compose exec app npm run demo:iso
```

PostgreSQL does not natively support the `READ UNCOMMITTED` isolation level. All transactions use at least `READ COMMITTED`, which means uncommitted changes (dirty reads) are never visible to other transactions. To emulate `READ UNCOMMITTED`, we use `SET default_transaction_read_only = on` combined with table-level `SHARE LOCK`, allowing a transaction to observe changes in progress without violating ACID constraints. This approach visually demonstrates the effect of dirty reads in a controlled environment, even though PostgreSQL enforces a stricter isolation level by default.
