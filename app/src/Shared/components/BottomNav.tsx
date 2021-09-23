import React from 'react';
import JButton from 'src/Lib/JButton';

import { useDrawers } from 'src/Shared/store/drawers';
import { JunePaths } from 'src/Shared/router';
import { useUserStore } from 'src/User/store/useUserStore';
import { getFileUrl, getUserInitials } from 'src/utils/helpers';
interface Props {}

const BottomNav: React.FC<Props> = () => {
  const setUserDrawer = useDrawers((state) => state.setDrawer);
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex space-x-1 h-full items-center justify-around text-gray-600 border-t border-t-warm-gray-300 shadow">
      <JButton noBg icon="ion:home-outline" size="25px" sm to={JunePaths.User} />
      <JButton noBg icon="ion:search-outline" size="25px" sm />
      <JButton noBg icon="ion:heart-outline" size="25px" sm />

      <JButton
        avatar={user.image ? `img:${getFileUrl(user.image)}` : `con:${getUserInitials(user)}`}
        avatarRound
        round
        dense
        size="25px"
        sm
        onClick={() => setUserDrawer('isUserDrawer', true)}
      />
    </div>
  );
};

export default BottomNav;
