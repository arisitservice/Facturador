import type { infer as infer_ } from 'zod';

import { array, boolean, enum as enum_, number, object, string } from 'zod';
// section ------- New Invoice Types --------

export const clientDataSchema = object({
  clientId: number().min(1, 'client is required'),
  taxRegimeId: number().min(1, 'tax regime is required'),
  taxId: string().min(10, 'tax ID must be at least 10 characters'),
  businessName: string().min(3, 'business name must be at least 3 characters'),
  postalCode: string().min(5, 'postal code must be at least 5 characters'),
});

export type ClientData = infer_<typeof clientDataSchema>;

export const invoiceTaxInfoSchema = object({
  invoiceUsageId: number().min(1, 'invoice usage is required'),
  paymentMethod: string().min(1, 'payment method is required'),
  paymentForm: string().min(1, 'payment form is required'),
  paymentCurrencyId: number().min(1, 'payment currency is required'),
  relatedInvoiceId: number().optional(),
});

export type InvoiceTaxInfo = infer_<typeof invoiceTaxInfoSchema>;

export const productServiceSchema = object({
  detailedDescription: string().min(3, 'detailed description must be at least 3 characters'),
  productServiceId: number().min(1, 'product/service is required').optional(),
  measureUnitId: number().min(1, 'measure unit is required').optional(),
  quantity: number().min(0.01, 'quantity must be greater than 0'),
  unitPrice: number().min(0.01, 'unit price must be greater than 0'),
});

export type ProductService = infer_<typeof productServiceSchema>;

export type VatDetails = { // VAT = Value Added Tax - Impuesto al Valor Agregado (IVA) en México
  vatChargedAtRate: boolean;
  vatExempt: boolean;
  vatWithholdingAtRate: boolean;
  incomeTaxWithholding: boolean;
  amount: number;
};

export const newInvoiceDataSchema = object({
  client: clientDataSchema,
  taxInfo: invoiceTaxInfoSchema,
  productServices: array(productServiceSchema),
  vatDetails: object({
    vatChargedAtRate: boolean(),
    vatExempt: boolean(),
    vatWithholdingAtRate: boolean(),
    incomeTaxWithholding: boolean(),
    amount: number(),
  }),
});

export type NewInvoiceData = infer_<typeof newInvoiceDataSchema>;

// section ------- Credit Note Types --------

export const creditNoteTaxInfoSchema = invoiceTaxInfoSchema.omit({ relatedInvoiceId: true });

export type CreditNoteTaxInfo = infer_<typeof creditNoteTaxInfoSchema>;

export const creditNoteProductServiceSchema = productServiceSchema.omit({ productServiceId: true, measureUnitId: true }).extend({
  isTaxable: boolean(),
  withholdingType: enum_(['vat', 'incomeTax']).optional(),
});

export type CreditNoteProductService = infer_<typeof creditNoteProductServiceSchema>;

export const newCreditNoteDataSchema = object({
  client: clientDataSchema,
  taxInfo: creditNoteTaxInfoSchema,
  productServices: array(creditNoteProductServiceSchema),
});

export type NewCreditNoteData = infer_<typeof newCreditNoteDataSchema>;

// section ------- Payment Reception Types --------
export const paymentReceptionSchema = object({
  paymentMethod: string().min(1, 'payment method is required'),
  paymentCurrency: number().min(1, 'payment currency is required'),
  paymentDate: string().min(1, 'payment date is required'),
  amount: number().min(0.01, 'amount must be greater than 0'),
  transactionNumber: string().min(1, 'transaction number is required'),
  fiscalFolios: array(string().min(1)).min(1, 'at least one fiscal folio is required'),
});

export type PaymentReception = infer_<typeof paymentReceptionSchema>;

export const newPaymentComplementDataSchema = object({
  client: clientDataSchema,
  paymentReception: paymentReceptionSchema,
});

export type NewPaymentComplementData = infer_<typeof newPaymentComplementDataSchema>;

// APIs Responses

export type InvoiceUsage = {
  id: number;
  satCode: string;
  description: string;
  status: boolean;
};

export type PaymentCurrency = {
  id: number;
  satCode: string;
  description: string;
  status: boolean;
};

export type SatProduct = {
  productId: number;
  satCode: number;
  description: string;
  status: boolean;
};

export type measureUnit = {
  id: number;
  satCode: string;
  description: string;
  status: boolean;
};

export type taxRegime = {
  id: number;
  satCode: string;
  description: string;
  status: boolean;
};

export type InvoiceFolio = {
  cfdiId: number;
  uuid: string;
  amount: string;
  vatAmount: string;
  withheldVatAmount?: string | null;
  withheldIsrAmount?: string | null;
};
