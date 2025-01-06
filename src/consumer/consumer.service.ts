import { IEventHandler, KafkaClient } from '@this/kafka';
import { ConsumerDef } from './consumer.def';
import { ExecutionContext, Injectable, Logger, OnModuleInit, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Consumer } from '..';
import { ConsumerRefService } from './consumer.ref';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private readonly logger = new Logger(ConsumerService.name);
  constructor(
    private readonly name: string,
    private readonly kafkaClient: KafkaClient,
    private readonly consumerRef: ConsumerRefService,
    private readonly moduleRef: ModuleRef,
  ) {
    this.logger.log(`Initializing consumer ${this.name}`);
  }

  async onModuleInit() {
    const providers = this.consumerRef.resolve();

    // Get all providers with @Consumer decorator
    const consumers = providers.filter((provider: Object) => Reflect.hasMetadata('topic-consumer', provider));

    // Create consumer definitions
    const definitions = consumers.map((ConsumerClass: string | symbol | Function | Type<any>) => {
      const instance = this.moduleRef.get(ConsumerClass);
      const topic = Reflect.getMetadata('topic', ConsumerClass);
      return {
        topic,
        handler: instance,
      } as ConsumerDef<any>;
    });

    // Check if all the consumers implements the IEventHandler interface
    const nonEventHandlers = definitions.filter((definition) => !('handle' in definition.handler));

    if (nonEventHandlers.length) {
      this.logger.error(
        `The following consumers do not implement the IEventHandler interface: ${nonEventHandlers
          .map((definition) => definition.handler.constructor.name)
          .join(', ')}`,
      );
      return;
    }

    // Start consuming
    await this.consumeMany(definitions);

    for (const definition of definitions) {
      const { topic, handler } = definition;
      this.logger.log(`Consumer started.`, topic, handler.constructor.name);
    }
  }

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
