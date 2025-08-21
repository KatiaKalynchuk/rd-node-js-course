# Mini Sql ORM

A lightweight, dependency-free ORM built on top of Node.js and PostgreSQL using `pg` and `sql-template-strings`. It provides a simple API for CRUD operations while keeping flexibility with raw SQL when needed.

## Features

* **Lightweight**: No external ORM dependencies beyond `pg` and `sql-template-strings`.
* **Generic API**: Type-safe methods like `save`, `findOne`, `find`, `update`, `delete`, `reset`.
* **Safe SQL**: All queries use parameterized SQL with `sql-template-strings` to prevent injection.

## Project Structure

```
src/
  orm/
    orm.ts            # Core ORM implementation
  repositories/
    product.repo.ts   # Example repository usage
  demo.ts             # Demonstration of CRUD operations
  migrations/         # SQL migrations (e.g., table creation)
```

## Installation

```bash
npm install
```

## Usage

```ts
import { Pool } from "pg";
import { Orm } from "./orm/orm";

interface Product {
  id?: string;
  name: string;
  price: number;
}

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "demo",
  password: "postgres",
  port: 5432,
});

const productRepo = new Orm<Product>("products", pool);

// Save a new product
const newProduct = await productRepo.save({ name: "Coffee", price: 120 });

// Find all products
const products = await productRepo.find();

// Update a product
const updated = await productRepo.update(newProduct.id!, { price: 130 });

// Delete a product
await productRepo.delete(newProduct.id!);

// Find one product
const oneProduct = await productRepo.findOne(newProduct.id!);
```

## Roadmap

* [ ] Add support for complex queries and joins
* [ ] Add migrations automation
* [ ] Add TypeScript strict schema validation

## License
MIT
