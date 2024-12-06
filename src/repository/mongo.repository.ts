import { Injectable, Logger } from '@nestjs/common';
import { Entity, Urn } from '@this/repository/models';
import mongoose, { ConnectOptions, Connection, Model, SortOrder } from 'mongoose';
import { IRepository } from './repository';
import { validate as isValidUUID } from 'uuid';

export class MongoRepository<T extends Entity> implements IRepository<T> {
  private readonly logger = new Logger(MongoRepository.name);
  private mongoConnection: Connection;
  private model: Model<T>;

  constructor(
    private readonly _model: Model<T>,
    private readonly connectionString: string,
    private readonly dbName?: string,
  ) {
    const connectOptions: ConnectOptions = {
      dbName,
    };
    this.mongoConnection = mongoose.createConnection(connectionString, connectOptions);
    this.mongoConnection.on('connected', () => {
      this.logger.log(`Model ${_model.modelName} connected to ${this.mongoConnection?.db?.databaseName}.`);
    });
    this.mongoConnection.on('error', (err) => {
      this.logger.error(`Model ${_model.modelName} connection error: ${err}`);
    });
    this.model = this.mongoConnection.model<T>(_model.collection.name, _model.schema);
  }

  async one(id: string): Promise<T> {
    const isUrn = Urn.isValid(id);
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const uuid = isUrn ? Urn.id(id) : id;
    const isUUID = isValidUUID(uuid);

    const query = isUUID ? { uuid } : isObjectId ? { _id: id } : { urn: id };
    const result = await this.model.findOne<T>(query);
    return Promise.resolve(result as T);
  }

  async all<T>(params?: {
    useLean?: boolean;
    offset?: number;
    limit?: number;
    sort?: { sortField: string; sortOrder: string | SortOrder };
  }): Promise<T[]> {
    let query = this.model
      .find<T>({})
      .sort(params?.sort ? { [params.sort.sortField]: params.sort.sortOrder as SortOrder } : {})
      .skip(params?.offset ?? 0)
      .limit(params?.limit ?? 0);

    if (params?.useLean) {
      query = query.lean() as unknown as mongoose.Query<T[], T>;
    }

    const result = await query.exec();
    return result as T[];
  }

  async find<T>(
    criteria: any = {},
    params?: {
      fields?: string;
      useLean?: boolean;
      offset?: number;
      limit?: number;
      sort?: { sortField: string; sortOrder: string | SortOrder };
    },
  ): Promise<T[]> {
    let query = this.model
      .find<T>(criteria)
      .sort(params?.sort ? { [params.sort.sortField]: params.sort.sortOrder as SortOrder } : {})
      .skip(params?.offset ?? 0)
      .limit(params?.limit ?? 0);

    if (params?.useLean) {
      query = query.lean() as unknown as mongoose.Query<T[], T>;
    }

    let projection: any = { __v: 0 };

    if (params?.fields) {
      const fields = (params?.fields as string).trim().split(/\s+/);
      projection = Object.fromEntries(fields.map((key) => [key, 1]));
    }

    const result = await query.select(projection).exec();
    return result as T[];
  }

  async createOrUpdate(entity: T): Promise<T> {
    try {
      const result = await this.model.findByIdAndUpdate(entity._id, { $set: entity }, { upsert: true, new: true });
      return Promise.resolve(result as unknown as T);
    } catch (e) {
      this.logger.error(`Error creating or updating entity: (ID: ${entity._id}) ${e}`);
      throw e;
    }
  }
}
