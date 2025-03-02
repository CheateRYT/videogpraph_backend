import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty()
  pageName: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class UpdatePhotoDto extends PartialType(CreatePhotoDto) {}
