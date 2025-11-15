import type { ApiResponse, Context } from '../../types';

export abstract class BaseController {
  protected ctx: Context | null = null;

  protected setContext(ctx: Context): void {
    this.ctx = ctx;
  }

  protected success<T = any>(data?: T, message = 'success'): ApiResponse<T> {
    return {
      status: 'success',
      data,
      message,
    };
  }

  protected error(message: string, code = 400): ApiResponse {
    return {
      status: 'error',
      message,
      code,
    };
  }

  protected send<T = any>(response: ApiResponse<T>): void {
    if (!this.ctx) throw new Error('Context not set');
    const statusCode = response.code || (response.status === 'success' ? 200 : 400);
    this.ctx.res.status(statusCode).json(response);
  }
}
