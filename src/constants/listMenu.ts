import { Home, Banknote, Tag, Handshake, Wallet, Group, Coins } from 'lucide-react';

export type MenuItem = {
  title: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
};

const isUrlActive = (pathname: string, url: string) =>
  url === '/app' ? pathname === url : pathname === url || pathname.startsWith(`${url}/`);

export function getMenuList(pathname: string): MenuItem[] {
  const items: Omit<MenuItem, 'isActive'>[] = [
    {
      title: 'Home',
      url: '/app',
      icon: Home,
    },
    {
      title: 'Caixa',
      url: '/app/cash',
      icon: Coins,
    },
    {
      title: 'Orçamentos',
      url: '/app/budgets',
      icon: Banknote,
    },
    {
      title: 'Parceiros',
      url: '/app/parties',
      icon: Handshake,
    },
    {
      title: 'Contas Bancárias',
      url: '/app/bank-accounts',
      icon: Wallet,
    },
    {
      title: 'Categorias',
      url: '/app/categories',
      icon: Group,
    },
    {
      title: 'Agrupadores',
      url: '/app/tags',
      icon: Tag,
    },
  ];

  return items.map((item) => ({ ...item, isActive: isUrlActive(pathname, item.url) }));
}
