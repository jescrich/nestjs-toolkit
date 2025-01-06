import { Injectable, Logger } from '@nestjs/common';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { Kafka, logLevel } from 'kafkajs';
import { IEventHandler } from './kafka.event.handler';

@Injectable()
export class KafkaClient {
  private readonly logger = new Logger(KafkaClient.name);
  kafka: Kafka;

  constructor(
    private readonly clientId?: string,
    private readonly brokers?: string,
  ) {
    this.kafka = new Kafka({
      clientId: clientId,
      brokers: brokers?.split(',') ?? ['localhost:9092'],
      logLevel: logLevel.WARN,
    });
  }

  async produce<T>(topic: string, key: string, event: T): Promise<void> {
    try {
      this.logger.log(`Producing event ${key} to topic ${topic}`);

      const producer = this.kafka.producer();

      await producer.connect();

      await producer.send({
        topic,
        messages: [
          {
            key: key,
            value: JSON.stringify(event),
          },
        ],
      });

      this.logger.log(`Event ${key} produced successfully`);
      await producer.disconnect();
    } catch (e) {
      throw new Error(`Error producing kafka event ${key}`);
    }
  }

  async consume<T>(topic: string, groupId: string, handler: IEventHandler<T>): Promise<void> {
    const consumer = this.kafka.consumer({ groupId });

    const RETRY_DELAY_MS = 30000;

    const RETRY_LIMIT = 3;

    const retryCounts: Map<string, number> = new Map();

    const processMessage = async (key: string, value: any, payload: KafkaMessage) => {
      const content = value?.toString() ?? null;

      this.logger.log(`Event: ${content}`);

      if (content === null) {
        this.logger.error('Event content is null');

        return;
      }

      const event: T = JSON.parse(content);

      await handler.handle({ key, event, payload: payload as any });
    };

    const sendToDeadLetterQueue = async (message: KafkaMessage) => {
      const producer = this.kafka.producer();
      await producer.connect();
      await producer.send({
        topic: `${topic}-dlq`,
        messages: [
          {
            key: message.key,
            value: message.value,
          },
        ],
      });
      await producer.disconnect();
      this.logger.warn(`Message offset ${message.offset} sent to DLQ.`, topic);
    };

    const runConsumer = async () => {
      await consumer.connect();

      await consumer.subscribe({ topic, fromBeginning: true });

      await consumer.run({
        eachBatchAutoResolve: false,
        eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
          for (const message of batch.messages) {
            if (!isRunning() || isStale()) break;

            const { topic, partition } = batch;

            const offsetKey = `${topic}-${partition}-${message.offset}`;

            const retries = retryCounts.get(offsetKey) || 0;

            try {
              this.logger.log(`Processing message offset ${message.offset} ${message.key}`, topic);

              const key = message.key?.toString() ?? '';
              await processMessage(key, message.value, message);

              resolveOffset(message.offset);
              this.logger.log(`Message offset ${message.offset} processed successfully`, topic);
              retryCounts.delete(offsetKey);
            } catch (error) {
              this.logger.error(`Error processing message offset ${message.offset}: ${error}`, topic);

              if (retries < RETRY_LIMIT) {
                retryCounts.set(offsetKey, retries + 1);

                this.logger.warn(`Retrying message offset ${message.offset}...`, topic);

                consumer.pause([{ topic, partitions: [partition] }]);

                setTimeout(async () => {
                  this.logger.log(`Resuming message offset ${message.offset}...`, topic);
                  consumer.resume([{ topic, partitions: [partition] }]);
                }, RETRY_DELAY_MS);
              } else {
                this.logger.warn(`Exceeded retry limit for message offset ${message.offset}`, topic);
                resolveOffset(message.offset);
                // Send to DLQ after exceeding retry limit
                await sendToDeadLetterQueue(message);
                retryCounts.delete(offsetKey); // Clear retry count
              }
            }

            await heartbeat();
          }
        },
      });
    };

    runConsumer().catch((error) => {
      this.logger.error('Error starting Kafka consumer:', error);
    });
  }
}
