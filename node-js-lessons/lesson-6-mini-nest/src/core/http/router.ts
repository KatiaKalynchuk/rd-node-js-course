import express, { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { container } from '../container';
import { Type } from '../types';
import { GuardsMiddleware } from './middlewares/guards.middleware';
import { HandlerMiddleware } from './middlewares/handler.middleware';
import { FiltersMiddleware } from './middlewares/filters.middleware';
import { asyncHandler } from './async.handler';
import MetadataKeys from '../decorators/keys';

export class NestFactory {
  static create(rootModule: any) {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const router = express.Router();
    const globalGuards: Array<Type> = [];
    const globalPipes: Array<Type> = [];
    const globalFilters: Array<Type> = [];

    function registerRoutesFromModule(mod: any) {
      const meta = Reflect.getMetadata(MetadataKeys.MODULE, mod);
      if (!meta) return;

      (meta.imports || []).forEach((imp: any) => registerRoutesFromModule(imp));

      (meta.controllers || []).forEach((Ctl: any) => {
        const prefix = Reflect.getMetadata(MetadataKeys.CONTROLLER, Ctl) ?? '';
        const routes = Reflect.getMetadata(MetadataKeys.ROUTES, Ctl) ?? [];

        const instance = container.resolve(Ctl) as InstanceType<typeof Ctl>;

        routes.forEach((r: any) => {
          const handler = instance[r.handlerName];
          const path = prefix + r.path;

          const methodFilters =
            Reflect.getMetadata(MetadataKeys.FILTERS, Ctl.prototype, r.handlerName) || [];
          const classFilters =
            Reflect.getMetadata(MetadataKeys.FILTERS, Ctl) || [];
          const filters = [
            ...globalFilters,
            ...classFilters,
            ...methodFilters,
          ];

          (router as any)[r.method](
            path,
            asyncHandler(GuardsMiddleware(Ctl, handler, globalGuards)),
            asyncHandler(HandlerMiddleware(instance, handler, globalPipes)),
            FiltersMiddleware(Ctl, handler, [...filters, ...filters]),
          );
        });
      });
    }

    container.registerModule(rootModule);
    registerRoutesFromModule(rootModule);

    app.use(router);

    return {
      get: container.resolve.bind(container),
      listen: (port: number, callback?: () => void) => {
        app.use(((err: any, req: Request, res: Response, next: NextFunction) => {
          FiltersMiddleware(rootModule, () => {}, globalFilters)(err, req, res, next);
        }) as ErrorRequestHandler);

        app.listen(port, callback);
      },
      use: (path: string, handler: express.RequestHandler) =>
        app.use(path, handler),
      useGlobalGuards: (guards: any[]) => globalGuards.push(...guards),
      useGlobalPipes: (pipes: any[]) => globalPipes.push(...pipes),
      useGlobalFilters: (filters: any[]) => globalFilters.push(...filters),
      useGlobalInterceptors: (_: any[]) => {
        throw new Error('Interceptors are not implemented yet');
      },
    };
  }
}
