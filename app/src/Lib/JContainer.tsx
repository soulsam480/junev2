import React, { HTMLProps } from 'react';
import { classNames } from 'src/utils/helpers';

interface Props extends HTMLProps<HTMLDivElement> {}

const JContainer: React.FC<Props> = ({ children, className }) => {
  return <div className={classNames(['p-2 bg-warm-gray-200', className || ''])}>{children}</div>;
};

export default JContainer;
