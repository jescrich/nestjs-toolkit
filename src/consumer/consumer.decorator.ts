const instances = new Map();

const Consumer = (target: Function) => {
    instances.set(target.name, target);
}

export { Consumer }