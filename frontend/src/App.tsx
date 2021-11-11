import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRouter from './PrivateRouter';
import Header from './components/Layout/Header';
import useAuth from './hooks/useAuth';
import useUsers from './hooks/useUsers';

const Playground = React.lazy(() => import('./components/Playground'));
const Profile = React.lazy(() => import('./components/Profile'));
const Settings = React.lazy(() => import('./components/Settings'));
const Home = React.lazy(() => import('./components/Home'));

const App: React.FC = () => {
  const { isAuth } = useAuth();
  const { getUser } = useUsers();
  useEffect(() => {
    if (isAuth) getUser();
  }, []);
  return (
    <Router>
      <Header />
      <div className="app">
        <React.Suspense fallback={<div className="loader size-lg" />}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/playground" component={Playground} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/settings" component={Settings} />
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
