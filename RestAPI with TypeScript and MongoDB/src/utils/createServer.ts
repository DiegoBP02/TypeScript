import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { roleRoute } from '../routes/role.route';
import { userRoute } from '../routes/user.route';

function createServer() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/', roleRoute());
  app.use('/', userRoute());

  //   app.get('/', (req, res) => {
  //     return res.json({ message: 'Hello World!' });
  //   });

  return app;
}

export default createServer;
