import React, { useMemo } from 'react';
import { classNames } from 'src/utils/helpers';
export interface JCardProps {
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
  ...rest
}) => {
  const cardClasses = useMemo(
    () => [
      noBg ? 'bg-transparent' : 'bg-warm-gray-200',
      `${round ? 'rounded-full' : 'rounded-md'}`,
      `${rest.className ?? ''}`,
    ],
    [noBg, round, rest.className],
  );

  return (
    <div className={classNames([...cardClasses])} style={{ width: block ? '100%' : width, height }}>
      {!!children ? (
        children
      ) : (
        <div className="flex flex-col space-y-2">
          <div>{headerSlot}</div>
          <div className="grow max-h-full max-w-full w-full">{contentSlot}</div>
          <div>{footerSlot}</div>
        </div>
      )}
    </div>
  );
};

export default JCard;
