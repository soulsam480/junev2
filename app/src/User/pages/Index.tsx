import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'src/User/styles/userProfile.scss';
import Header from 'src/User/components/profile/Header';
import JButton from 'src/Lib/JButton';
import Bio from 'src/User/components/profile/Bio';
import { getUserPostsById, getUserProfileByUsername } from 'src/User/services/users';
import { UserProfile } from 'src/User/store/useUserStore';
import { Post } from 'src/utils/types';
import PostCard from 'src/Feed/components/PostCard';

interface Props {}

const MemoizedPostCard = React.memo(PostCard);

const Index: React.FC<Props> = () => {
  const { username } = useParams();

  const [userProfileData, setUserProfile] = useState<UserProfile>();
  const [userPostsData, setUserPosts] = useState<Post[]>([]);

  async function userPosts(id: string) {
    try {
      const {
        data: { data },
      } = await getUserPostsById(id);

      setUserPosts([...data]);
    } catch (error) {
      console.log(error);
    }
  }

  async function userProfile() {
    try {
      const {
        data: { data },
      } = await getUserProfileByUsername(username.split('@')[1]);

      setUserProfile({ ...data });

      await userPosts(data.id);
    } catch (error) {
      console.log(error);
    }
  }

  const updatePostReaction = useCallback((post: Post) => {
    setUserPosts((prev) =>
      prev.map((el) => (el.id !== post.id ? el : { ...el, likes: post.likes })),
    );
  }, []);

  useEffect(() => {
    (async () => await userProfile())();
  }, []);

  return (
    <div className="user-profile">
      <Header user={userProfileData} />
      <Bio user={userProfileData} />

      <div>
        <div className="mt-10 bg-warm-gray-200 rounded-md grid grid-cols-3">
          <JButton
            label="posts"
            noBg
            className="self-stretch hover:(bg-warm-gray-300 rounded-md)"
          />
          <JButton
            label="uploads"
            noBg
            className="self-stretch hover:(bg-warm-gray-300 rounded-md)"
          />
          <JButton
            label="interests"
            noBg
            className="self-stretch hover:(bg-warm-gray-300 rounded-md)"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col items-start space-y-3">
        {userPostsData?.map((post) => (
          <MemoizedPostCard key={post.id} post={post} updatePostReaction={updatePostReaction} />
        ))}
      </div>
    </div>
  );
};

export default Index;
