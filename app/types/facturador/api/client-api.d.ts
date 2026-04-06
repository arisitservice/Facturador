export type Client = {
  id: number;
  name: string;
} & BusinessInfo;

export type CreateClientPayload = Omit<Client, 'id'>;

export type UpdateClientPayload = Partial<CreateClientPayload>;

export type TaxRegimen = {
  id: number;
  satCode: number;
  description: string;
  status: string;
};

export type BusinessInfo = {
  id: number;
  businessName: string;
  taxId: string;
  taxRegimeId: number;
  taxAddress: string;
  postalCode: string;
  isPrimary: boolean;
};

export type CreateBusinessInfoPayload = Omit<BusinessInfo, 'id'>;

export type UpdateBusinessInfoPayload = Partial<CreateBusinessInfoPayload>;
