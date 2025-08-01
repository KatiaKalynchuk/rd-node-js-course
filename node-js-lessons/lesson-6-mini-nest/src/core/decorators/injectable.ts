import { container } from '../container';
import { ClassConstructor } from '../types';

export function Injectable() {
  return function(target: ClassConstructor) {
    container.register(target, target);
  }
}
