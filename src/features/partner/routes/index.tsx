import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const PartnerPage = lazy(() => import('../pages/PartnerPage'));

export const partnersRoutes: RouteObject[] = [
  {
    path: '/app/partners',
    element: <PartnerPage />,
  },
];
