import { IEventHandler } from "@this/kafka";

export class ConsumerDef<T> {
    topic: string;
    handler: IEventHandler<T>
}