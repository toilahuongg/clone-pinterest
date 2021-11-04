import React from 'react';

import styles from './form.module.scss';

const FormText: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ children, className, ...props }) => {
  return (
    <div className={styles.formText + (className ? ` ${className}` : '')} {...props}>
      {children}
    </div>
  );
};
export default FormText;
