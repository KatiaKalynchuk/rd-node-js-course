import { IsEmail, IsInt, IsOptional, Min, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsEmail()
  email: string;

  @MinLength(2)
  displayName: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;
}
