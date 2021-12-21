import React, { HTMLProps, useMemo } from 'react';
import classNames from 'clsx';
import JIcon from './JIcon';
import JAvatar from './JAvatar';

export interface JButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'size' | 'onInput' | 'type'> {
  label?: string;
  icon?: string;
  size?: string;
  sm?: boolean;
  invert?: boolean;
  block?: boolean;
  flat?: boolean;
  color?: string;
  round?: boolean;
  outline?: boolean;
  iconSlot?: React.ReactNode;
  loadingSlot?: React.ReactNode;

  /**
   * should be prefixed with icn: for icon or img: for image or con: for text when avatar prop is used
   */
  avatar?: string;
  avatarRound?: boolean;
  iconRight?: boolean;
  dense?: boolean;
  noBg?: boolean;
  align?: 'left' | 'right' | 'center';
  loading?: boolean;
  labelSlot?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const JButton: React.FC<JButtonProps> = ({
  block,
  size,
  color,
  flat,
  icon,
  invert,
  label,
  sm,
  iconSlot,
  labelSlot,
  loadingSlot,
  outline,
  round,
  loading,
  avatar,
  iconRight,
  dense,
  avatarRound,
  type,
  noBg,
  className,
  align,
  onClick,
  ...rest
}) => {
  const buttonClasses = useMemo(
    () => [
      noBg
        ? 'bg-transparent hover:bg-transparent'
        : flat
        ? 'hover:bg-lime-200'
        : outline
        ? 'hover:bg-lime-200 border border-lime-400'
        : invert
        ? 'bg-lime-300 hover:bg-lime-400'
        : 'bg-lime-400 hover:bg-lime-300',
      dense
        ? '!px-[2px] !py-[2px]'
        : sm || (sm && round)
        ? '!px-2 !py-2'
        : round
        ? '!px-3 !py-3'
        : '',
      round ? 'rounded-full' : 'rounded-md',
      className || '',
      { 'focus:ring-2 focus:ring-lime-200': !(noBg || flat) },
      {
        'w-full': !!block,
      },
      align === 'left' ? 'justify-left' : align === 'right' ? 'justify-right' : 'justify-center',
    ],
    [noBg, invert, flat, outline, dense, sm, round, className, block],
  );

  const buttonContentClasses = useMemo(
    () => [
      {
        'j-button__content--loading': loading,
        'flex-row-reverse !space-x-reverse ': iconRight,
      },
    ],
    [loading, iconRight],
  );

  const children = (
    <>
      {' '}
      <span className={classNames(['j-button__content', ...buttonContentClasses])}>
        <>
          {!!iconSlot ? (
            <span>{iconSlot}</span>
          ) : icon ? (
            <JIcon icon={icon} size={size ? size : sm ? '12px' : '16px'} />
          ) : (
            avatar && (
              <JAvatar
                icon={avatar.startsWith('icn:') ? avatar.split('icn:')[1] : ''}
                src={avatar.startsWith('img:') ? avatar.split('img:')[1] : ''}
                size={size || '16px'}
                content={
                  (!avatar.startsWith('img:') || !avatar.startsWith('icn:')) &&
                  avatar.startsWith('con:')
                    ? avatar.split('con:')[1]
                    : avatar
                }
                rounded={avatarRound}
              />
            )
          )}
        </>
        <>
          {!!labelSlot
            ? labelSlot
            : label && (
                <span className={classNames([{ 'text-xs': sm }, 'flex-grow'])}>{label}</span>
              )}
        </>
      </span>
      {loading && (
        <span className="j-button__bottom">
          {!!loadingSlot ? (
            loadingSlot
          ) : (
            <span
              className={classNames([
                'j-button__loading',
                `j-button__loading${flat || outline || noBg ? '--invert' : '--normal'}`,
              ])}
              style={{ height: sm ? '16px' : '20px', width: sm ? '16px' : '20px' }}
            ></span>
          )}
        </span>
      )}
    </>
  );

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    if (!!onClick) {
      onClick(e);
    }
  }

  return (
    <button
      className={classNames(['j-button', ...buttonClasses])}
      type={type || 'button'}
      children={children}
      onClick={handleClick}
      {...rest}
    />
  );
};

export default JButton;
