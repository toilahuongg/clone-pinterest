import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ImageItem from 'src/components/Image/ImageItem';
import useResponseImage from 'src/hooks/useResponseImage';
import { TImage } from 'src/types/image.type';

const Home = () => {
  const [data, setData] = useState<TImage[]>([]);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const run = async () => {
      const response = await axios.get('https://picsum.photos/v2/list?limit=6');
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
    return window.removeEventListener('resize', () => {});
  }, [data, listRef]);

  const listItem = useResponseImage(data, screenWidth);
  return (
    <div ref={listRef} className="list-image">
      {listItem.map((image) => (
        <ImageItem key={image.id} item={image} />
      ))}
    </div>
  );
};

export default Home;
