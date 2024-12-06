export interface IRepository<T> {
  one(id: string): Promise<T>;
  all(): Promise<T[]>;
  find(
    criteria: object,
    params?: {
      fields?: string;
      useLean?: boolean;
      offset?: number;
      limit?: number;
      sort?: { sortField: string; sortOrder: string };
    },
  ): Promise<T[]>;
}
