import React from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JImage from 'src/Lib/JImage';
import { UserProfile } from 'src/User/store/useUserStore';

interface Props {
  user?: UserProfile;
}

const Header: React.FC<Props> = () => {
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
        <JAvatar src="https://cdn.quasar.dev/img/boy-avatar.png" size="120px" rounded />
      </div>
    </div>
  );
};

export default Header;
