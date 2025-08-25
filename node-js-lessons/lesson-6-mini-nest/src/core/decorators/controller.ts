import MetadataKeys from './keys';

const CONTROLLERS = new Set<any>();

export function Controller(prefix = ''): ClassDecorator {
  return (target) => {
    CONTROLLERS.add(target);
    Reflect.defineMetadata(MetadataKeys.CONTROLLER, prefix, target);
  }
}
