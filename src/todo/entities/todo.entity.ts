// src/todo/entities/todo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
export type Priority = 'low' | 'medium' | 'high';
export type Urgency = 'normal' | 'urgent';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column({ nullable: true })
  descriptions: string;
  @Column({ default: false })
  completed: boolean;

  @Column()
  userId: number;

  @Column()
  supervisorId: number;

  @Column({ type: 'varchar', default: 'medium' })
  priority: Priority;

  @Column({ type: 'varchar', default: 'normal' })
  urgency: Urgency;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'supervisorId' })
  supervisor: User;
}
