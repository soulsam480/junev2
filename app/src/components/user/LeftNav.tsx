import React from 'react';
import JAvatar from 'src/lib/JAvatar';

interface Props {}

const LeftNav: React.FC<Props> = () => {
  return (
    <div className="flex flex-col space-y-3">
      <div>
        <div className="text-xl">
          Trending <span className="text-xs text-warm-gray-500">india</span>
        </div>
        <div className="flex flex-col pt-2 space-y-3">
          {/* Extract to component */}
          <div>
            <div className="text-base">Fit india</div>
            <div className="text-xs text-warm-gray-500">2.9k shares</div>
          </div>{' '}
          <div>
            <div className="text-base">Indian democracy</div>
            <div className="text-xs text-warm-gray-500">2.9k shares</div>
          </div>{' '}
          <div>
            <div className="text-base">Cabinet reshuffle</div>
            <div className="text-xs text-warm-gray-500">2.9k shares</div>
          </div>
          {/* Extract to component for skeleton loader */}
          <div className="flex-grow flex-col space-y-1 animate-pulse">
            <div className="bg-warm-gray-300 p-2 rounded w-4/5"></div>
            <div className="bg-warm-gray-300 p-2 rounded w-1/4"></div>
          </div>
          <div className="flex-grow flex-col space-y-1 animate-pulse">
            <div className="bg-warm-gray-300 p-2 rounded w-4/5"></div>
            <div className="bg-warm-gray-300 p-2 rounded w-1/4"></div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-xl">You may like</div>
        <div className="flex flex-col pt-2 space-y-3">
          {/* Extract to component */}
          <div className="flex space-x-2 items-center">
            <div className="flex-none">
              <JAvatar src="https://cdn.quasar.dev/img/boy-avatar.png" size="50px" rounded />
            </div>
            <div className="flex-grow">
              <div className="text-base">Sambit Sahoo</div>
              <div className="text-xs text-warm-gray-500">mutual connection</div>
            </div>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="flex-none">
              <JAvatar src="https://cdn.quasar.dev/img/boy-avatar.png" size="50px" rounded />
            </div>
            <div className="flex-grow">
              <div className="text-base">Bangali Traders</div>
              <div className="text-xs text-warm-gray-500">local bussiness</div>
            </div>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="flex-none">
              <JAvatar src="https://cdn.quasar.dev/img/boy-avatar.png" size="50px" rounded />
            </div>
            <div className="flex-grow">
              <div className="text-base">Kolar Capital</div>
              <div className="text-xs text-warm-gray-500">investment banker</div>
            </div>
          </div>
          {/* Extract to component for skeleton loader */}
          <div className="rounded animate-pulse flex space-x-2 items-center">
            <div className="flex-none rounded-full w-12 h-12 bg-warm-gray-400"></div>
            <div className="flex-grow flex-col space-y-1">
              <div className="bg-warm-gray-300 p-2 rounded"></div>
              <div className="bg-warm-gray-300 p-2 rounded w-3/4"></div>
            </div>
          </div>{' '}
          <div className="rounded animate-pulse flex space-x-2 items-center">
            <div className="flex-none rounded-full w-12 h-12 bg-warm-gray-400"></div>
            <div className="flex-grow flex-col space-y-1">
              <div className="bg-warm-gray-300 p-2 rounded"></div>
              <div className="bg-warm-gray-300 p-2 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;
