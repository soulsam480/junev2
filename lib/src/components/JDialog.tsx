import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { randomId } from '../utils';
import { useClickoutside, useWindowEvent } from '../hooks';
// import { DialogAPI } from 'src/Lib/context/dialog';

interface Props {
  isModal: boolean;
  setModal: (val: boolean) => void;
}

const JDialog: React.FC<Props> = ({ isModal, setModal, children }) => {
  const [ref] = useClickoutside<HTMLDivElement>(() => setModal(false));
  const myID = useRef(randomId(10));

  // const { addToDialog, removeFromDialog } = useContext(DialogAPI);

  // const keyListenersMap = new Map([
  //   ['Escape', handleEscape],
  //   ['Tab', handleTabKey],
  // ]);

  useWindowEvent('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!isModal) return;

    e.preventDefault();
    e.stopPropagation();

    setModal(false);
  });

  useWindowEvent('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (!isModal) return;

    if (!ref.current) return;

    const focusableModalElements = (ref.current as HTMLDivElement).querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
    );

    if (!focusableModalElements) return;

    const firstElement = focusableModalElements[0];
    const lastElement = focusableModalElements[focusableModalElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (!e.shiftKey && document.activeElement !== firstElement) {
      firstElement.focus();
      return e.preventDefault();
    }

    if (e.shiftKey && document.activeElement !== lastElement) {
      lastElement.focus();
      e.preventDefault();
    }
  });

  useEffect(() => {
    isModal && document.body.classList.add('body-noscroll');
    !isModal && document.body.classList.remove('body-noscroll');
  }, [isModal]);

  // useEffect(() => {
  //   isModal && addToDialog({ id: myID.current, close: () => setModal(false) });
  //   !isModal && removeFromDialog(myID.current);
  // }, [isModal]);

  return createPortal(
    <CSSTransition
      in={isModal}
      timeout={{
        enter: 200,
        exit: 200,
      }}
      classNames="j-dialog"
      unmountOnExit
    >
      <div className="j-dialog__backdrop" role="dialog" aria-modal={isModal} id={myID.current}>
        <div className="j-dialog__parent">
          <div className="j-dialog__content" ref={ref}>
            {children}
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById('dialog-root') as HTMLDivElement,
  );
};

export default JDialog;
