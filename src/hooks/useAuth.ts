import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

import { isTokenValid } from '@/lib/auth';

type UserType = {
  sub?: string;
  username?: string;
};

type DecodedToken = {
  sub: string;
  username: string;
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('token');
    return isTokenValid(token);
  });

  const [user, setUser] = useState<UserType | null>(null);

  const getUserFromToken = (token: string | null) => {
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return {
        sub: decoded.sub,
        username: decoded.username,
      };
    } catch (error: unknown) {
      throw new Error(`Invalid token: ${error}`);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!isTokenValid(token)) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } else {
      setIsAuthenticated(true);
      setUser(getUserFromToken(token));
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');

      if (!isTokenValid(token)) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setIsAuthenticated(true);
        setUser(getUserFromToken(token));
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return { isAuthenticated, user };
};

export default useAuth;
