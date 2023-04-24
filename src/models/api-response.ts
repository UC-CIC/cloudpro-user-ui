import { AppError } from './app-error';
import { Message } from './message';

export interface ApiResponse<T = Message> {
  data: T | null;
  error: AppError | null;
}
