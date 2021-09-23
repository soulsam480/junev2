import React from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JImage from 'src/Lib/JImage';
import { UserProfile } from 'src/User/store/useUserStore';

interface Props {
  user?: UserProfile;
}

const Header: React.FC<Props> = ({ user }) => {
  return (
    <div className="user-profile__header">
      <div className="user-profile__header-cover">
        <JImage
          src="https://cdn.quasar.dev/img/boy-avatar.png"
          style={{ maxHeight: '100%' }}
          height="100%"
        />
      </div>
      <div className="user-profile__header-profile">
        <JAvatar
          src={user?.image ? `${import.meta.env.VITE_API}/cdn/file?file_name=${user?.image}` : ''}
          content={!user?.image ? user?.username.slice(0, 2) : undefined}
          contentClass="bg-lime-200 shadow-sm"
          rounded
          size="120px"
          iconSize="50px"
        />{' '}
      </div>
    </div>
  );
};

export default Header;
