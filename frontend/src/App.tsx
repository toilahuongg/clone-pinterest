import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRouter from './PrivateRouter';
import Header from './components/Layout/Header';
import useUsers from './hooks/useUsers';

const Playground = React.lazy(() => import('./components/Playground'));
const Profile = React.lazy(() => import('./components/Profile'));
const Home = React.lazy(() => import('./components/Home'));
const Loading = () => <>...Loading</>;

const App: React.FC = () => {
  const { auth, getUser } = useUsers();
  const { isAuth } = auth;
  useEffect(() => {
    if (isAuth) getUser();
  }, []);
  return (
    <Router>
      <Header />
      <div className="app">
        <React.Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/playground" component={Playground} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/profile/:username" component={Profile} />
            <PrivateRouter path="/xyz" component={Profile} />
          </Switch>
        </React.Suspense>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
