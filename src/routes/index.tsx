import { useRoutes } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';

import { homeRoutes } from '@/features/home/routes';
import { authRoutes } from '@/features/login/routes';
import AuthGuard from '@/guards/AuthGuard';

const AppRouter = () => {
  const routes = useRoutes([
    ...authRoutes,
    {
      path: '/app',
      element: <AuthGuard />,
      children: [
        {
          path: '',
          element: <AppLayout />,
          children: [...homeRoutes],
        },
      ],
    },

    {
      path: '*',
      element: <div>Página não encontrada</div>,
    },
  ]);

  return routes;
};

export default AppRouter;
