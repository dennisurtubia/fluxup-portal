import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const CategoryPage = lazy(() => import('../pages/CategoryPage'));

export const categoryRouter: RouteObject[] = [
  {
    path: '/app/categories',
    element: <CategoryPage />,
  },
];
