import { Route, RouteProps, Redirect } from 'react-router-dom';

import useUsers from './hooks/useUsers';

const PrivateRouter: React.FC<RouteProps> = (props) => {
  const { auth } = useUsers();
  return auth.isAuth ? <Route {...props} /> : <Redirect to="/" />;
};
export default PrivateRouter;
