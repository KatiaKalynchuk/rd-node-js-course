import MetadataKeys from './keys';

const CONTROLLERS = new Set<any>();

export function Controller(prefix = ''): ClassDecorator {
  return (target) => {
    CONTROLLERS.add(target);
    Reflect.defineMetadata(MetadataKeys.CONTROLLER, prefix, target);
  }
}

export function getControllerPrefix(target: any): string {
  return Reflect.getMetadata(MetadataKeys.CONTROLLER, target) || '';
}

export function getAllControllers(): any[] {
  return Array.from(CONTROLLERS);
}
