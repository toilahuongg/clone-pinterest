import React from 'react';

import styles from './list.module.scss';

const ListItem: React.FC<React.LiHTMLAttributes<HTMLLIElement> & { main?: boolean }> = ({
  main,
  className,
  children,
  ...props
}) => {
  return (
    <li className={`${main ? styles.main : ''} ${className}`} {...props}>
      {children}
    </li>
  );
};
ListItem.defaultProps = { main: undefined };
export default ListItem;
