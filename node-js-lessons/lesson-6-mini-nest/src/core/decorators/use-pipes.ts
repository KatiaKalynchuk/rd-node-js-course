import { ArgumentMetadata, Type } from '../types';
import { isClass } from '../utils/is-class';
import { container } from '../container';
import MetadataKeys from './keys';

export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata: ArgumentMetadata): R | Promise<R>;
}

type PipesType = Type<PipeTransform> | InstanceType<Type<PipeTransform>>;

export function UsePipes(
  ...pipes: PipesType[]
): ClassDecorator & MethodDecorator {
  return (target: any, key?: string | symbol) => {
    const where = key ? target[key] : target;
    Reflect.defineMetadata(MetadataKeys.PIPES, pipes, where);
  };
}

/** Збирає глобальні + класові + метод-пайпи у правильному порядку */
export function getPipes(
  handler: Function,
  controller: Function,
  globalPipes: PipesType[] = []
): PipesType[] {
  const classPipes = Reflect.getMetadata(MetadataKeys.PIPES, controller) ?? [];
  const methodPipes = Reflect.getMetadata(MetadataKeys.PIPES, handler) ?? [];
  return [...globalPipes, ...classPipes, ...methodPipes];
}

export async function runPipes (
  controllerCls: Function,
  handler: Function,
  value: unknown,
  meta: ArgumentMetadata,
  globalPipes: PipesType[] = []
) {
  const pipes = getPipes(handler, controllerCls, globalPipes);

  let transformed = value;

  for (const PipeCtor of pipes) {
    const pipeInstance = isClass(PipeCtor)
      ? container.resolve<PipeTransform>(PipeCtor)
      : PipeCtor;

    transformed = await Promise.resolve(
      pipeInstance.transform(transformed, meta)
    );
  }
  return transformed;
}
