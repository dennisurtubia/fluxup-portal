import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const PartiesPage = lazy(() => import('../pages/PatierPage'));

export const partiesRoutes: RouteObject[] = [
  {
    path: '/app/parties',
    element: <PartiesPage />,
  },
];
