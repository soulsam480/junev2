import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import anchrome from 'anchorme';
import BottomNav from 'src/Feed/components/BottomNav';
import LeftNav from 'src/Feed/components/LeftNav';
import RightNav from 'src/Feed/components/RightNav';
import 'src/Feed/styles/layouts.scss';
import { classNames, replaceCaret } from 'src/utils/helpers';
import { useDebounce, useHideOnScroll } from 'src/utils/hooks';

interface Props {}

const Authorized: React.FC<Props> = () => {
  const isHidden = useHideOnScroll();

  const data = useRef('some data');
  const parsedHTML = useRef('');
  const editorRef = useRef<HTMLDivElement>(null);
  const getEl = () => editorRef.current;
  const debounced = useDebounce(onChange);

  /**
   *
   * @borrows https://github.com/lovasoa/react-contenteditable/blob/master/src/react-contenteditable.tsx
   * @license MIT
   */
  function onChange() {
    const el = getEl();
    if (!el) return;

    const html = el.innerHTML;
    const parsed = anchrome(html);

    if (parsed === data.current) return;

    data.current = parsed;
    parsedHTML.current = el.innerText;

    //TODO: totally unsafe halfass code
    el.innerHTML = parsed;
    replaceCaret(el);
  }

  return (
    <div className="j-layout">
      <aside className="j-layout__leftbar">
        <LeftNav />
      </aside>
      <main className="j-layout__content">
        <div className="pb-3">
          <div
            className="j-rich"
            contentEditable={true}
            ref={editorRef}
            onInput={debounced}
            dangerouslySetInnerHTML={{ __html: data.current }}
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
