import { postModel } from 'src/entities/post';
import { User, userModel } from 'src/entities/user';
import { cursorPaginateResponse, formatResponse, getObjectId } from 'src/utils/helpers';

export async function getUserProfile(username: string) {
  try {
    const userFromDb = await userModel
      .findOne({ username })
      .select('-followers -followings -liked_posts -commented_posts -liked_comments -password');

    const postCount = await postModel.find({ user: getObjectId(userFromDb?._id) }).count();

    return formatResponse({ ...userFromDb?.toJSON(), total_posts: postCount });
  } catch (error) {
    Promise.reject(error);
  }
}

export async function getUserPosts(id: string, cursor: number, limit: number) {
  try {
    const query = postModel.find({ user: getObjectId(id), is_archived: false });
    return cursorPaginateResponse(
      query
        .populate({
          path: 'user',
          model: User,
          select: ['username', 'id', 'name', 'image'],
        })
        .sort({ createdAt: -1 }),
      cursor,
      limit,
      await query.count(),
    );
  } catch (error) {
    Promise.reject(error);
  }
}
