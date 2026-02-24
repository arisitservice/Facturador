export type Client = {
  generalInfo: GeneralInfo;
  taxInfo: TaxInfo | null;
  taxRegime: TaxRegime;
};

export type GeneralInfo = {
  clientId: number;
  name: string;
  appAccess: string;
};

export type TaxRegime = {
  satCode: number;
  description: string;
  status?: boolean;
  taxRegimeId: number;
};

export type TaxInfo = {
  postalCode?: number;
  clientId?: number;
  clientDetailId?: number;
  taxRegimeId?: number;
  legalName?: string;
  taxRegimeData?: TaxRegimeData;
  taxId?: string; // RFC
  serviceType?: number;
  taxRegimeDescription?: string;
};

export type TaxRegimeData = {
  satCode: string;
  description: string;
  status?: boolean;
  taxRegimeId: number;
};
