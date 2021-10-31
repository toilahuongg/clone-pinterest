import React, { useRef } from 'react';

import styles from './modal.module.scss';

type TProps = {
  isShow: boolean;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[] | string | string[];
};
const Modal: React.FC<TProps> = ({ isShow, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleClose = () => {
    if (isShow) {
      setTimeout(() => {
        if (modalRef.current) modalRef.current.style.display = 'block';
      }, 300);
      onClose();
    }
  };
  return (
    <div ref={modalRef} className={styles.modal + (isShow ? ` ${styles.show}` : '')} onClick={() => handleClose()}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
