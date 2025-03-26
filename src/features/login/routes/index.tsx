import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const LoginPage = lazy(() => import('../pages/LoginPage'));

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
];
