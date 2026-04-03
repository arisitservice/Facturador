export type ApiResponse<T> = {
  payload: T | null;
  isSuccess: boolean;
  message: string | null;
  statusCode: number;
  errors: { property: string; errorMessage: string }[] | null;
};
