import { Post, TagEnum } from 'src/models/post.model';
import { User } from 'src/models/user.model';

export const retrieveDate = async () => {
  const allUsers = await User.find();
  console.log(allUsers);

  const userById = await User.findById(allUsers[0]._id);
  console.log(userById);

  const userByEmail = await User.findOne({ email: allUsers[0].email });
  console.log(userByEmail);

  const users = await User.find({ 'location.country': 'FRA' }).sort('+createdAt');
  console.log(users);

  const allUserPosts = await Post.find({ author: users[0]._id }).populate('author').exec();
  console.log(allUserPosts);

  const allUserPostsWithPartialAuthor = await Post.find({ author: users[0]._id }).populate('author', 'name').exec();
  console.log(allUserPostsWithPartialAuthor);

  const ascPosts = await Post.find({ isPublished: true, viewCount: { $gt: 20 } }).sort('-createdAt');
  console.log(ascPosts);

  const where = `this.tags.includes("${TagEnum.Node}") && this.tags.includes("${TagEnum.Docker}")`;
  const postsWithTags = await Post.find({ $where: where, viewCount: { $gte: 20, $lte: 30 } });
  console.log(postsWithTags);
};
