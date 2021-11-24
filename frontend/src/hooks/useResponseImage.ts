import { useMemo } from 'react';
import { IPinModelOut } from 'src/stores/pin';

import { BREAKPOINTS, MARGIN } from '../contants';

export type TResponseImage = IPinModelOut & { top: number; left: number };
const useResponseImage = (data: IPinModelOut[], screenWidth: number) => {
  return useMemo(() => {
    const images = JSON.parse(JSON.stringify(data)) as TResponseImage[];
    const breakpoint = BREAKPOINTS.find((item) => screenWidth >= item.width);
    let divHeight = 0;
    if (breakpoint && images.length > 0) {
      const w = (screenWidth - (breakpoint.items - 1) * MARGIN) / breakpoint.items;

      for (let i = 0; i < Math.min(breakpoint.items, images.length); i += 1) {
        const h = (w / images[i].width) * images[i].height;
        images[i].width = w;
        images[i].height = h;
        images[i].top = 0;
        if (i === 0) images[i].left = 0;
        else images[i].left = (images[i - 1].left || 0) + images[i - 1].width + MARGIN;
        let colHeight = 0;
        let lastHeight = 0;
        for (let j = i + breakpoint.items; j < images.length; j += breakpoint.items) {
          const height = (w / images[j].width) * images[j].height;
          images[j].width = w;
          images[j].height = height;
          images[j].left = images[i].left;
          const top = (images[j - breakpoint.items].top || 0) + images[j - breakpoint.items].height;
          images[j].top = top + MARGIN + 20;
          colHeight = images[j].top;
          lastHeight = images[j].height;
        }
        divHeight = colHeight + lastHeight > divHeight ? colHeight + lastHeight : divHeight;
      }
      return { divHeight, images };
    }
    return { divHeight: 0, images: [] };
  }, [data, screenWidth]);
};
export default useResponseImage;
