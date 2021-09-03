import React, { CSSProperties } from 'react';
import { classNames } from 'src/utils/helpers';

interface Props {
  onInput: (e: string) => void;
  value?: string | number | readonly string[];
  type?: string;
  className?: string;
  id?: string;
  placeholder?: string;
  is?: 'input' | 'textarea';
  contentClass?: string;
  label?: string;
}

const JInput: React.FC<Props> = ({
  value,
  onInput,
  type,
  className,
  id,
  placeholder,
  is = 'input',
  contentClass,
  label,
}) => {
  return (
    <div className={classNames(['j-input', className || ''])}>
      {label && <label children={label} htmlFor={id} className="j-input__label" />}
      {is === 'input' ? (
        <input
          onChange={(e) => onInput(e.target.value)}
          id={id}
          type={type || 'text'}
          className={classNames([`${contentClass || ''}`])}
          value={value}
          placeholder={placeholder}
          tabIndex={0}
        />
      ) : (
        <textarea
          onChange={(e) => onInput(e.target.value)}
          id={id}
          className={classNames([`${contentClass || ''}`])}
          value={value}
          placeholder={placeholder}
          tabIndex={0}
        />
      )}
    </div>
  );
};

export default JInput;
