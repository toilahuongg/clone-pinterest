import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ImageItem from './components/Image/ImageItem';
import Header from './components/Layout/Header';
import Playground from './components/Playground';
import useResponseImage from './hooks/useResponseImage';
import { TImage } from './types/image.type';

const App: React.FC = () => {
  const [data, setData] = useState<TImage[]>([]);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const run = async () => {
      const response = await axios.get('https://picsum.photos/v2/list?limit=50');
      setData(response.data);
    };
    run();
  }, []);

  const getWidth = () => {
    if (listRef.current) {
      const clientWidth = listRef.current.getBoundingClientRect().width;
      return clientWidth;
    }
    return 0;
  };
  useEffect(() => {
    setScreenWidth(getWidth());
    window.addEventListener('resize', () => {
      setScreenWidth(getWidth());
    });
  }, [data, listRef]);

  const listItem = useResponseImage(data, screenWidth);
  return (
    <>
      <Header />
      <div className="app">
        <Router>
          <Route path="/playground">
            <Playground />
          </Route>
          <Route exact path="/">
            <div ref={listRef} className="list-image">
              {listItem.map((image) => (
                <ImageItem key={image.id} item={image} />
              ))}
            </div>
          </Route>
        </Router>
      </div>
    </>
  );
};

export default App;
