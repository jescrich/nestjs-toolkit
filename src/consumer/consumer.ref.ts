import { Injectable, Logger, Type } from '@nestjs/common';

@Injectable()
export class ConsumerRefService {
  private readonly logger = new Logger(ConsumerRefService.name);
  constructor(private readonly consumers: Type<any>[]) {
    this.logger.log(`Initializing consumer references`);
    this.logger.log(`Found ${this.consumers.length} consumers`);
  }

  resolve(): Type<any>[] {
    return this.consumers;
  }
}
