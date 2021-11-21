import React, { ReactElement, useEffect } from 'react';

import styles from './dropdown.module.scss';

type TProps = {
  isShow: boolean;
  align?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'left' | 'right';
  activator: ReactElement;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[] | string | string[];
};
const Dropdown: React.FC<TProps> = ({ isShow, align, activator, children, onClose }) => {
  useEffect(() => {
    if (isShow)
      document.addEventListener('mousedown', () => {
        onClose();
      });
  }, [isShow]);
  return (
    <div className={styles.dropdown} onMouseDown={(e) => e.stopPropagation()}>
      {activator}
      <div className={`${styles.content} ${isShow ? ` ${styles.show}` : ''} ${styles[align || 'bottomLeft']}`}>
        {children}
      </div>
    </div>
  );
};

Dropdown.defaultProps = { align: 'bottomLeft' };
export default Dropdown;
