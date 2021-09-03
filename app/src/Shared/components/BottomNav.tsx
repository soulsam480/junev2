import React from 'react';
import JButton from 'src/Lib/JButton';

import { useDrawers } from 'src/Shared/store/drawers';
import { JunePaths } from 'src/Shared/router';
interface Props {}

const BottomNav: React.FC<Props> = () => {
  const setUserDrawer = useDrawers((state) => state.setDrawer);

  return (
    <div className="flex space-x-1 h-full items-center justify-around text-gray-600 border-t border-t-warm-gray-300 shadow">
      <JButton noBg icon="ion:home-outline" size="25px" sm to={JunePaths.User} />
      <JButton noBg icon="ion:search-outline" size="25px" sm />
      <JButton noBg icon="ion:heart-outline" size="25px" sm />
      <JButton
        noBg
        avatar="img:https://cdn.quasar.dev/img/avatar.png"
        avatarRound
        size="25px"
        sm
        onClick={() => setUserDrawer('isUserDrawer', true)}
      />
    </div>
  );
};

export default BottomNav;
