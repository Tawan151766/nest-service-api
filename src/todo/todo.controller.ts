// src/todo/todo.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('todo')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll() {
    return this.todoService.find();
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todoService.create(dto);
  }
  @Patch('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTodoDto) {
    return this.todoService.update(id, body);
  }
  @Patch('status/:id')
  updateStatus(@Param('id') id: number, @Body() body: UpdateStatusDto) {
    return this.todoService.updateStatus(id, body.completed);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.todoService.remove(id);
  }
  @Get('me')
  getMyTodos(@Req() req: any) {
    return this.todoService.findByUserId(req.user.userId);
  }
  @Get('user-summary')
  getUserSummary(@Req() req: any) {
    return this.todoService.getUserSummary(req.user.userId);
  }
  @Get('admin/summary-all')
  getSummaryAll() {
    return this.todoService.getSummaryAllUsers();
  }
}
