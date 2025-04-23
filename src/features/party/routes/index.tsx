import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const PartyPage = lazy(() => import('../pages/PatryPage'));

export const partiesRoutes: RouteObject[] = [
  {
    path: '/app/parties',
    element: <PartyPage />,
  },
];
