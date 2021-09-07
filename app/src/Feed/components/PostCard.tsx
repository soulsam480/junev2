import React, { useMemo } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JCard, { JCardProps } from 'src/Lib/JCard';
import JImage from 'src/Lib/JImage';
import { Post } from 'src/utils/types';
import AppLinkifier from 'src/Shared/components/Linkifier';
import { useUserStore } from 'src/User/store/useUserStore';
import PostReact from 'src/Feed/components/postCard/PostReact';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PostContext from './postCard/PostContext';
import 'src/Feed/styles/postcard.scss';
import { classNames } from 'src/utils/helpers';
interface Props extends JCardProps {
  post: Post;
  updatePostReaction: (post: Post) => void;
  onCommentClick?: () => void;
}

const PostCard: React.FC<Props> = ({ post, updatePostReaction, onCommentClick, ...rest }) => {
  const id = useUserStore((state) => state.user.id);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isDetailsPage = useMemo(() => {
    return pathname.includes('post');
  }, [pathname]);

  function handlePostClick(e: React.MouseEvent<HTMLDivElement>) {
    if (isDetailsPage) return;

    if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) return;

    navigate(`/${post.user.username}/post/${post.id}`);
  }

  function handleCommentClick() {
    if (!!onCommentClick) {
      onCommentClick();
      return;
    }

    navigate(`/${post.user.username}/post/${post.id}/`);
  }
  return (
    <JCard
      onClick={handlePostClick}
      block
      className={classNames([{ 'post-card--no-detail': !isDetailsPage }, 'post-card'])}
      {...rest}
      headerSlot={
        <div className="post-card__header">
          <Link to={`/@${post.user.username}`} className="flex">
            <div className="flex-none">
              <JAvatar
                src={post.user?.image}
                content={!post.user?.image ? post.user?.username.slice(0, 2) : undefined}
                contentClass="bg-lime-200 shadow-sm"
                rounded
              />{' '}
            </div>
            <div className="flex flex-col self-start space-y-1 justify-start">
              {post.user.username}
              <div className="text-xs leading-none text-warm-gray-500">{post.user.name}</div>
            </div>
          </Link>
          <div className="flex-none min-w-9 min-h-9">
            <PostContext post={post} />
          </div>
        </div>
      }
      footerSlot={
        <div className="post-card__footer">
          <div className="inline-flex">
            <PostReact updatePostReaction={updatePostReaction} post={post} uid={id} />
            <JButton
              icon="ion:chatbubble-outline"
              size="20px"
              sm
              noBg
              onClick={handleCommentClick}
            />
          </div>

          <JButton icon="ion:share-social-outline" size="20px" sm noBg />
        </div>
      }
      contentSlot={
        <>
          <div className="py-2 px-3 break-all">
            <AppLinkifier
              linkEl={({ match, key, href }) =>
                match.startsWith('@') ? (
                  <Link
                    to={`/${match}/`}
                    key={key}
                    className="j-link"
                    rel="noopener noreferrer nofollow"
                  >
                    {match}{' '}
                  </Link>
                ) : (
                  <a href={href} key={key} className="j-link" rel="noopener noreferrer nofollow">
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
    ></JCard>
  );
};

export default PostCard;
