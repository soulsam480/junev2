import React from 'react';
import { User } from 'src/User/store/useUserStore';

interface Props {
  user?: User;
}

const Bio: React.FC<Props> = () => {
  return (
    <div>
      <div className="user-profile__bio">
        <div className="text-xl">Sambit Sahoo</div>
        <div className="text-sm text-warm-gray-500">@soulsam480</div>
        <div className="text-sm px-3 text-center text-warm-gray-500">
          Contrairement à une opinion répandue, le Lorem Ipsum n'est pas simplement du texte
          aléatoire. Il trouve ses racines dans une oeuvre de la littérature latine classique datant
          de 45 av. J.-C., le rendant
        </div>
      </div>
      <div className="user-profile__info">
        <div className="flex justify-center text-sm">200 followers</div>
        <div className="flex justify-center text-sm">200 following</div>{' '}
        <div className="flex justify-center text-sm">200 posts</div>
      </div>
    </div>
  );
};

export default Bio;
