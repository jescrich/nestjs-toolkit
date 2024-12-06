import { randomUUID } from 'crypto';
import mongoose, { Schema, SchemaDefinition } from 'mongoose';

const defineSchema = (schemaConfig: SchemaDefinition): Schema => {
  const schema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    uuid: { type: String, required: true, default: () => randomUUID(), index: true },
    creationDate: {
      type: Date,
      required: false,
      default: () => Date.now(),
      index: true,
    },
    modificationDate: { type: Date, required: false },
    ...schemaConfig,
  });

  schema.virtual('id').get(function () {
    return this._id?.toHexString();
  });

  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
  });

  return schema;
};

const defineModel = <T>(
  name: string,
  schema: Schema,
  collection: string = name.endsWith('s') ? name : `${name}s`,
  useUrn = true,
) => {
  if (useUrn) {
    schema.virtual('urn').get(function () {
      return `urn:${name}:${this.uuid ?? this._id}`;
    });
  }

  return mongoose.model<T>(name, schema, collection);
};

export { defineModel, defineSchema };
