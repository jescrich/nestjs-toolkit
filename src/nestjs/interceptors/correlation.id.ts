import { HttpService } from '@nestjs/axios';
import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';

export class CorrelationIdInterceptor implements NestInterceptor {
  private CorrelationIdHeader = 'x-correlation-id';
  private readonly logger = new Logger(CorrelationIdInterceptor.name);

  constructor(private readonly httpService: HttpService) {
    this.logger.log('Initializing CorrelationId Interceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    let correlationId = context.switchToHttp().getRequest().headers[this.CorrelationIdHeader];

    if (!correlationId) {
      correlationId = randomUUID();
    }

    context.switchToHttp().getRequest().headers[this.CorrelationIdHeader] = correlationId;
    context.switchToHttp().getResponse().setHeader(this.CorrelationIdHeader, correlationId);

    if (this.httpService) {
      this.httpService.axiosRef.defaults.headers[this.CorrelationIdHeader] = correlationId;
    }

    return next.handle();
  }
}
