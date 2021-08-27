import React from 'react';
import JSpinner from 'src/Lib/JSpinner';
import { classNames } from 'src/utils/helpers';
import { useLoader } from 'src/Shared/store/loader';

interface Props {}

const FloatingLoader: React.FC<Props> = () => {
  const isLoader = useLoader((state) => state.isLoader);

  return (
    <>
      {isLoader && (
        <div
          className={classNames([
            'inset-0 z-10000 w-full h-screen flex flex-col items-center justify-center',
            'fixed backdrop-filter backdrop-blur-sm bg-warm-gray-50 bg-opacity-30',
          ])}
        >
          <div className="p-3 bg-warm-gray-200 shadow rounded-lg">
            <JSpinner size="50px" thickness="5px" />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingLoader;
