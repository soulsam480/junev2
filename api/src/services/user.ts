import { postModel } from 'src/entities/post';
import { User, userModel } from 'src/entities/user';
import { cursorPaginateResponse, formatResponse, getObjectId } from 'src/utils/helpers';
import { UpdateQuery } from 'mongoose';
import { UpdatePasswordDto } from 'src/utils/dtos';

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

    const estimateCount = postModel.find({ user: getObjectId(id), is_archived: false });

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
      await estimateCount.count(),
    );
  } catch (error) {
    Promise.reject(error);
  }
}

export async function updateUser(userId: string, updatedUserData: UpdateQuery<User>) {
  try {
    await userModel
      .updateOne(
        { _id: userId },
        {
          ...updatedUserData,
        },
      )
      .exec();

    const userFromDb = await userModel
      .findOne({ _id: userId })
      .select('-followers -followings -liked_posts -commented_posts -liked_comments -password');

    return formatResponse(userFromDb);
  } catch (error) {
    Promise.reject(error);
  }
}

export async function updatePassword(userId: string, updatedPassword: UpdatePasswordDto) {
  try {
    const userFromDb = await userModel.findById(userId);

    if (!userFromDb) return Promise.reject('User not found');

    if (!userFromDb.password) {
      await userModel
        .updateOne(
          { _id: userId },
          {
            password: await userFromDb.hashPassword(updatedPassword.newPassword),
          },
        )
        .exec();
    } else {
      if (!(await userFromDb.comparePassword(updatedPassword.oldPassword)))
        return Promise.reject('Password in incorrect !');

      await userModel
        .updateOne(
          { _id: userId },
          {
            password: await userFromDb.hashPassword(updatedPassword.newPassword),
          },
        )
        .exec();
    }

    const updatedUser = await userModel
      .findOne({ _id: userId })
      .select('-followers -followings -liked_posts -commented_posts -liked_comments -password');

    return formatResponse(updatedUser);
  } catch (error) {
    Promise.reject(error);
  }
}
