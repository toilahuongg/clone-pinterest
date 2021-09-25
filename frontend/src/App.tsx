import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="dark-mode">
      <Header />
      <Router>
        <div className="app">app</div>
      </Router>
    </div>
  );
};

export default App;
