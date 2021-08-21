import React, { useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { classNames } from 'src/utils/helpers';
import { useAlert } from 'src/Lib/store/alerts';
import JIcon from 'src/Lib/JIcon';

export interface Alert {
  icon?: string;
  message: string;
  id?: string;
  type: 'success' | 'danger' | 'warning';
}

export const JAlert: React.FC<Alert> = ({ type, icon, message }) => {
  const bgColor = useMemo(() => {
    switch (type) {
      case 'success':
        return 'bg-green-500';

      case 'warning':
        return 'bg-yellow-500';

      case 'danger':
        return 'bg-red-500';

      default:
        return 'bg-blue-500';
    }
  }, [type]);

  const iconName = useMemo(() => {
    switch (type) {
      case 'success':
        return 'ion:checkmark-circle-outline';

      case 'warning':
        return 'ion:alert-circle-outline';

      case 'danger':
        return 'ion:ban-outline';

      default:
        return '';
    }
  }, [type]);

  return (
    <div className="j-alert">
      <div className={classNames(['j-alert__content', bgColor])} role="alert">
        <span>
          {' '}
          <JIcon icon={icon || iconName} />{' '}
        </span>
        <span className="flex text-base font-normal flex-nowrap">{message}</span>
      </div>
    </div>
  );
};

interface AlertGroupProps {}

export const JAlertGroup: React.FC<AlertGroupProps> = () => {
  const { alerts } = useAlert();

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 list-group z-50">
      <TransitionGroup is="div" className="flex flex-col justify-center items-center">
        {alerts.map((alert) => (
          <CSSTransition key={alert.id} timeout={1000} classNames="j-alert-anim">
            <JAlert {...alert} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};
