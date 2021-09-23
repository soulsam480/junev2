import React from 'react';
import { Link } from 'react-router-dom';
import JButton from 'src/Lib/JButton';
import JIcon from 'src/Lib/JIcon';
import JMenu from 'src/Lib/JMenu';
import JMenuItem from 'src/Lib/JMenuItem';
import { useAlert } from 'src/Lib/store/alerts';
import { useUserStore } from 'src/User/store/useUserStore';
import { classNames, getFileUrl, getUserInitials } from 'src/utils/helpers';
import { logout } from 'src/utils/hooks';
import { JunePaths } from 'src/Shared/router';
import JAvatar from 'src/Lib/JAvatar';

interface Props {}

const AppNavbar: React.FC<Props> = () => {
  const setAlert = useAlert((s) => s.setAlert);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const { user } = useUserStore();

  function handlelogout() {
    logout();
    setAlert({ type: 'success', message: 'Logged out' });
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
            {isLoggedIn && (
              <>
                <div className="hidden sm:block">
                  <JButton noBg icon="ion:heart-outline" size="25px" sm dense />
                </div>
                <JButton noBg icon="ion:chatbubble-ellipses-outline" size="25px" dense sm />
              </>
            )}
            <div className="hidden sm:block">
              {isLoggedIn && (
                <JMenu
                  avatarRound
                  size="35px"
                  sm
                  noBg
                  iconSlot={
                    <JAvatar
                      src={!!user.image ? getFileUrl(user.image) : ''}
                      content={getUserInitials(user)}
                      contentClass="bg-lime-200 shadow-sm"
                      rounded
                      size="35px"
                      iconSize="15px"
                    />
                  }
                >
                  {({ closeMenu: cMenu }) => (
                    <>
                      <JMenuItem
                        className="flex space-x-2 items-center"
                        closeMenuCallback={cMenu}
                        to={JunePaths.User}
                      >
                        <span className="flex-none">
                          <JIcon icon="ion:home-outline" />
                        </span>
                        <span className="flex-grow">Home</span>
                      </JMenuItem>

                      <JMenuItem
                        className="flex space-x-2 items-center"
                        closeMenuCallback={cMenu}
                        to={`/@${user.username}/`}
                      >
                        <span className="flex-none">
                          <JIcon size="18px" icon="ion:person-circle-outline" />
                        </span>
                        <span className="flex-grow">profile</span>
                      </JMenuItem>

                      <JMenuItem
                        className="flex space-x-2 items-center"
                        closeMenuCallback={cMenu}
                        to={JunePaths.Settings}
                      >
                        <span className="flex-none">
                          <JIcon icon="ion:gear-a" />
                        </span>
                        <span className="flex-grow">Settings</span>
                      </JMenuItem>

                      <JMenuItem
                        className="flex space-x-2 items-center"
                        closeMenuCallback={cMenu}
                        onClick={handlelogout}
                      >
                        <span className="flex-none">
                          <JIcon icon="ion:log-out-outline" />
                        </span>
                        <span className="flex-grow">Log out</span>
                      </JMenuItem>
                    </>
                  )}
                </JMenu>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
