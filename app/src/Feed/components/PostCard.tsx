import React, { useState } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JCard from 'src/Lib/JCard';
import JImage from 'src/Lib/JImage';
import JMenu from 'src/Lib/JMenu';
import Linkify from 'react-linkify';
interface Props {
  imgSrc: string;
}

const PostCard: React.FC<Props> = ({ imgSrc }) => {
  const [val, setVal] = useState('');
  const options = [
    {
      label: 'Account',
      value: 'account',
      icon: 'ion:ios-contact-outline',
    },
    {
      label: 'Home',
      value: 'home',
      icon: 'ion:home-outline',
    },
    {
      label: 'Log out',
      value: 'logout',
      icon: 'ion:log-out-outline',
    },
  ];

  return (
    <JCard
      className="post-card"
      headerSlot={
        <div className="flex px-3 pt-4 justify-between items-center">
          <div className="flex space-x-2 grow items-center">
            <div className="flex-none">
              <JAvatar src="https://cdn.quasar.dev/img/avatar.png" rounded />
            </div>
            <div className="flex grow flex-col space-y-1 justify-start">
              <div className="text-sm leading-none">Manish Sahu</div>
              <div className="text-xs leading-none">Cuttack</div>
            </div>
          </div>
          <div className="flex-none">
            <JMenu
              value={val}
              onInput={(v) => setVal(v)}
              optionKey="value"
              options={options}
              size="25px"
              round
              sm
              noBg
              dense
              icon="ion:ellipsis-horizontal-outline"
              listAlign="right"
            />
          </div>
        </div>
      }
      footerSlot={
        <div className="flex px-2 py-4 justify-between items-center">
          <div className="flex space-x-2">
            <JButton noBg icon="ion:heart-outline" size="25px" sm dense />
            <JButton noBg icon="ion:chatbubble-outline" size="25px" sm dense />
          </div>

          <JButton noBg icon="ion:share-social-outline" size="25px" sm dense />
        </div>
      }
      contentSlot={
        <>
          <div className="p-2 break-words">
            <Linkify
              componentDecorator={(h, t, k) => (
                <a
                  href={h}
                  key={k}
                  className="text-lime-600 font-thin hover:(underline underline-lime-600) transition-all ease-in-out duration-300"
                >
                  {' '}
                  {t}{' '}
                </a>
              )}
            >
              Lorem ipsum dolor sit amet, https://consectetur.com adipiscing elit. Maecenas
              https://iaculis.in consequat arcu et eleifend. Duis fringilla a tortor in lobortis.
              https://Phasellus.net ut tempus diam, nec scelerisque orci. Aliquam quis ligula
              consectetur, aliquam quam eu, pulvinar ex. Duis volutpat felis quis lorem cursus, nec
              finibus felis pretium. https://Nullam.io nec nibh vel metus feugiat vehicula et et
              nisi. Vivamus est augue, mattis dignissim velit vel, dignissim molestie turpis.
              Suspendisse potenti.
            </Linkify>
          </div>

          <JImage src={imgSrc} loading="lazy" minHeight="300px" />
        </>
      }
      block
    ></JCard>
  );
};

export default PostCard;
