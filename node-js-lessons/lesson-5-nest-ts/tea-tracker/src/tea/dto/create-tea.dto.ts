import { ApiProperty } from '@nestjs/swagger';

export class CreateTeaDto {
  @ApiProperty({ minLength: 3, maxLength: 40 })
  name: string;

  @ApiProperty({ minLength: 2, maxLength: 30 })
  origin: string;

  @ApiProperty({ minimum: 1, maximum: 10, required: false })
  rating?: number;

  @ApiProperty({ minimum: 60, maximum: 100, required: false })
  brewTemp?: number;

  @ApiProperty({ maxLength: 150, required: false })
  notes?: string;
}
