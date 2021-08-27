import React, { useCallback, useEffect, useState, useRef } from 'react';
import PostCard from 'src/Feed/components/PostCard';
import JButton from 'src/Lib/JButton';
import { getAllPosts } from 'src/Shared/services/post';
import { useObserver, usePaginatedQuery, useQuery } from 'src/utils/hooks';
import { Post, ResponseSchema } from 'src/utils/types';
import AppPostEditor from 'src/Shared/components/PostEditor';
import { createPost } from 'src/Shared/services/post';
import PostSkeletonLoader from 'src/Feed/components/postCard/PostSkeletonLoader';
import { useAlert } from 'src/Lib/store/alerts';

interface Props {}

const MemoizedPostCard = React.memo(PostCard);
const Test: React.FC<Props> = () => {
  const [editorData, setEditorData] = useState('');
  const { setAlert } = useAlert();

  const { data, validate, isEnd, forceValidate, isLoading } = usePaginatedQuery<Post>(
    [],
    getAllPosts,
    {
      limit: 5,
    },
  );
  const [loaderRef] = useObserver<HTMLDivElement>(observerCb);
  const { validate: create, isLoading: createLoading } = useQuery<
    ResponseSchema<Post>,
    [{ content: string }]
  >({ data: {} as any }, (args) => createPost(...args));

  async function observerCb() {
    if (isEnd) return;
    if (isLoading) return;
    await validate();
  }

  async function savePost() {
    if (isLoading) return;
    try {
      const { data } = await create({ content: editorData });

      console.log(data);
      forceValidate((prev) => [{ ...data }, ...prev]);

      setEditorData('');
      setAlert({ message: 'Post published', type: 'success' });
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: 'Some error occured !' });
    }
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
    <>
      <div className="pb-3 flex flex-col space-y-2">
        <div className="flex justify-end flex-col items-end space-y-2">
          <AppPostEditor
            value={editorData}
            setValue={setEditorData}
            placeholder="use @ to mention"
            className="w-full h-full"
            onPost={savePost}
            isLoading={createLoading}
          />
        </div>
      </div>

      <div className="flex flex-col items-start space-y-3 pb-15">
        {data?.map((post) => (
          <MemoizedPostCard key={post.id} post={post} updatePostReaction={updatePostReaction} />
        ))}
        {(!!data.length || isLoading) && (
          <>
            <div className="flex flex-col w-full space-y-3">
              {isLoading && Array.from(Array(4)).map((_, i) => <PostSkeletonLoader key={i} />)}{' '}
              <div ref={loaderRef} className="flex justify-center">
                <JButton
                  label={isEnd ? "That's all from june" : undefined}
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
    </>
  );
};

export default Test;
