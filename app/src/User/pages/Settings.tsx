import React from 'react';
import { Link } from 'react-router-dom';
import JContainer from 'src/Lib/JContainer';
import JIcon from 'src/Lib/JIcon';

interface Props {}

const Settings: React.FC<Props> = () => {
  return (
    <div className="flex flex-col my-2">
      <div className="text-2xl">settings</div>
      <hr className="my-2 border-lime-400" />

      <JContainer className="flex flex-col space-y-2 rounded-md">
        <Link
          to="/settings/profile"
          className="flex p-2 sm:hover:bg-warm-gray-300 bg-warm-gray-300 sm:bg-transparent rounded-md justify-between items-center"
        >
          <span>edit Profile</span>
          <JIcon icon="ion:arrow-forward-circle-outline" size="18px" />
        </Link>

        <Link
          to="/settings/password"
          className="flex p-2 sm:hover:bg-warm-gray-300 bg-warm-gray-300 sm:bg-transparent rounded-md justify-between items-center"
        >
          <span>change Password</span>
          <JIcon icon="ion:arrow-forward-circle-outline" size="18px" />
        </Link>
      </JContainer>
    </div>
  );
};

export default Settings;
