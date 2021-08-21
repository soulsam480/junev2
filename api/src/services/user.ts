import { postModel } from 'src/entities/post';
import { User, userModel } from 'src/entities/user';
import { formatResponse, getObjectId } from 'src/utils/helpers';

export async function getUserProfile(username: string) {
  try {
    const userFromDb = await userModel
      .findOne({ username })
      .select('-followers -followings -liked_posts -commented_posts -liked_comments -password');

    const postCount = await postModel.find({ user: { username } as User }).estimatedDocumentCount();

    return formatResponse({ ...userFromDb?.toJSON(), total_posts: postCount });
  } catch (error) {
    Promise.reject(error);
  }
}

export async function getUserPosts(id: string) {
  try {
    const userPosts = await postModel.find({ user: getObjectId(id) });

    return formatResponse(userPosts);
  } catch (error) {
    Promise.reject(error);
  }
}
