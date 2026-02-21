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

export const newSupplierSchema = z.object({
  name: z.string().min(3, 'name must be at least 3 characters'),
  comercialName: z.string().min(3, 'comercial name must be at least 3 characters'),
  clientId: z.number(),
});

export type NewSupplier = z.infer<typeof newSupplierSchema>;

export const newFolderSchema = z.object({
  name: z.string().min(3, 'name must be at least 3 characters'),
  sectionId: z.number().min(1, 'section is required'),
});

export type NewFolder = z.infer<typeof newFolderSchema>;

export const newUserSchema = z.object({
  name: z.string().min(3, 'name must be at least 3 characters'),
  email: z.string().email('invalid email address'),
  password: z.string().min(6, 'password must be at least 6 characters'),
  passwordConfirm: z.string().min(6, 'password confirmation must be at least 6 characters'),
  roleId: z.number().optional(),
  canReview: z.boolean(),
  canApprove: z.boolean(),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
  canDownload: z.boolean(),
  accessApp: z.boolean(),
}).refine(data => data.password === data.passwordConfirm, {
  message: 'passwords do not match',
  path: ['passwordConfirm'],
});

export type NewUser = z.infer<typeof newUserSchema>;
