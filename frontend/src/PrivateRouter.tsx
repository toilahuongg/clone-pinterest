import { Route, RouteProps, Redirect } from 'react-router-dom';

import useAuth from './hooks/useAuth';

const PrivateRouter: React.FC<RouteProps> = (props) => {
  const { isAuth } = useAuth();
  return isAuth ? <Route {...props} /> : <Redirect to="/" />;
};
export default PrivateRouter;
