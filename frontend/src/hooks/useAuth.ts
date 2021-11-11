import { useMemo } from 'react';

const useAuth = () => {
  const isAuth = useMemo(() => !!window.localStorage.getItem('token'), [window.localStorage.getItem('token')]);
  const setToken = (token: string) => window.localStorage.setItem('token', token);
  const removeToken = () => window.localStorage.removeItem('token');
  return { isAuth, setToken, removeToken };
};
export default useAuth;
