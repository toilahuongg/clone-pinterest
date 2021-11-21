import { observer } from 'mobx-react';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { useEffect } from 'react';
import GridImage from 'src/components/GridImage';
import instance from 'src/helpers/instance';
import { usePins } from 'src/stores/pin';

const Home = () => {
  const { listPin, isLoading, setLoading } = usePins();
  useEffect(() => {
    document.title = 'Clone Pinterest';
    const run = async () => {
      setLoading(true);
      const response = await instance.get('/pin');
      applySnapshot(listPin, response.data);
      setLoading(false);
    };
    run();
  }, []);
  return isLoading ? (
    <div className="loader size-lg" />
  ) : (
    <GridImage items={getSnapshot(listPin)} isShowAction={false} />
  );
};

export default observer(Home);
