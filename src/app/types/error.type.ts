export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TErrorSource = {
  path: string | number;
  message: string;
};

export interface TErrorResponse {
  statusCode: number;
  success: boolean;
  status?: string;
  message: string;
  errorSources: TErrorSources;
  stack?: string;
  error?: unknown;
}
