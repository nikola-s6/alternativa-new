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
    name: 'Youtube',
    icon: siYoutube,
    href: 'https://www.youtube.com/@alternativacentar',
  },
  {
    name: 'Instagram',
    icon: siInstagram,
    href: 'https://www.instagram.com/alternativacentar?igsh=MTFsdnZwejE5aWVmMA%3D%3D',
  },
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
];

export const neighborhoods: {
  value: string;
  title: string;
  responsiblePerson: string;
  phone: string;
}[] = [
    {
      value: 'banovoBrdo',
      title: 'Баново Брдо',
      responsiblePerson: 'Михаило Цекић',
      phone: '+381 64 1136471',
    },
    {
      value: 'velikaMostanica',
      title: 'Велика Моштаница',
      responsiblePerson: 'Борис Поседи',
      phone: '+381 61 6092016',
    },
    {
      value: 'zarkovo',
      title: 'Жарково',
      responsiblePerson: 'Урош Келечевић',
      phone: '+381 69 2506455',
    },
    {
      value: 'zeleznik',
      title: 'Железник',
      responsiblePerson: 'Борис Поседи',
      phone: '+381 61 6092016',
    },
    {
      value: 'ostruznica',
      title: 'Остружница',
      responsiblePerson: 'Борис Поседи',
      phone: '+381 61 6092016',
    },
    {
      value: 'rusanj',
      title: 'Рушањ',
      responsiblePerson: 'Борис Поседи',
      phone: '+381 61 6092016',
    },
    {
      value: 'sremcica',
      title: 'Сремчица',
      responsiblePerson: 'Борис Поседи',
      phone: '+381 61 6092016',
    },
    {
      value: 'umka',
      title: 'Умка',
      responsiblePerson: 'Борис Поседи',
      phone: '+381 61 6092016',
    },
    {
      value: 'cerak',
      title: 'Церак',
      responsiblePerson: 'Борис Поседи',
      phone: '+381 61 6092016',
    },
    {
      value: 'cukarickaPadina',
      title: 'Чукаричка Падина',
      responsiblePerson: 'Борис Поседи',
      phone: '+381 61 6092016',
    },
  ];
