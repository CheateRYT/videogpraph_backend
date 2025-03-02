import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pageName: string;

  @Column()
  path: string;

  @Column()
  order: number;
}
