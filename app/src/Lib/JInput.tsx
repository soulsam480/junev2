import React, { HTMLProps, useMemo } from 'react';
import { classNames } from 'src/utils/helpers';

type InputElement = HTMLInputElement | HTMLTextAreaElement;
interface Props {
  onInput: (e: string) => void;
  className?: string;
  is?: 'input' | 'textarea';
  contentClass?: string;
  label?: string;
  dense?: boolean;
  onEnter?: (e: React.KeyboardEvent<InputElement>) => void;
}

const JInput: React.FC<Props & Omit<HTMLProps<InputElement>, 'onInput'>> = ({
  onInput,
  className,
  is = 'input',
  contentClass,
  label,
  dense,
  onEnter,
  onKeyDown,
  ...rest
}) => {
  const inputClasses = useMemo(
    () => [
      {
        'j-input--dense': dense,
      },
      className || '',
      'j-input',
    ],
    [dense],
  );

  function handleKeyDown(e: React.KeyboardEvent<InputElement>) {
    if (!!onKeyDown) {
      onKeyDown(e);
    }

    if (!!onEnter) {
      if (e.key !== 'Enter') return;
      onEnter(e);
    }
  }

  return (
    <div className={classNames([...inputClasses])}>
      {label && <label children={label} htmlFor={rest.id} className="j-input__label" />}
      {is === 'input' ? (
        //@ts-ignore
        <input
          onChange={(e) => onInput(e.target.value)}
          className={classNames([`${contentClass || ''}`])}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          //@ts-ignore
          {...rest}
        />
      ) : (
        //@ts-ignore
        <textarea
          onChange={(e) => onInput(e.target.value)}
          className={classNames([`${contentClass || ''}`])}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          //@ts-ignore
          {...rest}
        />
      )}
    </div>
  );
};

export default JInput;
