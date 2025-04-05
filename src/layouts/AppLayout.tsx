import { Separator } from '@radix-ui/react-separator';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import LoadingScreen from '@/components/Loading';
import { AppSidebar } from '@/components/Sidebar';
import ThemeSwitch from '@/components/ThemeSwitch';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getMenuList } from '@/constants/listMenu';

const AppLayout = () => {
  const menuItems = getMenuList(window.location.pathname);
  return (
    <SidebarProvider>
      <AppSidebar menuItems={menuItems} />
      <SidebarInset>
        <header
          className="flex sticky top-0 bg-background 
        h-16 shrink-0 items-center gap-2 border-b px-4 z-10 justify-between"
        >
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 w-px h-4 bg-gray-300" />
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
