import { Home, PiggyBank, Banknote, Tag } from 'lucide-react';

export type MenuItem = {
  title: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

export function getMenuList(pathname: string): MenuSection[] {
  return [
    {
      title: 'Dashboard',
      items: [
        {
          title: 'Home',
          url: '/app',
          isActive: pathname === '/app',
          icon: Home,
        },
      ],
    },
    {
      title: 'Orçamento',
      items: [
        {
          title: 'Despesas',
          url: '',
          isActive: pathname === '',
          icon: Banknote,
        },
        {
          title: 'Receitas',
          url: '',
          isActive: pathname === '',
          icon: PiggyBank,
        },
      ],
    },
    {
      title: 'Categorias',
      items: [
        {
          title: 'Categorias',
          url: '',
          isActive: pathname === '',
          icon: Tag,
        },
      ],
    },
  ];
}
