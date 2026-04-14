export type Client = {
  id: number;
  name: string;
  clientTaxInfos: BusinessInfo[];
};

export type CreateClientPayload = {
  name: string;
  businessName: string;
  taxId: string;
  taxRegimeId: number;
  taxAddress: string;
  postalCode: string;
};

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
  taxRegime: TaxRegimen[];
  taxAddress: string;
  postalCode: string;
  default: boolean;
};

export type CreateBusinessInfoPayload = {
  businessName: string;
  taxId: string;
  taxRegimeId: number;
  taxAddress: string;
  postalCode: string;
};

export type UpdateBusinessInfoPayload = Partial<CreateBusinessInfoPayload>;

export type CreateClientTaxInfoPayload = {
  businessName: string;
  taxId: string;
  taxRegimeId: number;
  taxAddress: string;
  postalCode: string;
  default: boolean;
  clientId: number;
};

export type UpdateClientTaxInfoPayload = Omit<Partial<CreateClientTaxInfoPayload>, 'clientId'>;
