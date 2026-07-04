import { Separator } from '@radix-ui/react-separator';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import LoadingScreen from '@/components/Loading';
import { AppSidebar } from '@/components/Sidebar';
import ThemeSwitch from '@/components/ThemeSwitch';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getMenuList } from '@/constants/listMenu';
import { cn } from '@/lib/utils';

const AppLayout = () => {
  const { pathname } = useLocation();
  const menuItems = getMenuList(pathname);
  return (
    <SidebarProvider>
      <AppSidebar menuItems={menuItems} />
      <SidebarInset>
        <header
          className={cn(
            'flex sticky top-0 z-10 h-16 shrink-0 items-center justify-between gap-2',
            'border-b bg-background px-4',
          )}
        >
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 w-px h-4 bg-border" />
          </div>
          <ThemeSwitch />
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
