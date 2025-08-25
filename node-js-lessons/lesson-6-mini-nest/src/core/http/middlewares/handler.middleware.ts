import { Request, Response } from 'express';
import { ArgumentMetadata, Type } from '../../types';
import { extractParams } from '../../utils/extract';
import { runPipes } from '../../decorators/use-pipes';
import MetadataKeys from '../../decorators/keys';

const getHandlerArgs = async (
  Ctl: Function,
  handler: Function,
  req: Request,
  globalPipes: Array<Type>
) => {
  const paramMeta: Array<ArgumentMetadata> =
    Reflect.getMetadata(MetadataKeys.PARAMS, Ctl) ?? [];
  const methodMeta: Array<ArgumentMetadata> = paramMeta.filter((m) =>
    handler.name?.includes(m?.name || '')
  );

  const sortedMeta = [...methodMeta].sort((a, b) => a.index - b.index);
  const args: any[] = [];

  for (const metadata of sortedMeta) {
    const extracted = extractParams(req, metadata.type);
    const argument = metadata.data ? extracted[metadata.data] : extracted;
    try {
      args[metadata.index] = await runPipes(Ctl, handler, argument, metadata, globalPipes);
    } catch (error: any) {
      throw error;
    }
  }

  return args;
};

export const HandlerMiddleware = (
  instance: Type,
  handler: Function,
  globalPipes: Array<Type>
) => {
  return async (req: Request, res: Response) => {
    const args = await getHandlerArgs(
      instance.constructor,
      handler,
      req,
      globalPipes
    );

    const result = await handler.apply(instance, args);
    res.json(result);
  };
};
