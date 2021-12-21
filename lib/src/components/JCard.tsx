import React, { HTMLProps, useMemo } from 'react';
import classNames from 'clsx';

export interface JCardProps extends HTMLProps<HTMLDivElement> {
  className?: string;
  loading?: boolean;
  height?: string;
  width?: string;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  contentSlot?: React.ReactNode;
  noBg?: boolean;
  invert?: boolean;
  flat?: boolean;
  outline?: boolean;
  round?: boolean;
  block?: boolean;
  separators?: boolean;
}

const JCard: React.FC<JCardProps> = ({
  height,
  width,
  headerSlot,
  children,
  footerSlot,
  noBg,
  invert,
  flat,
  outline,
  round,
  block,
  contentSlot,
  className,
  separators,
  ...rest
}) => {
  const cardClasses = useMemo(
    () => [
      noBg ? 'bg-transparent' : 'bg-warm-gray-200',
      `${round ? 'rounded-full' : 'rounded-md'}`,
      `${className ?? ''}`,
    ],
    [noBg, round, className],
  );

  return (
    <div
      className={classNames([...cardClasses])}
      style={{ width: block ? '100%' : width, height }}
      {...rest}
    >
      {!!children ? (
        children
      ) : (
        <div className={classNames(['flex flex-col', { 'divide-y': separators }])}>
          <div>{headerSlot}</div>
          <div className="grow max-h-full max-w-full w-full">{contentSlot}</div>
          <div>{footerSlot}</div>
        </div>
      )}
    </div>
  );
};

export default JCard;
