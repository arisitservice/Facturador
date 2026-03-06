import type { infer as infer_ } from 'zod';

import { boolean, number, object, string } from 'zod';

export const newClientSchema = object({
  name: string().min(3, 'name must be at least 3 characters'),
  rfc: string().min(10, 'rfc must be at least 10 characters'),
  postalCode: string().min(5, 'postal code must be at least 5 characters'),
  taxRegime: string().min(3, 'tax regime must be at least 3 characters'),
  businessName: string().min(3, 'business name must be at least 3 characters'),
  accessApp: string().min(3, 'access app must be at least 3 characters'),
});

export type NewClient = infer_<typeof newClientSchema>;

export const newSupplierSchema = object({
  name: string().min(3, 'name must be at least 3 characters'),
  comercialName: string().min(3, 'comercial name must be at least 3 characters'),
  clientId: number(),
});

export type NewSupplier = infer_<typeof newSupplierSchema>;

export const newFolderSchema = object({
  name: string().min(3, 'name must be at least 3 characters'),
  sectionId: number().min(1, 'section is required'),
});

export type NewFolder = infer_<typeof newFolderSchema>;

export const newUserSchema = object({
  name: string().min(3, 'name must be at least 3 characters'),
  email: string().email('invalid email address'),
  password: string().min(6, 'password must be at least 6 characters'),
  passwordConfirm: string().min(6, 'password confirmation must be at least 6 characters'),
  roleId: number().optional(),
  canReview: boolean(),
  canApprove: boolean(),
  canEdit: boolean(),
  canDelete: boolean(),
  canDownload: boolean(),
  accessApp: boolean(),
}).refine(data => data.password === data.passwordConfirm, {
  message: 'passwords do not match',
  path: ['passwordConfirm'],
});

export type NewUser = infer_<typeof newUserSchema>;
