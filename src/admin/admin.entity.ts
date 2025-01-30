import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Admin {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  login: string;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  accessToken: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  refreshToken: string;

}