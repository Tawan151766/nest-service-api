import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  findByUser(userId: number) {
    return this.todoRepo.find({ where: { userId } });
  }

  async create(dto: CreateTodoDto) {
    const todo = this.todoRepo.create({ ...dto });
    return this.todoRepo.save(todo);
  }

  async update(id: number, dto: UpdateTodoDto) {
    const todo = await this.todoRepo.findOne({ where: { id } });
    if (!todo) throw new NotFoundException('Todo not found');
    Object.assign(todo, dto);
    return this.todoRepo.save(todo);
  }
  async remove(id: number) {
    const res = await this.todoRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Todo not found');
  }
  async find(): Promise<any[]> {
    return this.todoRepo
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.user', 'user')
      .leftJoinAndSelect('todo.supervisor', 'supervisor')
      .select([
        'todo.id',
        'todo.title',
        'todo.descriptions',
        'todo.completed',
        'todo.priority',
        'todo.urgency',
        'user.id',
        'user.username',
        'supervisor.id',
        'supervisor.username',
      ])
      .getMany();
  }
  async findByUserId(userId: number) {
    return this.todoRepo.find({
      where: { userId },
      relations: ['user', 'supervisor'],
      order: { id: 'DESC' },
    });
  }
  //   async getSummary(userId: number) {
  //   const [total, completed] = await Promise.all([
  //     this.todoRepo.count({ where: { userId } }),
  //     this.todoRepo.count({ where: { userId, completed: true } }),
  //   ]);

  //   return {
  //     total,
  //     completed,
  //     pending: total - completed,
  //   };
  // }

  async getUserSummary(userId: number) {
    const [todos, completedCount] = await Promise.all([
      this.todoRepo.find({
        where: { userId },
        relations: ['user', 'supervisor'],
        order: { id: 'DESC' },
      }),
      this.todoRepo.count({ where: { userId, completed: true } }),
    ]);

    return {
      userId,
      total: todos.length,
      completed: completedCount,
      pending: todos.length - completedCount,
      list: todos,
    };
  }

  async getSummaryAllUsers() {
    const result = await this.todoRepo
      .createQueryBuilder('todo')
      .select('todo.userId', 'userId')
      .addSelect('user.username', 'username')
      .addSelect('COUNT(todo.id)', 'total')
      .addSelect(
        'SUM(CASE WHEN todo.completed = true THEN 1 ELSE 0 END)',
        'completed',
      )
      .leftJoin('todo.user', 'user')
      .groupBy('todo.userId')
      .addGroupBy('user.username')
      .getRawMany();

    return result.map((row) => ({
      userId: Number(row.userId),
      username: row.username,
      total: Number(row.total),
      completed: Number(row.completed),
      pending: Number(row.total) - Number(row.completed),
    }));
  }
  async updateStatus(id: number, completed: boolean) {
    const todo = await this.todoRepo.findOneBy({ id });
    if (!todo) throw new NotFoundException('Todo not found');
    todo.completed = completed;
    return this.todoRepo.save(todo);
  }
}
