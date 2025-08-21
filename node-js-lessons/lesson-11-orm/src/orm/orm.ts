import { Pool } from 'pg';
import SQL from 'sql-template-strings';
import {
  getObjEntries,
  quoteIdent,
  columnsAndValues,
  buildWhere,
} from './helpers';

export class Orm<T extends { id: string }> {
  constructor(
    private table: string,
    private pool: Pool,
  ) {}

  async find(filters?: Partial<T>): Promise<T[]> {
    const { whereSQL, values } = buildWhere(filters);
    const { text } = SQL`SELECT * FROM `.append(this.table).append(whereSQL);

    const { rows } = await this.pool.query(text, values);
    return rows;
  }

  async findOne(id: T['id']): Promise<T | null> {
    const query = SQL`SELECT * FROM `
      .append(this.table)
      .append(SQL` WHERE id = ${id} LIMIT 1`);

    const { rows } = await this.pool.query(query);
    return rows[0] ?? null;
  }

  async save(entity: Omit<T, 'id'>): Promise<T> {
    const { cols, placeholders, values } = columnsAndValues(entity);

    const { text } = SQL`INSERT INTO `
      .append(this.table)
      .append(` (${cols}) VALUES (${placeholders}) RETURNING *`);

    const { rows } = await this.pool.query(text, values);
    return rows[0];
  }

  async update(id: T['id'], patch: Partial<Omit<T, 'id'>>): Promise<T> {
    const { keys, values } = getObjEntries(patch);

    if (keys.length === 0) {
      const current = await this.findOne(id);
      if (!current) throw new Error(`Entity with id=${id} not found`);
      return current;
    }

    const setClause = keys
      .map((k, i) => `${quoteIdent(k)} = $${i + 1}`)
      .join(', ');

    const { text } = SQL`UPDATE `
      .append(this.table)
      .append(` SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`);

    const { rows } = await this.pool.query(text, [...values, id]);
    return rows[0];
  }

  async delete(id: T['id']): Promise<void> {
    const { text, values } = SQL`DELETE FROM `
      .append(this.table)
      .append(SQL` WHERE id = ${id}`);
    await this.pool.query(text, values);
  }
}
