import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  expiresAt!: Date;

  @Column()
  revoked!: boolean;

  @ManyToOne(() => User)
  user: User;
}
