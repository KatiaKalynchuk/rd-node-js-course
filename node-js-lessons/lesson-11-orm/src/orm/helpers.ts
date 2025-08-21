import { Product } from '../repositories/product.repo';

export const getObjEntries = (obj: object) => {
  const keys = Object.keys(obj);
  const values = Object.values(obj);

  return { keys, values };
};

export const quoteIdent = (name: string) => {
  // quote "name" and double the inner quotes (in case of non-standard identifiers)
  return `"${name.replace(/"/g, '""')}"`;
};

export const columnsAndValues = (
  obj: Partial<Product>,
): {
  cols: string;
  placeholders: string;
  values: any[];
} => {
  const { keys, values } = getObjEntries(obj);

  const cols = keys.map((k) => quoteIdent(k)).join(', ');
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

  return { cols, placeholders, values };
};

export const buildWhere = (filters?: Partial<Product>) => {
  if (!filters || Object.keys(filters).length === 0) {
    return { whereSQL: '', values: [] };
  }

  const { keys, values } = getObjEntries(filters);
  const parts = keys.map((k, i) => `${quoteIdent(String(k))} = $${i + 1}`);

  return { whereSQL: ` WHERE ${parts.join(' AND ')}`, values };
};
