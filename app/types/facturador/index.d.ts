import type { AvatarProps } from '@nuxt/ui';

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced';
export type SaleStatus = 'paid' | 'failed' | 'refunded';

export type User = {
  id: number;
  name: string;
  email: string;
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
