import React from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JIcon from 'src/Lib/JIcon';

interface Props {}

const RightNav: React.FC<Props> = () => {
  return (
    <div>
      <div className="h-32 relative mb-10">
        <div
          className="absolute inset-0 h-full w-full rounded-md bg-cover bg-no-repeat z-0 bg-warm-gray-300"
          //   style={{ backgroundImage: "url('https://cdn.quasar.dev/img/avatar.png')" }}
        />
        <div className="absolute -bottom-[40px] z-10 left-1/2 transform -translate-x-1/2 mx-auto">
          <JAvatar src="https://cdn.quasar.dev/img/boy-avatar.png" size="70px" rounded />
        </div>

        <div className="absolute bottom-1 right-1">
          <JButton icon="ion:camera-reverse-outline" flat sm size="16px" />
        </div>
      </div>
      <div className="flex flex-col pt-2 items-center space-y-2">
        <div className="text-2xl">Manish Sahu</div>
        <div className="text-sm bg-warm-gray-300 p-3 w-full rounded"></div>
        <div className="text-sm bg-warm-gray-300 p-3 w-full rounded"></div>
        <div className="text-sm bg-warm-gray-300 p-3 w-full rounded"></div>
        <div className="flex items-center w-full space-x-2 pt-3">
          <div className="flex-auto">
            <JButton icon="ion:settings-outline" label="Settings" block sm size="16px" />
          </div>
          <div className="flex-auto">
            <JButton icon="ion:log-out-outline" label="Logout" block sm size="16px" />
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
