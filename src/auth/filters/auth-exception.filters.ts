import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AuthExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exception as Error;

    this.logger.error(exception, error?.stack);

    const responseBody = {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
    };

    return response.status(HttpStatus.UNAUTHORIZED).json(responseBody);
  }
}
