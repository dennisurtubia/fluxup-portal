import { Separator } from '@radix-ui/react-separator';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import LoadingScreen from '@/components/Loading';
import { AppSidebar } from '@/components/Sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getMenuList } from '@/lib/listMenu';

const AppLayout = () => {
  const menuSections = getMenuList(window.location.pathname);

  return (
    <SidebarProvider>
      <AppSidebar menuSections={menuSections} />
      <SidebarInset>
        <header
          className="flex sticky top-0 bg-background 
        h-16 shrink-0 items-center gap-2 border-b px-4 z-10"
        >
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 w-px h-4 bg-gray-300" />
        </header>
        <main className="flex-1 p-4 overflow-auto">
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
