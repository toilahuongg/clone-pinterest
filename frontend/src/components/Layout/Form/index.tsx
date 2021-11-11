import React from 'react';

import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormText from './FormText';
import FormTextarea from './FormTextarea';

const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({ children, ...props }) => {
  return <form {...props}> {children} </form>;
};
export default Object.assign(Form, { Input: FormInput, Select: FormSelect, Text: FormText, Textarea: FormTextarea });
