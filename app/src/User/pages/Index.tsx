import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'src/User/styles/userProfile.scss';
import Header from 'src/User/components/profile/Header';
import Bio from 'src/User/components/profile/Bio';
import { getUserPostsById, getUserProfileByUsername } from 'src/User/services/users';
import { UserProfile } from 'src/User/store/useUserStore';
import { Post } from 'src/utils/types';
import PostCard from 'src/Feed/components/PostCard';
import * as JPanels from 'src/Lib/JPanels';
import { useScreenWidth } from 'src/utils/hooks';
import PostSkeletonLoader from 'src/Feed/components/postCard/PostSkeletonLoader';
import JSpinner from 'src/Lib/JSpinner';

interface Props {}

const MemoizedPostCard = React.memo(PostCard);

const Index: React.FC<Props> = () => {
  const { username } = useParams();
  const { width: screenWidth } = useScreenWidth();

  const [tab, setTab] = useState('posts');

  const [userProfileData, setUserProfile] = useState<UserProfile>();
  const [userPostsData, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const {
        data: { data },
      } = await getUserProfileByUsername(username.split('@')[1]);

      setUserProfile({ ...data });

      await userPosts(data.id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const updatePostReaction = useCallback((post: Post) => {
    setUserPosts((prev) =>
      prev.map((el) => (el.id !== post.id ? el : { ...el, likes: post.likes })),
    );
  }, []);

  useEffect(() => {
    userProfile();
  }, [username]);

  return (
    <div className="user-profile">
      {!!userProfileData ? (
        <>
          <Header user={userProfileData} />
          <Bio user={userProfileData} />

          <JPanels.JPanels selected={tab} className="pt-6">
            <JPanels.JTabs
              tabs={[
                { label: 'posts', icon: 'ion:grid-outline' },
                { label: 'uploads', icon: 'ion:images-outline' },
                { label: 'interests', icon: 'ion:megaphone-outline' },
              ]}
              onClick={(val) => setTab(val)}
              noLabel={screenWidth < 768 ? true : false}
            />

            <JPanels.JPanel>
              <div id="posts">
                <div className="mt-3 flex flex-col space-y-3">
                  {isLoading ? (
                    <div className="flex flex-col w-full space-y-3">
                      {Array.from(Array(4)).map((_, i) => (
                        <PostSkeletonLoader key={i} />
                      ))}
                    </div>
                  ) : !!userPostsData.length ? (
                    userPostsData?.map((post) => (
                      <MemoizedPostCard
                        key={post.id}
                        post={post}
                        updatePostReaction={updatePostReaction}
                      />
                    ))
                  ) : (
                    <div className="flex justify-center">no published post found!</div>
                  )}
                </div>
              </div>
              <div id="uploads">Uploads</div>
              <div id="interests">Interests</div>
            </JPanels.JPanel>
          </JPanels.JPanels>
        </>
      ) : (
        <div className="flex items-center justify-center pt-5">
          <JSpinner size="50px" />
        </div>
      )}
    </div>
  );
};

export default Index;
