import 'reflect-metadata';
import MetadataKeys from './keys';

type FilterType = new (...args: any[]) => any;

export function UseFilters(...filters: Array<FilterType>) {
  return function (target: any, propertyKey?: string | symbol) {
    if (propertyKey) {
      Reflect.defineMetadata(MetadataKeys.FILTERS, filters, target, propertyKey);
    } else {
      Reflect.defineMetadata(MetadataKeys.FILTERS, filters, target);
    }
  };
}
