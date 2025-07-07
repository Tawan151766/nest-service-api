import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';  // เพิ่มตรงนี้
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';    // นำเข้า User entity

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // เพิ่มเพื่อเชื่อม User entity
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],  // ถ้า Auth module จะเรียกใช้ด้วย ให้ export
})
export class UsersModule {}
