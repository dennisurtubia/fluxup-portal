import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const BankAccountPage = lazy(() => import('../pages/BankAccountPage'));

export const bankAccountsRouter: RouteObject[] = [
  {
    path: '/app/bank-accounts',
    element: <BankAccountPage />,
  },
];
