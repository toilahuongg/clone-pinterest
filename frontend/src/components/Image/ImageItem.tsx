import React from 'react';

import { TImage } from '../../types/image.type';
import Lazyload from '../Layout/Lazyload';
import styles from './image.module.scss';

const ImageItem: React.FC<{ item: TImage }> = ({ item }) => {
  // eslint-disable-next-line object-curly-newline
  const { id, width, height, left, top, download_url: url } = item;
  return (
    <div
      key={id}
      className={styles.item}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${left}px, ${top}px)`,
      }}
    >
      <Lazyload>
        <img src={url} className="img-fluid" alt="" />
      </Lazyload>
    </div>
  );
};
export default ImageItem;
