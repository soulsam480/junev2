import React, { MouseEventHandler, MouseEvent as ReactMouseEvent } from 'react';
import classNames from 'clsx';

interface Props {
  onClick?: MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
  className?: string;
  closeMenuCallback?: () => void;
}

const JMenuItem: React.FC<Props> = ({ children, onClick, className, closeMenuCallback }) => {
  function handleClick(e: ReactMouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>) {
    if (!!closeMenuCallback) closeMenuCallback();
    if (!!onClick) onClick(e);
  }

  return (
    <div
      className={classNames(['j-menu__list-item', className || ''])}
      onClick={handleClick}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default JMenuItem;
