import React from 'react';
import { classNames } from 'src/utils/helpers';

interface Props {
  size?: string;
  icon: string;
  className?: string;
}

const JIcon: React.FC<Props> = ({ size, icon, className }) => {
  return (
    <span className={classNames(['inline-flex items-stretch', `${className ?? ''}`])}>
      <i
        style={{ fontSize: size || '16px' }}
        className="iconify"
        data-icon={icon}
        data-inline="true"
      />
    </span>
  );
};

export default JIcon;
