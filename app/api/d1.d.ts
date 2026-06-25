// Cloudflare D1 Database Types
interface D1Database {
  prepare(query: string): D1Statement;
  batch<T>(statements: D1Statement[]): Promise<T[]>;
  exec(query: string): Promise<D1ExecResult>;
  dump(): Promise<ArrayBuffer>;
}

interface D1Statement {
  bind(...values: any[]): D1Statement;
  first<T = any>(): Promise<T | null>;
  all<T = any>(): Promise<D1Result<T>>;
  run(): Promise<D1ExecResult>;
}

interface D1Result<T = any> {
  results: T[];
  success: boolean;
}

interface D1ExecResult {
  success: boolean;
  meta: {
    duration: number;
    last_row_id?: number;
    changes?: number;
    served_by?: string;
    internal_stats?: string;
  };
  results?: any[];
}
