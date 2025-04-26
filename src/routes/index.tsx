import { Navigate, useRoutes } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';

import { bankAccountsRouter } from '@/features/bank-account/routes';
import { budgetsRouter } from '@/features/budget/routes';
import { categoryRouter } from '@/features/categories/routes';
import { homeRoutes } from '@/features/home/routes';
import { authRoutes } from '@/features/login/routes';
import { partiesRoutes } from '@/features/party/routes';
import { tagsRouter } from '@/features/tag/routes';
import AuthGuard from '@/guards/AuthGuard';
import useAuth from '@/hooks/useAuth';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  const routers = [
    ...homeRoutes,
    ...budgetsRouter,
    ...tagsRouter,
    ...partiesRoutes,
    ...bankAccountsRouter,
    ...categoryRouter,
  ];

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
          children: routers,
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
