import React from 'react';
import { CgClose } from 'react-icons/cg';

import styles from './modal.module.scss';

type TProps = {
  isShow: boolean;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[] | string | string[];
};
const Header: React.FC<TProps['children']> = ({ children }) => {
  return <div className={styles.header}> {children} </div>;
};
const Body: React.FC<TProps['children']> = ({ children }) => {
  return <div className={styles.body}> {children} </div>;
};

const Modal: React.FC<TProps> = ({ isShow, onClose, children }) => {
  return (
    <div className={styles.modal + (isShow ? ` ${styles.show}` : '')} onClick={() => onClose()}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.btnClose} onClick={() => onClose()}>
          <CgClose size="30" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Object.assign(Modal, { Header, Body });
