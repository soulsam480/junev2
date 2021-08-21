import React from 'react';
import { UserProfile } from 'src/User/store/useUserStore';

interface Props {
  user?: UserProfile;
}

const Bio: React.FC<Props> = ({ user }) => {
  return (
    <div>
      <div className="user-profile__bio">
        <div className="text-xl">{user?.name}</div>
        <div className="text-sm text-warm-gray-500">@{user?.username}</div>
        <div className="text-sm px-3 text-center text-warm-gray-500">{user?.bio}</div>
      </div>
      <div className="user-profile__info">
        <div className="flex justify-center text-sm">{user?.total_followers || 0} followers</div>
        <div className="flex justify-center text-sm">
          {user?.total_followings || 0} following
        </div>{' '}
        <div className="flex justify-center text-sm">{user?.total_posts || 0} posts</div>
      </div>
    </div>
  );
};

export default Bio;
