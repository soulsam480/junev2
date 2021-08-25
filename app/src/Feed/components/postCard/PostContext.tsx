import React from 'react';
import JMenu from 'src/Lib/JMenu';
import JMenuItem from 'src/Lib/JMenuItem';
import { useUserStore } from 'src/User/store/useUserStore';
import { Post } from 'src/utils/types';

interface Props {
  post: Post;
}

const PostContext: React.FC<Props> = ({ post }) => {
  const userId = useUserStore((state) => state.user.id);

  return (
    <JMenu size="25px" noBg dense icon="ion:ellipsis-horizontal-outline" listAlign="right">
      {({ closeMenu: cMenu }) => (
        <>
          <JMenuItem closeMenuCallback={cMenu}>
            <span className="flex-grow">view</span>
          </JMenuItem>

          {userId === post?.user.id ? (
            <>
              <JMenuItem closeMenuCallback={cMenu}>
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
  );
};

export default PostContext;
