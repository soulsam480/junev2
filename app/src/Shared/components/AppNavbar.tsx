import React from 'react';
import { Link } from 'react-router-dom';
import JButton from 'src/Lib/JButton';
import JIcon from 'src/Lib/JIcon';
import JMenu from 'src/Lib/JMenu';
import JMenuItem from 'src/Lib/JMenuItem';
import { classNames } from 'src/utils/helpers';
import { logout } from 'src/utils/hooks';

interface Props {}

const AppNavbar: React.FC<Props> = () => {
  function logger() {
    console.log('fired');
  }

  return (
    <nav
      className={classNames([
        'sticky top-0 z-200 transition-colors duration-400',
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
                avatarRound
                avatar="img:https://cdn.quasar.dev/img/avatar.png"
                size="35px"
                sm
                noBg
              >
                {({ closeMenu: cMenu }) => (
                  <>
                    <JMenuItem
                      className="flex space-x-2 items-center"
                      closeMenuCallback={cMenu}
                      onClick={logger}
                    >
                      <span className="flex-none">
                        <JIcon icon="ion:ios-contact-outline" />
                      </span>
                      <span className="flex-grow">Home</span>
                    </JMenuItem>

                    <JMenuItem
                      className="flex space-x-2 items-center"
                      closeMenuCallback={cMenu}
                      onClick={logger}
                    >
                      <span className="flex-none">
                        <JIcon icon="ion:home-outline" />
                      </span>
                      <span className="flex-grow">Settings</span>
                    </JMenuItem>

                    <JMenuItem
                      className="flex space-x-2 items-center"
                      closeMenuCallback={cMenu}
                      onClick={logout}
                    >
                      <span className="flex-none">
                        <JIcon icon="ion:log-out-outline" />
                      </span>
                      <span className="flex-grow">Log out</span>
                    </JMenuItem>

                    <JMenuItem
                      className="flex space-x-2 items-center"
                      closeMenuCallback={cMenu}
                      to="/lib"
                    >
                      <span className="flex-none">
                        <JIcon icon="ion:library-outline" />
                      </span>
                      <span>Lib</span>{' '}
                    </JMenuItem>
                  </>
                )}
              </JMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
