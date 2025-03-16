import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'; // Импортируем декораторы валидации из библиотеки class-validator
import { PartialType } from '@nestjs/mapped-types'; // Импортируем PartialType для создания частично обновляемых DTO
// Класс для создания нового фото
export class CreatePhotoDto {
  @IsString() // Указываем, что поле должно быть строкой
  @IsNotEmpty() // Указываем, что поле не должно быть пустым
  pageName: string; // Поле для хранения имени страницы, на которой находится фото
  @IsString() // Указываем, что поле должно быть строкой
  @IsNotEmpty() // Указываем, что поле не должно быть пустым
  path: string; // Поле для хранения пути к фото
  @IsNumber() // Указываем, что поле должно быть числом
  @IsOptional() // Указываем, что поле является необязательным
  order?: number; // Поле для хранения порядка отображения фото (необязательное)
}
// Класс для обновления информации о фото
export class UpdatePhotoDto extends PartialType(CreatePhotoDto) {} // Создаем класс UpdatePhotoDto, который наследует все поля из CreatePhotoDto как необязательные
