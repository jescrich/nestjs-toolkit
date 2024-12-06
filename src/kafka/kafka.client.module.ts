import { DynamicModule, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { KafkaClient } from './kafka.client';

@Module({})
export class KafkaModule {
  static register(parmas: { clientId: string; brokers: string }): DynamicModule {
    const { clientId, brokers } = parmas;

    if (!brokers) {
      throw new Error('Unable to create KafkaClientModule: missing brokers');
    }

    const providers = [
      JwtService,
      {
        provide: KafkaClient,
        useFactory: () => new KafkaClient(clientId, brokers),
      },
    ];
    return {
      module: KafkaModule,
      providers,
      exports: [KafkaClient],
    };
  }
}
