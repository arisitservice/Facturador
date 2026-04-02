import type { AvatarProps } from '@nuxt/ui';

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced';
export type SaleStatus = 'paid' | 'failed' | 'refunded';

export type LoginUser = Pick<User, 'id' | 'email'> & { username: string; userType: string; token: string; expiresAt: string };

export type User = {
  id: number;
  name: string;
  idCliente: null;
  idSupplier: null;
  email: string;
  emailVerifiedAt: null;
  accessApp: string;
  language: string;
  idRol: number;
  idRolErp: number;
  idRolTickets: number;
  lastLogin: string;
  avatar?: AvatarProps;
  status: UserStatus;
  location: string;
};

export type Notification = {
  id: number;
  unread?: boolean;
  sender: User;
  body: string;
  date: string;
};

export type Mail = {
  id: number;
  unread?: boolean;
  from: User;
  subject: string;
  body: string;
  date: string;
};

export type Period = 'daily' | 'weekly' | 'monthly';

export type Range = {
  start: Date;
  end: Date;
};

type LoginResponse = {
  payload: LoginPayload | null;
  isSuccess: boolean;
  message: string;
  statusCode: number;
  errors: SignUpError[];
};

export type LoginPayload = {
  id: number;
  username: string;
  email: string;
  userType: string;
  token: string;
  expiresAt: string;
};

export type SignUpPayload = {
  tenant: { name: string; company: string };
  owner: { username: string; email: string; password: string };
};

export type SignUpError = {
  property: string;
  errorMessage: string;
};

export type SignUpResponse = {
  payload: Payload | null;
  isSuccess: boolean;
  message: string;
  statusCode: number;
  errors: SignUpError[];
};

export type Payload = {
  tenantId: string;
  name: string;
  company: string;
  email: string;
  subdomain: string;
  owner: Owner;
};

export type Owner = {
  id: number;
  username: string;
  email: string;
};
