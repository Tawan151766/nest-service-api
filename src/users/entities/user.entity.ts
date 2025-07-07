// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';

export type UserRole = 'admin' | 'employee';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', default: 'employee' })
  role: UserRole;

  @OneToMany(() => Todo, (todo) => todo.userId)
  todos: Todo[];
}
