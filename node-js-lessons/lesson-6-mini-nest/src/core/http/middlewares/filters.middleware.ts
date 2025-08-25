import { Type } from '../../types';
import { ErrorRequestHandler } from 'express';

export const FiltersMiddleware = (
  Ctl: Type,
  handler: Function,
  filters: Array<Type>
): ErrorRequestHandler => {
  return (err, req, res, next) => {
    for (const Filter of filters) {
      const instance = new Filter();

      if (typeof instance.catch === 'function') {
        instance.catch(err, req, res);
        return;
      }
    }

    next(err);
  };
};
