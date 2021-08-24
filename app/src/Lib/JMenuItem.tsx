import React, { MouseEventHandler, MouseEvent as ReactMouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from 'src/utils/helpers';

interface Props {
  onClick?: MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
  className?: string;
  closeMenuCallback?: () => void;
  to?: string;
}

const JMenuItem: React.FC<Props> = ({ children, onClick, className, closeMenuCallback, to }) => {
  function handleClick(e: ReactMouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>) {
    if (!!closeMenuCallback) closeMenuCallback();
    if (!!onClick) onClick(e);
  }

  return !!to ? (
    <Link
      to={to}
      className={classNames(['j-menu__list-item', className || ''])}
      onClick={handleClick}
      tabIndex={0}
    >
      {children}
    </Link>
  ) : (
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
