import { RouteObject } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';

import GuestGuard from '@/guards/GuestGuard';

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <GuestGuard />,
    children: [
      {
        path: '',
        element: <LoginPage />,
      },
    ],
  },
];
