import { useEffect, useState } from 'react';

import { isTokenValid } from '@/lib/auth';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('token');
    return isTokenValid(token); // 🔹 Valida o token na inicialização
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!isTokenValid(token)) {
        localStorage.removeItem('token'); // 🔹 Remove token expirado
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };

    window.addEventListener('storage', checkAuth); // Atualiza quando o token muda

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return { isAuthenticated };
};

export default useAuth;
