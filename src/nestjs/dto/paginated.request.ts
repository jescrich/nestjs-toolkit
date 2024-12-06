export class PaginatedRequest<T> {
    cursor?: string;
    limit?: number;
    sort?: string;
    query?: T;
    language?: string;
}