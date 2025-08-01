import express from 'express';
import { container } from '../container';
import { Type } from '../types';
import { GuardsMiddleware } from './middlewares/guards.middleware';
import { HandlerMiddleware } from './middlewares/handler.middleware';
import { FiltersMiddleware } from './middlewares/filters.middleware';
import { asyncHandler } from './async.handler';
import MetadataKeys from '../decorators/keys';

function loadModuleTree(moduleClass: any, visited = new Set()) {
  if (visited.has(moduleClass)) return;
  visited.add(moduleClass);

  const meta = Reflect.getMetadata(MetadataKeys.MODULE, moduleClass);
  if (!meta) return;

  // Рекурсивно завантажити імпорти
  for (const importedModule of meta.imports || []) {
    loadModuleTree(importedModule, visited);
  }

  // Реєстрація провайдерів
  for (const provider of meta.providers || []) {
    container.register(provider, provider);
  }

  // Реєстрація контролерів
  for (const controller of meta.controllers || []) {
    container.register(controller, controller);
  }
}

export function Factory(modules: any[]) {
  const app = express();

  app.use(express.json());

  const router = express.Router();
  const globalGuards: Array<Type> = [];
  const globalPipes: Array<Type> = [];
  const globalFilters: Array<Type> = [];

  const listen = (port: number, callback?: () => void) => {
    const visitedModules = new Set();

    for (const module of modules) {
      loadModuleTree(module, visitedModules);
    }

    for (const mod of visitedModules) {

      const meta = Reflect.getMetadata(MetadataKeys.MODULE, mod);
      if (!meta) continue;

      for (const Ctl of meta.controllers ?? []) {
        container.register(Ctl, Ctl);
        const prefix = Reflect.getMetadata(MetadataKeys.CONTROLLER, Ctl) ?? '';
        const routes = Reflect.getMetadata(MetadataKeys.ROUTES, Ctl) ?? [];

        const instance = container.resolve(Ctl) as InstanceType<typeof Ctl>;

        routes.forEach((r: any) => {
          const handler = instance[r.handlerName] as (
            ...args: any[]
          ) => Promise<any>;

          const path = prefix + r.path;

          (router as any)[r.method](
            path,
            asyncHandler(GuardsMiddleware(Ctl, handler, globalGuards)),
            asyncHandler(HandlerMiddleware(instance, handler, globalPipes)),
            asyncHandler(FiltersMiddleware(Ctl, handler, globalFilters))
          );
        });
      }
    }

    app.listen(port, callback);
  };

  app.use(router);

  return {
    get: container.resolve,
    listen,
    use: (path: string, handler: express.RequestHandler) => {
      app.use(path, handler);
    },
    useGlobalGuards: (guards: any[]) => {
      globalGuards.push(...guards);
    },
    useGlobalPipes: (pipes: any[]) => {
      globalPipes.push(...pipes);
    },
    useGlobalFilters: (filters: any[]) => {
      globalFilters.push(...filters);
    },
    useGlobalInterceptors: (interceptors: any[]) => {
      throw new Error('Interceptors are not implemented yet');
    },
  };
}
