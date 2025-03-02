import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  link: string;
}
