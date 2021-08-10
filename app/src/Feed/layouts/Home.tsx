import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from 'src/Feed/components/BottomNav';
import LeftNav from 'src/Feed/components/LeftNav';
import RightNav from 'src/Feed/components/RightNav';
import 'src/Feed/styles/layouts.scss';
import AppPostEditor from 'src/Shared/components/AppPostEditor';
import { classNames } from 'src/utils/helpers';
import { useHideOnScroll } from 'src/utils/hooks';
// import JButton from 'src/Lib/JButton';
// import { createPost } from 'src/Shared/services/post';

interface Props {}

const Authorized: React.FC<Props> = () => {
  const isHidden = useHideOnScroll();

  // async function savePost() {
  //   try {
  //     const {
  //       data: { data },
  //     } = await createPost({ content: parsedHTML.current });
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <div className="j-layout">
      <aside className="j-layout__leftbar">
        <LeftNav />
      </aside>
      <main className="j-layout__content">
        <div className="pb-3 flex flex-col space-y-2">
          <div className="flex justify-end">
            <AppPostEditor className="w-full h-full" />
            {/* <JButton label="Save" onClick={savePost} /> */}
          </div>
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
