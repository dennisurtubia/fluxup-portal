import * as React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/fluxup.svg';
import { SidebarUser } from '../SidebarUser';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { MenuItem } from '@/constants/listMenu';
import useAuth from '@/hooks/useAuth';

type AppSidebarProps = React.ComponentPropsWithoutRef<typeof Sidebar> & {
  menuItems?: MenuItem[];
};

export function AppSidebar({ menuItems = [], ...props }: AppSidebarProps) {
  const { user } = useAuth();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex justify-center p-3">
          <img src={Logo} className="w-35" alt="Logo" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title} className="px-1">
              <SidebarMenuButton asChild isActive={item.isActive} className="py-3">
                <Link to={item.url}>
                  {item.icon &&
                    React.createElement(item.icon, {
                      className: 'mr-2 h-4 w-4',
                    })}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarUser user={{ email: user?.sub || '' }} />
      </SidebarFooter>
    </Sidebar>
  );
}
