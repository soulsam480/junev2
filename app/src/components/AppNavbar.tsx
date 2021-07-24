import React from 'react';
import { Link } from 'react-router-dom';
import JButton from 'src/lib/JButton';
import JIcon from 'src/lib/JIcon';
import JMenu from 'src/lib/JMenu';
import { classNames } from 'src/utils/hepers';

interface Props {}

const AppNavbar: React.FC<Props> = () => {
  const options = [
    {
      label: 'Account',
      value: 'account',
      icon: 'ion:ios-contact-outline',
    },
    {
      label: 'Home',
      value: 'home',
      icon: 'ion:home-outline',
    },
    {
      label: 'Log out',
      value: 'logout',
      icon: 'ion:log-out-outline',
    },
  ];
  return (
    <nav
      className={classNames([
        'sticky top-0 z-20 transition-colors duration-400',
        'ease-in-out bg-warm-gray-100 dark:bg-cool-gray-800',
        'border-b border-gray-200',
      ])}
    >
      <div className="max-w-7xl mx-auto px-2">
        <div className="relative flex items-center justify-between h-14">
          <div>
            <Link to="/">
              <img className="w-10 m-auto" src="/june-logo.svg" alt="June" />
            </Link>
          </div>
          <div className="flex space-x-1 items-center">
            <div className="hidden sm:block">
              <JButton noBg icon="ion:heart-outline" size="25px" sm dense />
            </div>
            <JButton noBg icon="ion:chatbubble-ellipses-outline" size="25px" dense sm />
            <div className="hidden sm:block">
              <JMenu
                options={options}
                avatarRound
                avatar="img:https://cdn.quasar.dev/img/avatar.png"
                size="35px"
                flat
                round
                sm
                dense
                iconRight
                invert
                noBg
                optionKey="value"
                optionSlot={(option, getVal) => (
                  <div className="w-full flex items-center space-x-2">
                    <span className="flex-none">
                      <JIcon icon={getVal(option, 'icon')} />
                    </span>
                    <span className="flex-grow"> {getVal(option, 'label')} </span>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
