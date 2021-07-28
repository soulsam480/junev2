import React from 'react';
import { classNames } from 'src/utils/helpers';

interface Props {
  onInput: (e: string) => void;
  value?: string | number | readonly string[];
  type?: string;
  className?: string;
  id?: string;
  placeholder?: string;
}

const JInput: React.FC<Props> = ({ value, onInput, type, className, id, placeholder }) => {
  return (
    <input
      onChange={(e) => onInput(e.target.value)}
      id={id}
      type={type || 'text'}
      className={classNames(['j-input', `${className ?? ''}`])}
      value={value}
      placeholder={placeholder}
    />
  );
};

export default JInput;
