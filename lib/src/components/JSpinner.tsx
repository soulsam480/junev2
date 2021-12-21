import React from 'react';
import classNames from 'clsx';

interface Props {
  className?: string;
  size?: string;
  thickness?: string | number;
  limeShade?: string;
}

const JSpinner: React.FC<Props> = ({ className, size, thickness, limeShade }) => {
  return (
    <svg
      viewBox="25 25 50 50"
      className={classNames(['j-spinner', className || '', `text-lime-${limeShade || 400}`])}
      height={size}
      width={size}
    >
      <circle
        className="j-spinner__path"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth={thickness}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

JSpinner.defaultProps = {
  size: '30px',
  thickness: 3,
};

export default JSpinner;
