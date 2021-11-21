import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import { useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import instance from 'src/helpers/instance';
import { usePins } from 'src/stores/pin';

import styles from './pin.module.scss';

const Pin = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Redirect to="/" />;
  const { detailPin } = usePins();

  useEffect(() => {
    document.title = detailPin.isLoading ? 'Loading...' : detailPin.title;
  }, [detailPin.title, detailPin.isLoading]);

  useEffect(() => {
    const run = async () => {
      try {
        detailPin.setLoading(true);
        const response = await instance.get(`/pin/${slug}`);
        applySnapshot(detailPin, response.data);
      } finally {
        detailPin.setLoading(false);
      }
    };
    run();
  }, [slug]);
  return detailPin.isLoading ? (
    <div className="loader size-lg" />
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.featuredImage}>
        <img
          src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${detailPin.featuredImage}`}
          alt=""
        />
      </div>
      <div className={styles.pin}>
        <h1>{detailPin.title}</h1>
      </div>
    </div>
  );
};

export default observer(Pin);
