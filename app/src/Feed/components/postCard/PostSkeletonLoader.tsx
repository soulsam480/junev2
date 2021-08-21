import React from 'react';
import JSkeleton from 'src/Lib/JSkeleton';

interface Props {}

const SkeletonLoader: React.FC<Props> = () => {
  return (
    <div className="flex flex-col space-y-2 py-3 px-2 bg-warm-gray-200 rounded-md">
      <div className="flex justify-start items-center space-x-2">
        <JSkeleton round size="40px" />
        <div className="flex flex-col space-y-1">
          <JSkeleton rounded height="15px" width="100px" />
          <JSkeleton rounded height="10px" width="50px" />
        </div>
      </div>
      <JSkeleton width="100%" height="150px" className="rounded-md" />
      <div className="flex space-x-2 justify-between">
        <div className="flex space-x-1">
          <JSkeleton round size="25px" />
          <JSkeleton round size="25px" />
        </div>
        <JSkeleton round size="25px" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
