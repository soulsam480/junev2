import React from 'react';
import JButton from 'src/Lib/JButton';

interface Props {}

const BottomNav: React.FC<Props> = () => {
  return (
    <div className="flex space-x-1 h-full items-center justify-around text-gray-600 border-t border-t-warm-gray-300 shadow">
      <JButton noBg icon="ion:home-outline" size="30px" sm />
      <JButton noBg icon="ion:search-outline" size="30px" sm />
      <JButton noBg icon="ion:heart-outline" size="30px" sm />
      <JButton noBg avatar="img:https://cdn.quasar.dev/img/avatar.png" avatarRound size="30px" sm />
    </div>
  );
};

export default BottomNav;
