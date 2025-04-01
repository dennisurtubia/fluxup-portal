import { ChevronRight } from 'lucide-react';
import * as React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/fluxup.svg';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

interface MenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  menuSections?: MenuSection[];
}

export function AppSidebar({ menuSections = [], ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex justify-center p-3">
          <img src={Logo} className="w-35" alt="Logo" />
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {menuSections.map((section) => {
          if (section.items.length === 1) {
            const item = section.items[0];
            return (
              <SidebarGroup key={item.title}>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground 
                  hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Link to={item.url} className="flex items-center w-full gap-2 rounded">
                    {item.icon && React.createElement(item.icon, { className: 'h-4 w-4' })}
                    {item.title}
                  </Link>
                </SidebarGroupLabel>
              </SidebarGroup>
            );
          }

          return (
            <Collapsible
              key={section.title}
              title={section.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground 
                  hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger>
                    {section.title}{' '}
                    <ChevronRight
                      className="ml-auto transition-transform 
                    group-data-[state=open]/collapsible:rotate-90"
                    />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive={item.isActive}>
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
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
