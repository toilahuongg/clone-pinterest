import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRouter from './PrivateRouter';
import Header from './components/Layout/Header';
import useAuth from './hooks/useAuth';
import useStore from './stores';

const Playground = React.lazy(() => import('./components/Playground'));
const Profile = React.lazy(() => import('./components/Profile'));
const Settings = React.lazy(() => import('./components/Settings'));
const Home = React.lazy(() => import('./components/Home'));
const Collection = React.lazy(() => import('./components/Collection/Collection'));
const Pin = React.lazy(() => import('./components/Pin'));

const App: React.FC = () => {
  const { isAuth } = useAuth();
  const { userModel, collectionModel } = useStore();
  const { detailUser, getUser } = userModel;
  useEffect(() => {
    if (isAuth) getUser('info', true);
  }, []);

  useEffect(() => {
    if (detailUser.fetched) collectionModel.getListCollection(detailUser.id);
  }, [detailUser.fetched]);

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
            <Route path="/collection/:slug" component={Collection} />
            <Route path="/pin/:slug" component={Pin} />
            <PrivateRouter path="/xyz" component={Profile} />
          </Switch>
        </React.Suspense>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default observer(App);
