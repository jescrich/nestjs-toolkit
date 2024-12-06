import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConsumerService } from '../../src/consumer/consumer.service';
import { IEventHandler, KafkaClient } from '@this/kafka';

describe('ConsumerService', () => {
    let kafkaClient: KafkaClient;
    let consumerService: ConsumerService;

    let handlerMock = createMock<IEventHandler<any>>();
    
    beforeEach(() => {
        kafkaClient = new KafkaClient();
        consumerService = new ConsumerService('test-consumer', kafkaClient);
    });

    it('should be defined', () => {
        expect(consumerService).toBeDefined();
    });

    it('should have a name property', () => {
        expect(consumerService['name']).toBe('test-consumer');
    });

    it('should have a kafkaClient property', () => {
        expect(consumerService['kafkaClient']).toBe(kafkaClient);
    });

    it('should startconsume', async () => {
        const consumeSpy = jest.spyOn(kafkaClient, 'consume');
        await consumerService.consume({ topic: 'test-topic', handler: handlerMock });
        expect(consumeSpy).toHaveBeenCalled();
        expect(consumeSpy).toHaveBeenCalledWith('test-topic', 'test-consumer-test-topic-consumer', handlerMock);
    });

    it('should startconsumeMany', async () => {
        const consumeSpy = jest.spyOn(kafkaClient, 'consume');
        await consumerService.consumeMany([{ topic: 'test-topic-1', handler: handlerMock }, { topic: 'test-topic-2', handler: handlerMock }]);
        expect(consumeSpy).toHaveBeenCalledTimes(2);
        expect(consumeSpy).toHaveBeenCalledWith('test-topic-1', 'test-consumer-test-topic-1-consumer', handlerMock);
        expect(consumeSpy).toHaveBeenCalledWith('test-topic-2', 'test-consumer-test-topic-2-consumer', handlerMock);
    });
});