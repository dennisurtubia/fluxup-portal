import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage'));

export const homeRoutes: RouteObject[] = [
  {
    path: '',
    index: true,
    element: <HomePage />,
  },
];
