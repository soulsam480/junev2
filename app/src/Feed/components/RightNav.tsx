import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JIcon from 'src/Lib/JIcon';
import { useAlert } from 'src/Lib/store/alerts';
import { JunePaths } from 'src/Shared/router';
import { useUserStore } from 'src/User/store/useUserStore';

import { logout } from 'src/utils/hooks';
interface Props {}

const RightNav: React.FC<Props> = () => {
  const { user } = useUserStore();
  const { setAlert } = useAlert();

  const navigate = useNavigate();

  function handlelogout() {
    logout();
    setAlert({ type: 'success', message: 'Logged out' });
  }

  return (
    <div>
      <div className="h-32 relative mb-10">
        <div className="absolute inset-0 h-full w-full rounded-md bg-cover bg-no-repeat z-0 bg-warm-gray-300" />
        <div className="absolute -bottom-[40px] z-10 left-1/2 transform -translate-x-1/2 mx-auto">
          <JAvatar
            src={user?.image ? `${import.meta.env.VITE_API}/cdn/file?file_name=${user?.image}` : ''}
            content={!user?.image ? user?.username.slice(0, 2) : undefined}
            contentClass={`bg-lime-200`}
            iconSize="40px"
            size="70px"
            rounded
          />
        </div>
      </div>
      <div className="flex flex-col pt-2 items-center space-y-2">
        <div className="text-2xl"> {user.name} </div>
        <div className="text-sm w-full rounded">{user.username}</div>

        <div className="flex items-center w-full space-x-2 pt-3">
          <div className="flex-auto">
            <JButton
              icon="ion:settings-outline"
              label="settings"
              block
              sm
              size="16px"
              onClick={() => navigate(JunePaths.Settings)}
            />
          </div>
          <div className="flex-auto">
            <JButton
              icon="ion:log-out-outline"
              label="logout"
              block
              sm
              size="16px"
              onClick={handlelogout}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-5 space-y-3">
        <div className="text-xl">Activity</div>
        {/* Extract to component */}
        <div className="flex flex-col space-y-2">
          <div className="text-base">Virgin galactic</div>
          <div className="text-xs flex space-x-1">
            {' '}
            <JIcon icon="ion:heart" className="text-red-500" />{' '}
            <span className="text-gray-500">2.9k</span>
          </div>
          <div className="text-sm break-break-words">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque at nibh sem. Morbi
            molestie felis vel eros iaculis, lobortis{' '}
            <div className="truncate">
              Nunc at ex dapibus, maximus purus eget, finibus est tincidunt.
            </div>
          </div>
        </div>
        {/* Extract to component for skeleton loader */}
        <div className="flex-grow flex-col space-y-1 animate-pulse">
          <div className="bg-warm-gray-300 p-3 rounded"></div>
          <div className="bg-warm-gray-300 p-2 rounded w-1/4"></div>
          <div className="bg-warm-gray-300 p-2 rounded"></div>
          <div className="bg-warm-gray-300 p-2 rounded"></div>
          <div className="bg-warm-gray-300 p-2 rounded"></div>
        </div>
        <div className="flex-grow flex-col space-y-1 animate-pulse">
          <div className="bg-warm-gray-300 p-3 rounded"></div>
          <div className="bg-warm-gray-300 p-2 rounded w-1/4"></div>
          <div className="bg-warm-gray-300 p-2 rounded"></div>
          <div className="bg-warm-gray-300 p-2 rounded"></div>
          <div className="bg-warm-gray-300 p-2 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default RightNav;
