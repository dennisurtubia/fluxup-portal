import { Home, PiggyBank, Banknote, Tag } from 'lucide-react';

export type MenuItem = {
  title: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
};

export function getMenuList(pathname: string): MenuItem[] {
  return [
    {
      title: 'Home',
      url: '/app',
      isActive: pathname === '/app',
      icon: Home,
    },
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
    {
      title: 'Categorias',
      url: '',
      isActive: pathname === '',
      icon: Tag,
    },
  ];
}
