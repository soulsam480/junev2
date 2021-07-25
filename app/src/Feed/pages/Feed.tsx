import React from 'react';
import PostCard from 'src/Feed/components/PostCard';

interface Props {}

const Test: React.FC<Props> = () => {
  return (
    <div className="flex flex-col items-start space-y-3 pb-15">
      {[...Array(10)].map((x, i) => (
        <PostCard key={i} imgSrc={`https://picsum.photos/1920/1080?random=${i}`} />
      ))}
    </div>
  );
};

export default Test;
