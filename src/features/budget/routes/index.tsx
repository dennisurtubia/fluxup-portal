import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const BudgetPage = lazy(() => import('../pages/BudgetPage'));
const BudgetEntriesPage = lazy(() => import('../pages/BudgetEntriesPage'));
const BudgetCashFlowPage = lazy(() => import('../pages/BudgetCashFlowPage'));

export const budgetsRouter: RouteObject[] = [
  {
    path: '/app/budgets',
    element: <BudgetPage />,
  },
  {
    path: '/app/budgets/:id',
    element: <BudgetEntriesPage />,
  },
  {
    path: '/app/budgets/:id/cash-flow',
    element: <BudgetCashFlowPage />,
  },
];
