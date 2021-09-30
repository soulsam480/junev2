import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import JButton from 'src/Lib/JButton';
import { useUserStore } from 'src/User/store/useUserStore';
import { useScreenWidth } from 'src/utils/hooks';
import { JunePaths } from 'src/Shared/router';

interface Props {}

const TopNav: React.FC<Props> = () => {
  const { isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { width: screenWidth } = useScreenWidth();

  return (
    <div>
      {screenWidth < 768 && isLoggedIn && pathname !== `/${JunePaths.User}` ? (
        <JButton
          noBg
          icon="ion:arrow-back-circle-outline"
          dense
          size="30px"
          className="text-warm-gray-600"
          onClick={() => navigate(-1)}
        />
      ) : (
        <Link to="/">
          <img className="w-10 m-auto" src="/june-logo.svg" alt="June" />
        </Link>
      )}
    </div>
  );
};

export default TopNav;
