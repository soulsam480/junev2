import React, { useMemo } from 'react';
import { classNames } from 'src/utils/helpers';
import JIcon from 'src/Lib/JIcon';
import JAvatar from 'src/Lib/JAvatar';
import { BaseJButtonProps } from 'src/utils/types';
import { NavLink } from 'react-router-dom';

export interface JButtonProps extends BaseJButtonProps {
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
  to,
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

  const children = useMemo(
    () => (
      <>
        {' '}
        <span className={classNames(['j-button__content', ...buttonContentClasses])}>
          <>
            {!!iconSlot ? (
              iconSlot
            ) : icon ? (
              <JIcon icon={icon} size={size ? size : sm ? '12px' : '16px'} />
            ) : (
              avatar && (
                <JAvatar
                  icon={avatar.startsWith('icn:') ? avatar.split('icn:')[1] : undefined}
                  src={avatar.startsWith('img:') ? avatar.split('img:')[1] : undefined}
                  size={size || '16px'}
                  content={
                    !avatar.startsWith('img:') || !avatar.startsWith('icn:') ? avatar : undefined
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
            <span
              className={classNames([
                'j-button__loading',
                `j-button__loading${flat || outline || noBg ? '--invert' : '--normal'}`,
              ])}
              style={{ height: sm ? '16px' : '20px', width: sm ? '16px' : '20px' }}
            ></span>
          </span>
        )}
      </>
    ),
    [
      buttonClasses,
      buttonContentClasses,
      iconSlot,
      icon,
      avatarRound,
      labelSlot,
      loading,
      labelSlot,
      label,
      size,
      avatar,
    ],
  );

  return !!to ? (
    <NavLink
      to={to}
      children={children}
      className={classNames(['j-button', ...buttonClasses])}
      activeClassName="j-button--active"
    />
  ) : (
    <button
      className={classNames(['j-button', ...buttonClasses])}
      type={type || 'button'}
      {...rest}
      children={children}
    />
  );
};

export default JButton;
