export class CreateUserDto {
  username: string;
  password: string;
  role?: 'admin' | 'employee';
}
