export type ApiResponse<T> = {
  payload: T | null;
  isSuccess: boolean;
  message: string | null;
  statusCode: number;
  errors: ApiError[] | null;
};

export type ApiError = {
  property: string;
  errorMessage: string;
};
