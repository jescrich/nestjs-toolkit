/**
 * Represents a result object that contains data, message, and error status.
 *
 * @template T - The type of the data.
 */
export class Result<T> {
  data?: T;
  message?: string;
  error?: boolean;
  vendor: string;
  trace?: any;
}
