export class UpdateTodoDto {
  title?: string;
  completed?: boolean;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  urgency?: 'normal' | 'urgent';
  userId?: number;
  supervisorId?: number;
}
