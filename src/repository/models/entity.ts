import { Document } from 'mongoose';
export abstract class Entity extends Document {
  creationDate?: Date;
  modificationDate?: Date;
  urn: string;
  uuid: string;
}
