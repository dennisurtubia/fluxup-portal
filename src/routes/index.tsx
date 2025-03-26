import { useRoutes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { authRoutes } from '@/features/login/routes';
import { homeRoutes } from '@/features/home/routes';

const AppRouter = () => {
  const routes = useRoutes([
    ...authRoutes,

    {
      path: '/app',
      element: <AppLayout />,
      children: [...homeRoutes],
    },

    {
      path: '*',
      element: <div>Página não encontrada</div>,
    },
  ]);

  return routes;
};

export default AppRouter;
