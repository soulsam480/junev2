import React, { useState } from 'react';
import { useComment } from 'src/Feed/context/commentApi';
import JButton from 'src/Lib/JButton';
import JInput from 'src/Lib/JInput';

interface Props {}

const PostCommentForm: React.FC<Props> = () => {
  const [comment, setComment] = useState('');

  const { commentAction } = useComment();

  async function handleSubmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await commentAction(comment);

    setComment('');
  }

  return (
    <form className=" flex space-x-2 items-stretch" onSubmit={handleSubmission}>
      <JInput
        value={comment}
        onInput={setComment}
        placeholder="comment"
        className="flex-grow"
        dense
      />
      <div className="sm:hidden">
        <JButton label="post" noBg sm type="submit" disabled={!comment} />
      </div>
    </form>
  );
};

export default PostCommentForm;
