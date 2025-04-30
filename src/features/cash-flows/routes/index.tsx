import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const CashFlowPage = lazy(() => import('../pages/CashFlowPage'));
const CashFlowEntriesPage = lazy(() => import('../pages/CashFlowEntriesPage'));

export const cashFlowRouter: RouteObject[] = [
  {
    path: '/app/cash-flows',
    element: <CashFlowPage />,
  },
  {
    path: '/app/cash-flow/:id',
    element: <CashFlowEntriesPage />,
  },
];
