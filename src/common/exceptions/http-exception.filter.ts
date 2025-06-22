import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Messages } from '../constants/message';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = Messages.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string'
        ? res
        : (res as any).message || exception.message;
    }

    else if (
      exception instanceof JsonWebTokenError ||
      exception instanceof TokenExpiredError
    ) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message === 'jwt expired'
        ? Messages.TOKEN_EXPIRED
        : Messages.TOKEN_INVALID;
    }

    else if (
      exception?.message === 'Unknown authentication strategy "jwt"' ||
      exception?.message === 'No auth token'
    ) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Autenticação JWT não encontrada ou mal configurada';
    }

    if (exception.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = 'Registro já existe com esse usuário ou e-mail.';
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
