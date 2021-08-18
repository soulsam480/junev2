import React, { useState } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JCard from 'src/Lib/JCard';
import JImage from 'src/Lib/JImage';
import JMenu from 'src/Lib/JMenu';
import { Post } from 'src/utils/types';
import AppLinkifier from 'src/Shared/components/Linkifier';
import { useUserStore } from 'src/User/store/useUserStore';
import PostReact from 'src/Feed/components/postCard/PostReact';
interface Props {
  post: Post;
  updatePostReaction: (post: Post) => void;
}

const PostCard: React.FC<Props> = ({ post, updatePostReaction }) => {
  const [val, setVal] = useState('');

  const {
    user: { id },
  } = useUserStore();

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
              <div className="text-sm leading-none">{post.user.name}</div>
              <div className="text-xs leading-none text-warm-gray-500">@{post.user.username}</div>
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
            <PostReact updatePostReaction={updatePostReaction} post={post} uid={id} />
            <JButton noBg icon="ion:chatbubble-outline" size="25px" sm dense />
          </div>

          <JButton noBg icon="ion:share-social-outline" size="25px" sm dense />
        </div>
      }
      contentSlot={
        <>
          <div className="p-2 break-all">
            <AppLinkifier
              linkEl={({ match, key, href }) => (
                <a
                  href={href}
                  target="_blank"
                  key={key}
                  className="j-link break-all"
                  rel="noopener noreferrer nofollow"
                >
                  {match}
                </a>
              )}
            >
              {post.content}
            </AppLinkifier>
          </div>
          {!!post.url && <JImage src={post.url || ''} loading="lazy" minHeight="300px" />}
        </>
      }
      block
    ></JCard>
  );
};

export default PostCard;
