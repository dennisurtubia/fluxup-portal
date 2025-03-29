import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';

const GuestGuard = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
