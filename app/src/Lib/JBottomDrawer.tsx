import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { useClickoutside } from 'src/utils/hooks';

interface Props {
  isDrawer: boolean;
  setDrawer: () => void;
}

const JBottomDrawer: React.FC<Props> = ({ isDrawer, setDrawer, children }) => {
  const [ref] = useClickoutside<HTMLDivElement>(() => setDrawer());

  useEffect(() => {
    isDrawer && document.body.classList.add('body-noscroll');
    !isDrawer && document.body.classList.remove('body-noscroll');
  }, [isDrawer]);

  return createPortal(
    <div className="j-bottom-drawer">
      <CSSTransition
        in={isDrawer}
        timeout={{
          enter: 300,
          exit: 300,
        }}
        classNames="j-bottom-drawer__backdrop"
        unmountOnExit
      >
        <div className="j-bottom-drawer__backdrop"></div>
      </CSSTransition>

      <CSSTransition
        in={isDrawer}
        timeout={{
          enter: 300,
          exit: 300,
        }}
        classNames="j-bottom-drawer"
        unmountOnExit
      >
        <div className="j-bottom-drawer__list-parent" ref={ref}>
          <div className="j-bottom-drawer__close-handle" onClick={setDrawer}></div>
          <div className="j-bottom-drawer__list">{children}</div>
        </div>
      </CSSTransition>
    </div>,
    document.getElementById('drawer-root') as HTMLDivElement,
  );
};

export default JBottomDrawer;
