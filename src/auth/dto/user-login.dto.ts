import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  personalData:string
}
