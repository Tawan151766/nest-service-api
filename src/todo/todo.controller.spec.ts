import { Test } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';

describe('TodoService', () => {
  let service: TodoService;
  let repo: Repository<Todo>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repo = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });
});
