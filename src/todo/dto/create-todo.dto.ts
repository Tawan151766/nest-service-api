export class CreateTodoDto {
  title: string;
  userId: number;
  supervisorId: number;
  priority?: 'low' | 'medium' | 'high';
  urgency?: 'normal' | 'urgent';
}
