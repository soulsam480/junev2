import React, { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'clsx';
import { useClickoutside } from '../hooks';
import JButton, { JButtonProps } from './JButton';

export type optionType = string | { [k in 'label' | 'value']: any };
export type optionValMethod = (option: string | Record<string, any>, optionKey?: string) => string;
interface Props extends JButtonProps {
  options?: optionType[];
  optionKey?: 'label' | 'value';
  value?: string;
  listAlign?: 'left' | 'right';
  onInput?: (val: string, e: MouseEvent) => void;
  optionSlot?: (
    option: string | Record<string, any>,
    getOptionVal: optionValMethod,
  ) => React.ReactNode;
  children?: (ctx: {
    options?: optionType[];
    optionClasses: (option: string | Record<string, any>, optionKey?: string) => string[];
    closeMenu(val?: boolean): void;
    getOptionVal: optionValMethod;
  }) => React.ReactNode;
}

const JMenu: React.FC<Props> = (props) => {
  const { options, optionKey, onInput, value, optionSlot, listAlign, invert, children, ...rest } =
    props;

  const [isMenu, setMenu] = useState(false);
  const [ref] = useClickoutside<HTMLDivElement>(() => setMenu(false));

  const handleClose = useCallback((e: KeyboardEvent) => {
    if (!isMenu) return;
    const { key } = e;
    if (key === 'Escape') return setMenu(false);
  }, []);

  function getOptionVal(option: string | Record<string, any>, optionKey?: string): string {
    if (typeof option !== 'object') return option;
    if (!optionKey) throw new Error('optionKey prop is required for Object type option.');
    return option[optionKey];
  }

  const optionVal = useMemo(() => getOptionVal, [optionKey]);

  function handleClick(option: string | Record<string, any>, e: MouseEvent) {
    if (!!onInput) {
      onInput(getOptionVal(option, optionKey), e);
    }
    setMenu(false);
  }

  const optionClasses = useMemo(
    () => (option: string | Record<string, any>, optionKey?: string) =>
      [
        value === getOptionVal(option, optionKey) ? (invert ? 'bg-lime-400' : 'bg-lime-300') : '',
        invert ? 'hover:bg-lime-400' : 'hover:bg-lime-300',
      ],
    [optionKey],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleClose);
    return () => window.removeEventListener('keydown', handleClose);
  }, []);

  return (
    <div className="relative j-menu" ref={ref}>
      <div>
        <JButton {...rest} invert={invert} onClick={() => setMenu(!isMenu)} />
      </div>
      <CSSTransition
        in={isMenu}
        timeout={{
          enter: 300,
          exit: 300,
        }}
        classNames="j-menu"
        unmountOnExit
      >
        <div
          className={classNames([
            'j-menu__list__parent',
            listAlign === 'left' ? 'origin-top-left left-0' : 'origin-top-right right-0',
          ])}
        >
          <div
            tab-index="-1"
            role="listbox"
            aria-labelledby="assigned-to-label"
            className={classNames(['j-menu__list', invert ? 'j-menu__list--invert' : ''])}
          >
            {!!children
              ? children({
                  options,
                  optionClasses,
                  closeMenu: (e = false) => setMenu(e),
                  getOptionVal: optionVal,
                })
              : options?.map((option) => {
                  return (
                    <div
                      role="option"
                      key={optionVal(option, optionKey)}
                      title={optionVal(option, optionKey)}
                      className={classNames([
                        'j-menu__list-item',
                        ...optionClasses(option, optionKey),
                      ])}
                      onClick={(e) => handleClick(option, e)}
                    >
                      {!!optionSlot ? (
                        optionSlot(option, optionVal)
                      ) : (
                        <span className="font-normal flex-grow">
                          {getOptionVal(option, 'label')}
                        </span>
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default JMenu;
