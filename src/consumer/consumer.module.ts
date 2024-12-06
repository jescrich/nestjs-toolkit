import { Module, Type } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { KafkaClient, KafkaClientModule } from '@this/kafka';

@Module({})
export class ConsumerModule {
  static register(params: { name: string; brokers: string, consumers: Type<any>[] }) {
    return {
      module: ConsumerModule,
      imports: [KafkaClientModule.register({ ...params, clientId: params.name + '-client' })],
      providers: [
        {
            provide: ConsumerService,
            useFactory: (kafkaClient: KafkaClient) => {
                return new ConsumerService(params.name, kafkaClient);
            },
            inject: [KafkaClient],
        }
      ],
      exports: [ConsumerService],
    };
  }
}
