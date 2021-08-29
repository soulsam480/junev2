import React from 'react';
import JMenu from 'src/Lib/JMenu';
import JMenuItem from 'src/Lib/JMenuItem';
import { useAlert } from 'src/Lib/store/alerts';
import { archivePost } from 'src/Shared/services/post';
import { useLoader } from 'src/Shared/store/loader';
import { useUserStore } from 'src/User/store/useUserStore';
import { Post } from 'src/utils/types';

interface Props {
  post: Post;
}

const PostContext: React.FC<Props> = ({ post }) => {
  const userId = useUserStore((state) => state.user.id);
  const setAlert = useAlert((state) => state.setAlert);

  const setLoader = useLoader((state) => state.setLoader);

  const show = () => setLoader(true);
  const hide = () => setLoader(false);

  async function archive() {
    show();
    try {
      await archivePost(post.id, true);
      setAlert({ type: 'success', message: 'Post archived' });
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to archive post' });
    } finally {
      hide();
    }
  }

  return (
    <div className="absolute z-1000">
      <JMenu size="20px" sm noBg icon="ion:ellipsis-horizontal-outline" listAlign="right">
        {({ closeMenu: cMenu }) => (
          <>
            <JMenuItem closeMenuCallback={cMenu}>
              <span className="flex-grow">view</span>
            </JMenuItem>

            {userId === post?.user.id ? (
              <>
                <JMenuItem closeMenuCallback={cMenu} onClick={archive}>
                  <span className="flex-grow">archive</span>
                </JMenuItem>
              </>
            ) : (
              <>
                <JMenuItem closeMenuCallback={cMenu}>
                  <span className="flex-grow">report</span>
                </JMenuItem>

                <JMenuItem closeMenuCallback={cMenu}>
                  <span className="flex-grow">follow</span>
                </JMenuItem>
              </>
            )}
          </>
        )}
      </JMenu>
    </div>
  );
};

export default PostContext;
