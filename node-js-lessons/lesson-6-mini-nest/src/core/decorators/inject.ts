import MetadataKeys from './keys';

export function Inject(token: any): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const existing = Reflect.getMetadata(MetadataKeys.INJECT_TOKENS, target) || new Map<number, any>();

    existing.set(parameterIndex, token);

    Reflect.defineMetadata(MetadataKeys.INJECT_TOKENS, existing, target);
  }
}

export function getInjectedTokenMap(target: any): Map<number, any> {
  return Reflect.getMetadata(MetadataKeys.INJECT_TOKENS, target) ?? new Map();
}
