export type User = {
  id: number;
  username: string;
  email: string;
  userType: string;
  token: string;
  expiresAt: string;
};

export type Tenant = {
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

// export type SignUpPayload = {
//   tenant: { name: string; company: string };
//   owner: { username: string; email: string; password: string };
// };
