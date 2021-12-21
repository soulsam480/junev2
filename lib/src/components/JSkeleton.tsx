import React, { useMemo } from 'react';
import classNames from 'clsx';

interface Props {
  className?: string;
  width?: string;
  height?: string;
  round?: boolean;
  rounded?: boolean;
  size?: string;
}

const JSkeleton: React.FC<Props> = ({ className, round, rounded, size, width, height }) => {
  const skeletonClasses = useMemo(
    () => [{ 'j-skeleton--round': round }, { 'j-skeleton--rounded': rounded }],
    [round, rounded],
  );

  const skeletonStyles = useMemo(
    () => (!!size ? { height: size, width: size } : { width, height }),
    [height, size, width],
  );

  return (
    <div
      className={classNames(['j-skeleton animate-pulse', ...skeletonClasses, className || ''])}
      style={skeletonStyles}
    />
  );
};

export default JSkeleton;
