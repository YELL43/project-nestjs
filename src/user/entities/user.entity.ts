import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id_user' })
  idUser: number;

  @ApiProperty()
  @Column({ nullable: true, length: 255 })
  userName: string;

  @ApiProperty()
  @Column({ nullable: true, length: 255 })
  passWord: string;

  @ApiProperty()
  @Column({ nullable: true, length: 255 })
  name: string;

  @ApiProperty()
  @Column({ nullable: true, length: 255 })
  lastName: string;

  @ApiProperty()
  @Column('int4', { default: 0 })
  age: number;

  @ApiProperty()
  @Column()
  @Generated('uuid')
  uuid: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_datetime: string;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_datetime: string;
}
