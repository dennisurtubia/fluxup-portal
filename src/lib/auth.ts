import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  const decoded: { exp: number } = jwtDecode(token);
  const now = Date.now() / 1000;

  return decoded.exp > now;
};
