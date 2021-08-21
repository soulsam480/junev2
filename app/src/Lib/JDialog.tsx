import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { useClickoutside } from 'src/utils/hooks';

interface Props {
  isModal: boolean;
  setModal: (val: boolean) => void;
}

const JDialog: React.FC<Props> = ({ isModal, setModal, children }) => {
  const [ref] = useClickoutside<HTMLDivElement>(() => setModal(false));

  const keyListenersMap = new Map([
    ['Escape', handleEscape],
    ['Tab', handleTabKey],
  ]);

  function handleEscape() {
    if (!isModal) return;
    return setModal(false);
  }

  function handleTabKey(e: KeyboardEvent) {
    const focusableModalElements = (ref.current as HTMLDivElement).querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
    );

    const firstElement = focusableModalElements[0];
    const lastElement = focusableModalElements[focusableModalElements.length - 1];

    if (!e.shiftKey && document.activeElement !== firstElement) {
      firstElement.focus();
      return e.preventDefault();
    }

    if (e.shiftKey && document.activeElement !== lastElement) {
      lastElement.focus();
      e.preventDefault();
    }
  }

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const listener = keyListenersMap.get(e.key);
      return listener && listener(e);
    },
    [ref, keyListenersMap, isModal],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    isModal && document.body.classList.add('body-noscroll');
    !isModal && document.body.classList.remove('body-noscroll');
  }, [isModal]);

  return createPortal(
    <>
      <CSSTransition
        in={isModal}
        timeout={{
          enter: 300,
          exit: 300,
        }}
        classNames="j-dialog"
        unmountOnExit
      >
        <div className="j-dialog__backdrop" role="dialog" aria-modal={isModal}>
          <div className="j-dialog__parent">
            <div className="j-dialog__content" ref={ref}>
              {children}
            </div>
          </div>
        </div>
      </CSSTransition>
    </>,
    document.body,
  );
};

export default JDialog;
