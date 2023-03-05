import mongoose from 'mongoose';

const registerHelper = (n: number) => {
  const roleId = new mongoose.Types.ObjectId().toString();
  const registerInput = {
    fullName: 'test',
    email: `test${n}@email.com`,
    password: 'secret',
    enabled: true,
    role: roleId,
  };

  const registerResult = {
    data: {
      _id: expect.any(String),
      email: `test${n}@email.com`,
      enabled: 'true',
      fullName: 'test',
      password: expect.any(String),
      role: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      __v: 0,
    },
  };

  return { registerInput, registerResult };
};

export default registerHelper;
