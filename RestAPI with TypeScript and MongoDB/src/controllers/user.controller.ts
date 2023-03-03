import { Request, Response } from 'express';
import { User, UserInput, NewPasswordInput } from '../models/user.model';
import bcrypt from 'bcrypt';

const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(password, salt);
};

const comparePassword = (newPassword: string, oldPassword: string) => {
  const isMatch = bcrypt.compareSync(newPassword, oldPassword);
  return isMatch;
};

const createUser = async (req: Request, res: Response) => {
  const { email, enabled, fullName, password, role } = req.body;

  if (!email || !fullName || !password || !role) {
    return res.status(422).json({ message: 'The fields email, fullName, password and role are required!' });
  }

  const userInput: UserInput = {
    fullName,
    email,
    password: hashPassword(password),
    enabled,
    role,
  };

  const userCreated = await User.create(userInput);

  return res.status(201).json({ data: userCreated });
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().populate('role').sort('-createdAt').exec();

  return res.status(200).json({ data: users });
};
const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).populate('role').exec();

  if (!user) {
    return res.status(404).json({ message: `User with id '${id}' not found!` });
  }

  return res.status(200).json({ data: user });
};
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { enabled, fullName, role } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ message: `User with id '${id}' not found!` });
  }

  if (!fullName || !role) {
    return res.status(422).json({ message: 'The fields fullName and role are required!' });
  }

  await User.updateOne({ _id: id }, { enabled, fullName, role });

  const userUpdated = await User.findById(id);

  return res.status(200).json({ data: userUpdated });
};

const updateUserPassword = async (req: Request, res: Response) => {
  const { userId, oldPassword, newPassword } = req.body;
  if (!userId || !oldPassword || !newPassword) {
    res.status(422).json({ message: 'The fields userId, oldPassword and newPassword are required!' });
  }

  const newPasswordInput: NewPasswordInput = {
    newPassword,
    oldPassword,
    userId,
  };

  const user = await User.findById(newPasswordInput.userId);
  if (!user) {
    return res.status(404).json({ message: `User with id '${newPasswordInput.userId}' not found!` });
  }

  const isPasswordValid = comparePassword(newPasswordInput.newPassword, user.password);
  if (isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials!' });
  }
  const newPasswordHashed = hashPassword(newPasswordInput.newPassword);
  const updatedUser = await User.findByIdAndUpdate(
    { _id: newPasswordInput.userId },
    { password: newPasswordHashed },
    { new: true, runValidators: true },
  );

  return res.status(200).json({ data: updatedUser });
};
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  return res.status(200).json({ message: 'User deleted successfully!' });
};

export { createUser, deleteUser, getAllUsers, getUser, updateUser, updateUserPassword };
