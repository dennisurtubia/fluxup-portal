import { Home, Banknote, Tag, Handshake, Wallet } from 'lucide-react';

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
      title: 'Parceiros',
      url: '/app/parties',
      isActive: pathname === '/app/parties',
      icon: Handshake,
    },
    {
      title: 'Contas Bancárias',
      url: '/app/bank-accounts',
      isActive: pathname === '/app/bank-accounts',
      icon: Wallet,
    },
    {
      title: 'Agrupadores',
      url: '/app/tags',
      isActive: pathname === '/app/tags',
      icon: Tag,
    },
  ];
}
