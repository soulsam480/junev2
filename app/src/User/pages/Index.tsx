import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'src/User/styles/userProfile.scss';
import Header from 'src/User/components/profile/Header';
import Bio from 'src/User/components/profile/Bio';
import { getUserPostsById, getUserProfileByUsername } from 'src/User/services/users';
import { UserProfile } from 'src/User/store/useUserStore';
import { PaginationParams } from 'src/utils/types';
import * as JPanels from 'src/Lib/JPanels';
import { useMountedRef, useScreenWidth } from 'src/utils/hooks';
import JSpinner from 'src/Lib/JSpinner';
import PostFeed from 'src/Feed/components/PostFeed';

interface Props {}

const Index: React.FC<Props> = () => {
  const { username } = useParams();
  const { width: screenWidth } = useScreenWidth();
  const { mountedRef } = useMountedRef();

  const [tab, setTab] = useState('posts');

  const [userProfileData, setUserProfile] = useState<UserProfile>();
  const [isLoading, setLoading] = useState(false);

  function userPosts(id: string) {
    return (opts: PaginationParams) => getUserPostsById(id, { ...opts });
  }

  async function userProfile() {
    setLoading(true);
    try {
      const {
        data: { data },
      } = await getUserProfileByUsername(username.split('@')[1]);

      if (!mountedRef.current) return;

      setUserProfile({ ...data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    userProfile();
  }, [username]);

  return (
    <div className="user-profile">
      {!isLoading && !!userProfileData ? (
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
                <PostFeed fetcher={userPosts(userProfileData.id)} />
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
