export type ClientsApiResponse<T> = {
  payload: T | null;
  isSuccess: boolean;
  message: string | null;
  statusCode: number;
  errors: { property: string; errorMessage: string }[] | null;
};

export type Client = {
  id: number;
  name: string;
  businessName: string;
  taxId: string;
  taxRegimeId: number;
  taxAddress: string;
  postalCode: string;
};

export type CreateClientPayload = Omit<Client, 'id'>;

export type UpdateClientPayload = Partial<CreateClientPayload>;
