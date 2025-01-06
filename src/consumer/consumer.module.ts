import { DynamicModule, Module, Type } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { KafkaClient, KafkaModule } from '@this/kafka';
import { ModuleRef } from '@nestjs/core';
import { ConsumerRefService } from './consumer.ref';

@Module({})
export class ConsumerModule {
  static register(params: { name: string; brokers: string; providers?: Type<any>[]; consumers: Type<any>[] }): DynamicModule {

    const { name, brokers, consumers, providers } = params;

    return {
      module: ConsumerModule,
      imports: [KafkaModule.register({ ...params, clientId: params.name + '-client' })],
      providers: [
        {
          provide: ConsumerRefService,
          useFactory: () => {
            return new ConsumerRefService(consumers);
          },
        },
        {
          provide: ConsumerService,
          useFactory: (kafkaClient: KafkaClient, consumerRef: ConsumerRefService, moduleRef: ModuleRef) => {
            return new ConsumerService(params.name, kafkaClient, consumerRef, moduleRef);
          },
          inject: [KafkaClient, ConsumerRefService, ModuleRef],
        },
        ...providers ?? [],
        ...params.consumers,
      ],
      exports: [ConsumerService],
    };
  }
}
