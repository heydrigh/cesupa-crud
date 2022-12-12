import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class UserVerification {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @Column()
  @ApiProperty()
  expiresAt!: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;

  @Column({ type: 'varchar', length: 20 })
  @ApiProperty()
  token: string;

  @ManyToOne(() => User, { eager: true })
  user: User;
}
