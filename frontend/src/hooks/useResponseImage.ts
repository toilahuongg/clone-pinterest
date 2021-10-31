import { useMemo } from 'react';

import { BREAKPOINTS, MARGIN } from '../contants';
import { TImage } from '../types/image.type';

const useResponseImage = (data: TImage[], screenWidth: number) => {
  return useMemo(() => {
    const images = [...data];
    const breakpoint = BREAKPOINTS.find((item) => screenWidth >= item.width);
    if (breakpoint && images.length > 0) {
      const w = (screenWidth - (breakpoint.items - 1) * MARGIN) / breakpoint.items;
      for (let i = 0; i < Math.min(breakpoint.items, images.length); i += 1) {
        const h = (w / images[i].width) * images[i].height;
        images[i].width = w;
        images[i].height = h;
        images[i].top = 0;
        if (i === 0) images[i].left = 0;
        else images[i].left = (images[i - 1].left || 0) + images[i - 1].width + MARGIN;
        for (let j = i + breakpoint.items; j < images.length; j += breakpoint.items) {
          const height = (w / images[j].width) * images[j].height;
          images[j].width = w;
          images[j].height = height;
          images[j].left = images[i].left;
          const top = (images[j - breakpoint.items].top || 0) + images[j - breakpoint.items].height;
          images[j].top = top + MARGIN;
        }
      }
      return images;
    }
    return [];
  }, [data, screenWidth]);
};
export default useResponseImage;