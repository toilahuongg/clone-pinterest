import React from 'react';

import styles from './button.module.scss';

type TVariant =
  | 'primary'
  | 'block-primary'
  | 'outline-primary'
  | 'block-outline-primary'
  | 'second'
  | 'block-second'
  | 'outline-second'
  | 'block-outline-second';
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: TVariant; loading?: boolean }> = ({
  variant,
  loading,
  children,
  className,
  ...props
}) => {
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={styles.btn + (variant ? ` ${styles[variant]}` : '') + (className ? ` ${className}` : '')}
      {...props}
      disabled={loading}
    >
      {loading ? <div className={styles.loader} /> : children}
    </button>
  );
};

Button.defaultProps = { variant: undefined, loading: false };
export default Button;
