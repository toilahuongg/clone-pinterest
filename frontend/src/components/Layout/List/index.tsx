import React from 'react';

import ListItem from './ListItem';
import styles from './list.module.scss';

const List: React.FC<React.InsHTMLAttributes<HTMLUListElement>> = ({ className, children, ...props }) => {
  return (
    <ul className={`${styles.list} ${className}`} {...props}>
      {children}
    </ul>
  );
};
export default Object.assign(List, { Item: ListItem });
