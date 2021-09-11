import React, { useState } from 'react';
import { useComment } from 'src/Feed/context/commentApi';
import JButton from 'src/Lib/JButton';
import JInput from 'src/Lib/JInput';
import JSpinner from 'src/Lib/JSpinner';

interface Props {
  isLoading: boolean;
}

const PostCommentForm: React.FC<Props> = ({ isLoading }) => {
  const [comment, setComment] = useState('');

  const { commentAction } = useComment();

  async function handleSubmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await commentAction(comment);

    setComment('');
  }

  return (
    <form className=" flex space-x-2 items-stretch" onSubmit={handleSubmission}>
      <div className="relative flex flex-grow items-center">
        <JInput
          value={comment}
          onInput={setComment}
          placeholder="comment"
          className="flex-grow"
          dense
          id="comment-input"
        />
        <div className="absolute right-2 hidden sm:block">
          {isLoading && <JSpinner size="24px" thickness="5" limeShade="600" />}{' '}
        </div>
      </div>
      <div className="sm:hidden">
        <JButton label="post" sm type="submit" disabled={!comment} loading={isLoading} />
      </div>
    </form>
  );
};

export default PostCommentForm;
