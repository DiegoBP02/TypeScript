import { User, UserDocument } from 'src/models/user.model';
import { Post, TagEnum } from 'src/models/post.model';

export const updateData = async () => {
  const allUsers = await User.find();

  const user: UserDocument | undefined | null = await User.findById(allUsers[0]._id);

  if (user) {
    user.location = {
      country: 'US',
      city: 'San Francisco',
    };
    const updatedUser = await user.save();

    console.log(updatedUser);
  }

  const userPost = await Post.findOne({ author: user?.id });
  if (!userPost) {
    throw new Error('No user found');
  }

  const updatedPost = await Post.findOneAndUpdate(
    { _id: userPost._id },
    { isPublished: true, tags: [TagEnum.GraphQL, TagEnum.AWS, TagEnum.Jest] },
    { new: true },
  );

  console.log(updatedPost);
};
