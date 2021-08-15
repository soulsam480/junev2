import React, { useEffect, useState } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JCard from 'src/Lib/JCard';
import JImage from 'src/Lib/JImage';
import JMenu from 'src/Lib/JMenu';
import { Post, ResponseSchema } from 'src/utils/types';
import AppLinkifier from 'src/Shared/components/Linkifier';
import { likePost } from 'src/Shared/services/post';
import { useQuery } from 'src/utils/hooks';
import { classNames } from 'src/utils/helpers';
import { useUserStore } from 'src/User/store/useUserStore';
interface Props {
  post: Post;
  updatePostReaction: (post: Post) => void;
}

const PostCard: React.FC<Props> = ({ post, updatePostReaction }) => {
  const [val, setVal] = useState('');

  const {
    user: { id },
  } = useUserStore();

  const { isLoading, validate, error } = useQuery<ResponseSchema<Post>>(
    { data: {} as any } as any,
    () => likePost(post.id as string),
  );

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

  async function reactPost() {
    const { data: res } = await validate();
    updatePostReaction(res);
  }

  useEffect(() => {
    if (!!error) {
      console.log('some error');
    }
  }, [error]);

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
            <JButton
              noBg
              icon="ion:heart"
              size="25px"
              sm
              dense
              onClick={reactPost}
              loading={isLoading}
              className={classNames([{ 'fill-current text-red-700': post.likes?.includes(id) }])}
            />
            <JButton noBg icon="ion:chatbubble-outline" size="25px" sm dense />
          </div>

          <JButton noBg icon="ion:share-social-outline" size="25px" sm dense />
        </div>
      }
      contentSlot={
        <>
          <div className="p-2">
            <AppLinkifier
              linkEl={({ match, key, href }) => (
                <a
                  href={href}
                  target="_blank"
                  key={key}
                  className="j-link"
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
