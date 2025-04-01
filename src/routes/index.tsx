import { Navigate, useRoutes } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';

import { homeRoutes } from '@/features/home/routes';
import { authRoutes } from '@/features/login/routes';
import AuthGuard from '@/guards/AuthGuard';
import useAuth from '@/hooks/useAuth';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to={isAuthenticated ? '/app' : '/login'} replace />,
    },
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
