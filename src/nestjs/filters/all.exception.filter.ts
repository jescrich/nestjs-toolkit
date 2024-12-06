import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, BadRequestException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AxiosError } from 'axios'; // Make sure Axios is installed
import { ErrorResponse } from './error.response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const defaultHttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const isError = (exception && exception.stack && exception.message) !== undefined;

    // Initialize default error properties
    let message = exception.message ?? 'Internal server error';
    let httpStatus = isError ? exception.status ?? defaultHttpStatus : defaultHttpStatus;
    class CustomError extends Error {
      status?: number;
    }

    let upstreamUrl = exception.upstreamUrl ?? undefined;

    if (exception instanceof CustomError) {
      message = exception.message;
      httpStatus = exception.status ?? defaultHttpStatus;
    }

    if (exception instanceof BadRequestException) {
      message = (exception.getResponse() as { message: string })?.message;
      httpStatus = exception.getStatus();
    }

    // Handling Axios errors to include upstream information
    if (exception.isAxiosError) {
      const axiosError = exception as AxiosError;
      httpStatus = httpStatus ?? axiosError.response?.status ?? defaultHttpStatus;
      message = (axiosError.response?.data as { message?: string })?.message || axiosError.message;

      // Extract and include upstream URL information
      upstreamUrl = axiosError.config?.url ?? 'Unknown upstream URL';

      // Optionally include more details from the Axios error
    }

    const responseBody: ErrorResponse = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter?.getRequestUrl(ctx.getRequest()) ?? '',
      message,
      upstreamUrl,
      data: isError ? exception.stack : exception,
    };

    httpAdapter?.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
