import React, { useRef } from 'react';
import randromString from 'src/helpers/randomString';

import FormText from './FormText';
import styles from './form.module.scss';

const FormInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    text?: { type: 'normal' | 'error'; content: string };
  }
> = ({ text, label, className, ...props }) => {
  const id = useRef(randromString(10));
  return (
    <div className={styles.formGroup + (className ? ` ${className}` : '')}>
      {!['checkbox', 'radio'].includes(props.type || '') && (
        <label className={styles.formLabel} htmlFor={id.current}>
          {label}
        </label>
      )}
      <input id={id.current} className={styles.formInput} {...props} />
      {['checkbox', 'radio'].includes(props.type || '') && (
        <label className={styles.formLabel} htmlFor={id.current}>
          {label}
        </label>
      )}
      {text && <FormText className={styles[text.type || 'normal']}> {text.content} </FormText>}
    </div>
  );
};
FormInput.defaultProps = { text: undefined };
export default FormInput;
