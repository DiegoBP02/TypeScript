import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const connectToDatabase = async (): Promise<void> => {
  await mongoose.connect(`mongodb://blogUserTest:blogUserPwdTest@127.0.0.1:27017/blog`);
};

export { connectToDatabase };
