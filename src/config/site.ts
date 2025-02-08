import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type MenuItem = {
  name: string;
  href: string;
};

export type SocialItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const menuItems: MenuItem[] = [
  { name: 'Програм', href: '/program' },
  { name: 'Вести', href: '/news' },
  { name: 'Тим', href: '/team' },
];

export const socialItems: SocialItem[] = [
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/alternativacentar?mibextid=ZbWKwL',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://x.com/alt_centar?t=VXmr8B1fE3Hu37JZX3AZ-w&s=09',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/alternativacentar?igsh=MTFsdnZwejE5aWVmMA%3D%3D',
  },
  {
    name: 'Youtube',
    icon: Youtube,
    href: 'https://www.youtube.com/@alternativacentar',
  },
];
