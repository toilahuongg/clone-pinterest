import { useEffect, useRef, useState } from 'react';
import useResponseImage from 'src/hooks/useResponseImage';
import { IPinModelOut } from 'src/stores/pin';

import ModalAddToCollection from '../Pin/ModalAddPinToCollection';
import ImageItem from './ImageItem';
import styles from './image.module.scss';

const GridImage: React.FC<{ items: IPinModelOut[]; isShowAction: boolean }> = ({ items, isShowAction }) => {
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
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
    return window.removeEventListener('resize', () => {});
  }, [items, listRef]);

  const { images: listItem, divHeight } = useResponseImage(items, screenWidth);
  return (
    <div ref={listRef} className={styles.gridImage} style={{ height: `${divHeight + 50}px` }}>
      {listItem.map((image) => (
        <ImageItem key={image.id} item={image} isShowAction={isShowAction} />
      ))}
      <ModalAddToCollection />
    </div>
  );
};

export default GridImage;
