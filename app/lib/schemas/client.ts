import z from 'zod';

export const newClientSchema = z.object({
  name: z.string().min(3, 'name must be at least 3 characters'),
  rfc: z.string().min(10, 'rfc must be at least 10 characters'),
  postalCode: z.string().min(5, 'postal code must be at least 5 characters'),
  taxRegime: z.string().min(3, 'tax regime must be at least 3 characters'),
  businessName: z.string().min(3, 'business name must be at least 3 characters'),
  accessApp: z.string().min(3, 'access app must be at least 3 characters'),
});

export type NewClient = z.infer<typeof newClientSchema>;
