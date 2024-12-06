export class UrnPaginatedRequest<T> {
    urn: string;
    cursor?: string;
    limit?: number;
    sort?: string;
    query?: T | void;
    language?: string;
}