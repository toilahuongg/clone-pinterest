import React, { useEffect, useRef, useState } from 'react';

type TProps = React.HTMLAttributes<HTMLElement>;

const Lazyload: React.FC<TProps> = ({ children, ...props }) => {
  const [isShow, setShow] = useState<boolean>(false);
  const divRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShow(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      },
    );
    if (divRef.current) observer.observe(divRef.current);
    return () => observer.disconnect();
  }, [divRef]);
  return (
    <div {...props} ref={divRef}>
      {isShow && children}
    </div>
  );
};
export default Lazyload;
