import { Home, Banknote, Tag, Handshake } from 'lucide-react';

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
      title: 'Orçamentos',
      url: '/app/budgets',
      isActive: pathname === '/app/budgets',
      icon: Banknote,
    },
    {
      title: 'Agrupadores',
      url: '/app/tags',
      isActive: pathname === '/app/tags',
      icon: Tag,
    },
    {
      title: 'Parceiros',
      url: '/app/parties',
      isActive: pathname === '/app/parties',
      icon: Handshake,
    },
  ];
}
