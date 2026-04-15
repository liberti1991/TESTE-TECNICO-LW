import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErroHttpResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
}

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException
      ? exception.getResponse()
      : null;

    const message = this.extrairMensagem(exceptionResponse);

    const erroResponse: ErroHttpResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.originalUrl || request.url,
      message,
    };

    response.status(status).json(erroResponse);
  }

  private extrairMensagem(response: string | object | null): string | string[] {
    if (typeof response === 'string') {
      return response;
    }

    if (response && typeof response === 'object' && 'message' in response) {
      const { message } = response as { message?: string | string[] };
      if (message) {
        return message;
      }
    }

    return 'Erro interno do servidor';
  }
}
