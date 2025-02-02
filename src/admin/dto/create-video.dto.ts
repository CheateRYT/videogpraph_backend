import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  userId: number; // ID пользователя, которому будет добавлено видео
}
