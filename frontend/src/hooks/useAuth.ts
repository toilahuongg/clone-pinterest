const useAuth = () => {
  return !!window.localStorage.getItem('token');
};
export default useAuth;
