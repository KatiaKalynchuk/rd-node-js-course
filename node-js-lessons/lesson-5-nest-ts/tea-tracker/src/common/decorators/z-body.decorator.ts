import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { infer as zInfer, ZodError, ZodSchema } from 'zod';

export function ZBody<T extends ZodSchema<unknown>>(schema: T) {
  return createParamDecorator(
    async (_: unknown, ctx: ExecutionContext): Promise<zInfer<T>> => {
      const request = ctx.switchToHttp().getRequest<Request>();

      try {
        return await schema.parseAsync(request.body);
      } catch (err) {
        if (err instanceof ZodError) {
          throw new BadRequestException(err.errors);
        }
        throw new BadRequestException('Invalid request body');
      }
    },
  )();
}
