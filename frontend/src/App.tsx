import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/Layout/Header';

const Playground = React.lazy(() => import('./components/Playground'));
const Home = React.lazy(() => import('./components/Home'));
const Loading = () => <>...Loading</>;

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="app">
        <React.Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/playground" component={Playground} />
          </Switch>
        </React.Suspense>
      </div>
    </Router>
  );
};

export default App;
