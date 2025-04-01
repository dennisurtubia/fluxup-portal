import { Navigate, Outlet } from 'react-router-dom';

import LoadingScreen from '@/components/Loading';
import useAuth from '@/hooks/useAuth';

const AuthGuard = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthGuard;
