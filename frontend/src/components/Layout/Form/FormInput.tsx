import React, { useRef } from 'react';
import randromString from 'src/helpers/randomString';

import FormText from './FormText';
import styles from './form.module.scss';

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }> = ({
  error,
  label,
  className,
  ...props
}) => {
  const id = useRef(randromString(10));
  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel} htmlFor={id.current}>
        {label}
      </label>
      <input id={id.current} className={styles.formInput + (className ? ` ${className}` : '')} {...props} />
      {error && <FormText className={styles.error}> {error} </FormText>}
    </div>
  );
};
FormInput.defaultProps = { error: undefined };
export default FormInput;
