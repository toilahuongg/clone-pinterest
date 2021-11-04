import React, { useRef } from 'react';
import randromString from 'src/helpers/randomString';

import styles from './form.module.scss';

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({
  label,
  children,
  className,
  ...props
}) => {
  const id = useRef(randromString(10));
  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel} htmlFor={id.current}>
        {label}
      </label>
      <select id={id.current} className={styles.formSelect + (className ? ` ${className}` : '')} {...props}>
        {children}
      </select>
    </div>
  );
};
export default FormSelect;
