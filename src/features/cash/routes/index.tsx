import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const CashPage = lazy(() => import('../pages/CashPage'));
const CashEntriesPage = lazy(() => import('../pages/CashEntriesPage'));
const CashEntryCreatePage = lazy(() => import('../pages/CashEntryCreatePage'));

export const cashRouter: RouteObject[] = [
  {
    path: '/app/cash',
    element: <CashPage />,
  },
  {
    path: '/app/cash/:id',
    element: <CashEntriesPage />,
  },
  {
    path: '/app/cash/:id/entry/create',
    element: <CashEntryCreatePage />,
  },
];
