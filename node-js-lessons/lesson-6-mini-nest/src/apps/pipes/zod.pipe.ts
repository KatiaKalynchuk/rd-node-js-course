import { ZodSchema } from 'zod';
import { ArgumentMetadata } from '../../core/types';
import { PipeTransform } from '../../core/decorators/use-pipes';
import { BadRequestException } from '../../core/errors';

export class ZodValidationPipe implements PipeTransform<any, any> {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, meta: ArgumentMetadata) {
    console.log('value', value);
    try {
      return this.schema.parse(value);
    } catch (err) {
      throw new BadRequestException(`Validation failed for ${meta.type}${meta.data ? ` (${meta.data})` : ''}`)
    }
  }
}
