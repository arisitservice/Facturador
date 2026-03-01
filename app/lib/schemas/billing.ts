import z from 'zod';

export const clientDataSchema = z.object({
  clientId: z.number().min(1, 'client is required'),
  taxRegimeId: z.number().min(1, 'tax regime is required'),
  taxId: z.string().min(10, 'tax ID must be at least 10 characters'),
  businessName: z.string().min(3, 'business name must be at least 3 characters'),
  postalCode: z.string().min(5, 'postal code must be at least 5 characters'),
});

export type ClientData = z.infer<typeof clientDataSchema>;

export const invoiceTaxInfoSchema = z.object({
  invoiceUsageId: z.number().min(1, 'invoice usage is required'),
  paymentMethod: z.string().min(1, 'payment method is required'),
  paymentForm: z.string().min(1, 'payment form is required'),
  paymentCurrencyId: z.number().min(1, 'payment currency is required'),
  relatedInvoiceId: z.number().optional(),
});

export type InvoiceTaxInfo = z.infer<typeof invoiceTaxInfoSchema>;

export const productServiceSchema = z.object({
  detailedDescription: z.string().min(3, 'detailed description must be at least 3 characters'),
  productServiceId: z.number().min(1, 'product/service is required').optional(),
  measureUnitId: z.number().min(1, 'measure unit is required').optional(),
  quantity: z.number().min(0.01, 'quantity must be greater than 0'),
  unitPrice: z.number().min(0.01, 'unit price must be greater than 0'),
});

export type ProductService = z.infer<typeof productServiceSchema>;

export type VatDetails = { // VAT = Value Added Tax - Impuesto al Valor Agregado (IVA) en México
  vatChargedAtRate: boolean;
  vatExempt: boolean;
  vatWithholdingAtRate: boolean;
  incomeTaxWithholding: boolean;
  amount: number;
};

export const newInvoiceDataSchema = z.object({
  client: clientDataSchema,
  taxInfo: invoiceTaxInfoSchema,
  productServices: z.array(productServiceSchema),
  vatDetails: z.object({
    vatChargedAtRate: z.boolean(),
    vatExempt: z.boolean(),
    vatWithholdingAtRate: z.boolean(),
    incomeTaxWithholding: z.boolean(),
    amount: z.number(),
  }),
});

export type NewInvoiceData = z.infer<typeof newInvoiceDataSchema>;

export const creditNoteTaxInfoSchema = invoiceTaxInfoSchema.omit({ relatedInvoiceId: true });

export type CreditNoteTaxInfo = z.infer<typeof creditNoteTaxInfoSchema>;

export const creditNoteProductServiceSchema = productServiceSchema.omit({ productServiceId: true, measureUnitId: true }).extend({
  isTaxable: z.boolean(),
  withholdingType: z.enum(['vat', 'incomeTax']),
});

export type CreditNoteProductService = z.infer<typeof creditNoteProductServiceSchema>;

export const newCreditNoteDataSchema = z.object({
  client: clientDataSchema,
  taxInfo: creditNoteTaxInfoSchema,
  productServices: z.array(creditNoteProductServiceSchema),
});

export type NewCreditNoteData = z.infer<typeof newCreditNoteDataSchema>;

export const paymentReceptionSchema = z.object({
  paymentMethod: z.string().min(1, 'payment method is required'),
  paymentCurrency: z.string().min(1, 'payment currency is required'),
  paymentDate: z.string().min(1, 'payment date is required'),
  amount: z.number().min(0.01, 'amount must be greater than 0'),
  transactionNumber: z.string().min(1, 'transaction number is required'),
  fiscalFolios: z.array(z.string().min(1)).min(1, 'at least one fiscal folio is required'),
});

export type PaymentReception = z.infer<typeof paymentReceptionSchema>;

export const newPaymentComplementDataSchema = z.object({
  client: clientDataSchema,
  paymentReception: paymentReceptionSchema,
});

export type NewPaymentComplementData = z.infer<typeof newPaymentComplementDataSchema>;

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
