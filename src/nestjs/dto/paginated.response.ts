export class PaginatedResponse<T> {
    offset: number;
    limit: number;
    total: number;
    items: T[];
}