// src/admin/dto/login.dto.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class AdminLoginDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  login: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}