export type PricingPage = {
  title: string;
  description: string;
  seo: SEO;
  navigation: Navigation;
  plans: Plan[];
  logos: Logos;
  faq: FAQ;
};

export type SEO = {
  title: string;
  description: string;
};

export type Navigation = {
  icon: string;
};

export type Plan = {
  title: string;
  description: string;
  price: Price;
  button: Button;
  features: string[];
  highlight?: boolean;
  scale?: boolean;
};

export type Price = {
  month: string;
  year: string;
};

export type Button = {
  label: string;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' | undefined;
  variant?: 'link' | 'solid' | 'outline' | 'subtle' | 'ghost' | undefined;

};

export type Logos = {
  title: string;
  icons: string[];
};

export type FAQ = {
  title: string;
  description: string;
  items: FAQItem[];
};

export type FAQItem = {
  label: string;
  content: string;
};
