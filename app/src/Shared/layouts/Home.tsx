import React from 'react';
import { Outlet } from 'react-router-dom';
import 'src/Shared/styles/layouts.scss';
import { classNames } from 'src/utils/helpers';
import { useHideOnScroll } from 'src/utils/hooks';

interface Props {
  leftNavSlot: React.ReactNode;
  rightNavSlot: React.ReactNode;
  bottomNavSlot?: React.ReactNode;
  topNavSlot?: React.ReactNode;
}

const Authorized: React.FC<Props> = ({ bottomNavSlot, rightNavSlot, leftNavSlot, topNavSlot }) => {
  const isHidden = useHideOnScroll();

  return (
    <div className="j-layout">
      <aside className="j-layout__leftbar">{leftNavSlot}</aside>
      <main className="j-layout__content">
        {!!topNavSlot && <div className="j-layout__topbar"> {topNavSlot} </div>}
        <Outlet />
      </main>
      <aside className="j-layout__rightbar"> {rightNavSlot}</aside>
      {bottomNavSlot && (
        <div
          className={classNames([
            'j-layout__bottombar',
            {
              'j-layout__bottombar--hidden': isHidden,
            },
          ])}
        >
          {bottomNavSlot}
        </div>
      )}
    </div>
  );
};

export default Authorized;
