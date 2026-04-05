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
