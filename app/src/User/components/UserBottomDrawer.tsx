import React from 'react';
import JBottomDrawer from 'src/Lib/JBottomDrawer';
import { useDrawers } from 'src/Shared/store/drawers';
import JMenuItem from 'src/Lib/JMenuItem';
import JIcon from 'src/Lib/JIcon';
import { useAlert } from 'src/Lib/store/alerts';
import { logout } from 'src/utils/hooks';
import { useUserStore } from '../store/useUserStore';

interface Props {}

const UserBottomDrawer: React.FC<Props> = () => {
  const userDrawer = useDrawers((state) => state.drawerState.isUserDrawer);
  const setUserDrawer = useDrawers((state) => state.setDrawer);
  const { setAlert } = useAlert();
  const username = useUserStore((state) => state.user.username);

  function handlelogout() {
    logout();
    setAlert({ type: 'success', message: 'Logged out' });
  }

  return (
    <div>
      <JBottomDrawer isDrawer={userDrawer} setDrawer={() => setUserDrawer('isUserDrawer', false)}>
        <JMenuItem
          className="flex space-x-2 items-center"
          closeMenuCallback={() => setUserDrawer('isUserDrawer', false)}
          to="/u/feed/"
        >
          <span className="flex-none">
            <JIcon icon="ion:home-outline" />
          </span>
          <span className="flex-grow">home</span>
        </JMenuItem>

        <JMenuItem
          className="flex space-x-2 items-center"
          closeMenuCallback={() => setUserDrawer('isUserDrawer', false)}
          to={`/u/@${username}/`}
        >
          <span className="flex-none">
            <JIcon icon="ion:person-circle-outline" />
          </span>
          <span className="flex-grow">profile</span>
        </JMenuItem>

        <JMenuItem
          className="flex space-x-2 items-center"
          closeMenuCallback={() => setUserDrawer('isUserDrawer', false)}
          to="/u/settings/"
        >
          <span className="flex-none">
            <JIcon icon="ion:gear-a" />
          </span>
          <span className="flex-grow">settings</span>
        </JMenuItem>

        <JMenuItem
          className="flex space-x-2 items-center"
          closeMenuCallback={() => setUserDrawer('isUserDrawer', false)}
          onClick={handlelogout}
        >
          <span className="flex-none">
            <JIcon icon="ion:log-out-outline" />
          </span>
          <span className="flex-grow">log out</span>
        </JMenuItem>

        <JMenuItem
          className="flex space-x-2 items-center"
          closeMenuCallback={() => setUserDrawer('isUserDrawer', false)}
          to="/lib/"
        >
          <span className="flex-none">
            <JIcon icon="ion:library-outline" />
          </span>
          <span>june lib</span>{' '}
        </JMenuItem>
      </JBottomDrawer>
    </div>
  );
};

export default UserBottomDrawer;
