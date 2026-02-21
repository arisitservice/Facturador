import type { ButtonProps } from '@nuxt/ui';

export type PageData = {
  title: string;
  description: string;
  seo: Seo;
  navigation: boolean;
  hero: Hero;
  sections: Section[];
  features: Features;
  testimonials: Testimonials;
  cta: Cta;
};

type Cta = {
  title: string;
  description: string;
  links: Link2[];
};

type Link2 = {
  label: string;
  to: string;
  target: string;
  trailingIcon?: string;
  variant?: ButtonProps['variant'];
  icon?: string;
};

type Testimonials = {
  headline: string;
  title: string;
  description: string;
  items: Item2[];
};

type Item2 = {
  quote: string;
  user: User;
};

type User = {
  name: string;
  description: string;
  avatar: Avatar;
};

type Avatar = {
  src: string;
};

type Features = {
  title: string;
  description: string;
  items: Item[];
};

type Item = {
  title: string;
  description: string;
  icon: string;
};

type Section = {
  title: string;
  description: string;
  id?: string;
  orientation: 'vertical' | 'horizontal';
  features: Feature[];
  reverse?: boolean;
};

type Feature = {
  name: string;
  description: string;
  icon: string;
};

type Hero = {
  links: Link[];
};

type Link = {
  label: string;
  icon: string;
  trailing?: boolean;
  to: string;
  target: string;
  size: string;
  color?: string;
  variant?: string;
};

type Seo = {
  title: string;
  description: string;
};
