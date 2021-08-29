import { AxiosResponse } from 'axios';
import React, { HTMLProps, useCallback, useEffect } from 'react';
import JButton from 'src/Lib/JButton';
import { classNames } from 'src/utils/helpers';
import { useObserver, usePaginatedQuery } from 'src/utils/hooks';
import { PaginationParams, Post, ResponseSchema } from 'src/utils/types';
import PostCard from 'src/Feed/components/PostCard';
import PostSkeletonLoader from 'src/Feed/components/postCard/PostSkeletonLoader';

interface Props extends HTMLProps<HTMLDivElement> {
  fetcher: (opts: PaginationParams) => Promise<AxiosResponse<ResponseSchema<any[]>>>;
}

const MemoizedPostCard = React.memo(PostCard);

const PostFeed: React.FC<Props> = ({ fetcher, className, ...rest }) => {
  const { data, validate, isEnd, forceValidate, isLoading } = usePaginatedQuery<Post>([], fetcher, {
    limit: 5,
  });
  const [loaderRef] = useObserver<HTMLDivElement>(observerCb);

  async function observerCb() {
    if (isEnd) return;
    if (isLoading) return;
    await validate();
  }

  const updatePostReaction = useCallback((post: Post) => {
    forceValidate((prev) =>
      prev.map((el) => (el.id !== post.id ? el : { ...el, likes: post.likes })),
    );
  }, []);

  useEffect(() => {
    (async () => await validate())();
  }, []);

  return (
    <div
      className={classNames(['flex flex-col items-start space-y-3 pb-15', className || ''])}
      {...rest}
    >
      {!!data.length
        ? data?.map((post) => (
            <MemoizedPostCard key={post.id} post={post} updatePostReaction={updatePostReaction} />
          ))
        : !isLoading && <div className="flex justify-center w-full">no published post found !</div>}

      {(!!data.length || isLoading) && (
        <>
          <div className="flex flex-col w-full space-y-3">
            {isLoading && Array.from(Array(4)).map((_, i) => <PostSkeletonLoader key={i} />)}{' '}
            <div ref={loaderRef} className="flex justify-center">
              <JButton
                label={isEnd ? "That's all from june" : ''}
                onClick={validate}
                flat
                disabled={isEnd}
                loading={isLoading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostFeed;
