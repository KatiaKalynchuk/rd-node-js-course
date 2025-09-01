import { IsNumberString, IsUUID } from 'class-validator';

export class CreateTransferDto {
  @IsUUID() from_id!: string;
  @IsUUID() to_id!: string;
  @IsNumberString() amount!: string;
}
