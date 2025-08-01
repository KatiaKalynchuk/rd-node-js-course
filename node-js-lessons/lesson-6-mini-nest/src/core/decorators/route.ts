import MetadataKeys from './keys';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export function Route(method: Method, path = ''): MethodDecorator {
  return function(target, key) {
    const routes = Reflect.getMetadata(MetadataKeys.ROUTES, target.constructor) ?? [];

    routes.push({ method, path, handlerName: key });

    Reflect.defineMetadata(MetadataKeys.ROUTES, routes, target.constructor);
  }
}

export const Get = (path = '') => Route('get', path);
export const Post = (path = '') => Route('post', path);
export const Put = (path = '') => Route('put', path);
export const Patch = (path = '') => Route('patch', path);
export const Delete = (path = '') => Route('delete', path);
