import type { SimpleIcon } from 'simple-icons';
import { siFacebook, siX, siInstagram, siYoutube } from 'simple-icons';

export type MenuItem = {
  name: string;
  href: string;
};

export type SocialItem = {
  name: string;
  href: string;
  icon: SimpleIcon;
};

export const menuItems: MenuItem[] = [
  { name: 'Програм', href: '/program' },
  { name: 'Вести', href: '/news' },
  { name: 'Тим', href: '/team' },
];

export const socialItems: SocialItem[] = [
  {
    name: 'Facebook',
    icon: siFacebook,
    href: 'https://www.facebook.com/alternativacentar?mibextid=ZbWKwL',
  },
  {
    name: 'X',
    icon: siX,
    href: 'https://x.com/alt_centar?t=VXmr8B1fE3Hu37JZX3AZ-w&s=09',
  },
  {
    name: 'Instagram',
    icon: siInstagram,
    href: 'https://www.instagram.com/alternativacentar?igsh=MTFsdnZwejE5aWVmMA%3D%3D',
  },
  {
    name: 'Youtube',
    icon: siYoutube,
    href: 'https://www.youtube.com/@alternativacentar',
  },
];
