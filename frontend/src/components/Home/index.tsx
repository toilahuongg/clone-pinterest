import { observer } from 'mobx-react';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { useEffect, useRef } from 'react';
import GridImage from 'src/components/GridImage';
import useStore from 'src/stores';

const Home = () => {
  const { pinModel } = useStore();
  // eslint-disable-next-line
  const { listPin, isLoading, page, title, countPin, incrementPage, setPage, getPins, setLoading } = pinModel;
  const loadMore = useRef(null);
  const run = async () => {
    setLoading(true);
    await getPins(title);
    setLoading(false);
  };
  useEffect(() => {
    document.title = 'Clone Pinterest';
  }, []);
  useEffect(() => {
    applySnapshot(listPin, []);
    setPage(0);
  }, [title]);
  useEffect(() => {
    run();
  }, [page, title]);

  useEffect(() => {
    document.title = 'Clone Pinterest';
    if (loadMore.current) {
      const obss = new IntersectionObserver(
        async (entry) => {
          if (entry[0].isIntersecting) {
            incrementPage();
            if (listPin.length >= countPin) {
              obss.unobserve(entry[0].target);
            }
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0,
        },
      );
      obss.observe(loadMore.current);
    }
  }, [countPin, loadMore.current]);
  return (
    <>
      <GridImage items={getSnapshot(listPin)} isShowAction={false} />
      <div ref={loadMore} style={{ height: '50px' }}>
        {isLoading && <div className="loader size-lg"> </div>}
      </div>
    </>
  );
};

export default observer(Home);
