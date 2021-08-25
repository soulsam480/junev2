import React from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JCard from 'src/Lib/JCard';
import JImage from 'src/Lib/JImage';
import { Post } from 'src/utils/types';
import AppLinkifier from 'src/Shared/components/Linkifier';
import { useUserStore } from 'src/User/store/useUserStore';
import PostReact from 'src/Feed/components/postCard/PostReact';
import { Link } from 'react-router-dom';
import PostContext from './postCard/PostContext';
interface Props {
  post: Post;
  updatePostReaction: (post: Post) => void;
}

const PostCard: React.FC<Props> = ({ post, updatePostReaction }) => {
  const id = useUserStore((state) => state.user.id);

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
              <Link className="text-sm leading-none" to={`/u/@${post.user.username}`}>
                {post.user.username}
              </Link>
              <div className="text-xs leading-none text-warm-gray-500">{post.user.name}</div>
            </div>
          </div>
          <div className="flex-none">
            <PostContext post={post} />
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
              linkEl={({ match, key, href }) =>
                match.startsWith('@') ? (
                  <Link
                    to={`/u/${match}/`}
                    key={key}
                    className="j-link break-all"
                    rel="noopener noreferrer nofollow"
                  >
                    {match}{' '}
                  </Link>
                ) : (
                  <a
                    href={href}
                    key={key}
                    className="j-link break-all"
                    rel="noopener noreferrer nofollow"
                  >
                    {match}
                  </a>
                )
              }
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
