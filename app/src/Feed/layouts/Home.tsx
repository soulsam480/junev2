import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from 'src/Feed/components/BottomNav';
import LeftNav from 'src/Feed/components/LeftNav';
import RightNav from 'src/Feed/components/RightNav';
import 'src/Feed/styles/layouts.scss';
import JInput from 'src/Lib/JInput';
import { classNames } from 'src/utils/helpers';
import { useHideOnScroll } from 'src/utils/hooks';

interface Props {}

const Authorized: React.FC<Props> = () => {
  const isHidden = useHideOnScroll();
  const [val, setVal] = useState('');
  return (
    <div className="j-layout">
      <aside className="j-layout__leftbar">
        <LeftNav />
      </aside>
      <main className="j-layout__content">
        <div className="pb-3">
          <JInput
            value={val}
            onInput={(e) => setVal(e)}
            placeholder="Add post content"
            is="textarea"
            className="h-52"
          />
        </div>
        <Outlet />
      </main>
      <aside className="j-layout__rightbar">
        {' '}
        <RightNav />
      </aside>
      <div
        className={classNames([
          'j-layout__bottombar',
          {
            'j-layout__bottombar--hidden': isHidden,
          },
        ])}
      >
        <BottomNav />
      </div>
    </div>
  );
};

export default Authorized;
