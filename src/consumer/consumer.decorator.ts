const Handler = (params: { topic: string }) => (target: Function) => {
    const { topic } = params;
    Reflect.defineMetadata('topic-consumer', true, target);
    Reflect.defineMetadata('topic', topic, target);    
}

export { Handler }