import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser, updateUserPassword } from '../controllers/user.controller';

const userRoute = () => {
  const router = Router();

  router.post('/users', createUser);
  router.get('/users', getAllUsers);
  router.get('/users/:id', getUser);
  router.patch('/users/:id', updateUser);
  router.patch('/users/password/:id', updateUserPassword);
  router.delete('/users/:id', deleteUser);

  return router;
};

export { userRoute };
