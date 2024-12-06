import { IEventHandler, KafkaClient } from '@this/kafka';
import { ConsumerDef } from './consumer.def';
import { ExecutionContext, Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);
  constructor(
    private readonly name: string,
    private readonly kafkaClient: KafkaClient,
  ) {}

  async consume<T>(definition: ConsumerDef<T>): Promise<void> {
    const { name, kafkaClient } = this;
    const groupId = `${name}-${definition.topic}-consumer`;
    const { topic, handler } = definition;

    return await kafkaClient.consume(topic, groupId, handler);
  }

  async consumeMany(definitions: ConsumerDef<any>[]): Promise<void> {
    for (const definition of definitions) {
      await this.consume(definition);
    }

    return Promise.resolve();
  }
}
