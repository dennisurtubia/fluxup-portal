import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const PartiePage = lazy(() => import('../pages/PatierPage'));

export const partieRoutes: RouteObject[] = [
  {
    path: '/app/parties',
    element: <PartiePage />,
  },
];
