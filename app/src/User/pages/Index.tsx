import React from 'react';
import { useParams } from 'react-router-dom';
import 'src/User/styles/userProfile.scss';
import Header from 'src/User/components/profile/Header';
import JButton from 'src/Lib/JButton';
import Bio from 'src/User/components/profile/Bio';

interface Props {}

const Index: React.FC<Props> = () => {
  const { username } = useParams();

  return (
    <div className="user-profile">
      <Header />
      <Bio />

      <div>
        <div className="mt-10 bg-warm-gray-200 rounded-md grid grid-cols-3">
          <JButton
            label="posts"
            noBg
            className="self-stretch hover:(bg-warm-gray-300 rounded-md)"
          />
          <JButton
            label="uploads"
            noBg
            className="self-stretch hover:(bg-warm-gray-300 rounded-md)"
          />
          <JButton
            label="interests"
            noBg
            className="self-stretch hover:(bg-warm-gray-300 rounded-md)"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col space-y-3">
        {Array.from(Array(10)).map((el, i) => (
          <div key={i} className="h-[300px] rounded-md bg-warm-gray-300"></div>
        ))}
      </div>
    </div>
  );
};

export default Index;
