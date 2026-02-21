export type Client = {
  idClient: number;
  name: string;
  email: string;
  accessApp: string;
  fiscalData: FiscalData;
};

export type FiscalData = {
  postalCode?: number;
  clientId?: number;
  clientDetailId?: number;
  taxRegimeId?: number;
  businessName?: string;
  taxRegime?: TaxRegimeData;
  taxId?: string; // RFC
  serviceType?: number;
  taxRegimeDescription?: string;
};

export type TaxRegimeData = {
  satCode: string;
  description: string;
  status?: number;
  taxRegimeId: number;
};
