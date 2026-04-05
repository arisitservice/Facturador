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

export type TaxRegimen = {
  id: number;
  satCode: number;
  description: string;
  status: string;
};
