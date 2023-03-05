import * as userController from '../controllers/user.controller';
import mongoose, { isValidObjectId } from 'mongoose';
import supertest from 'supertest';
import createServer from '../utils/createServer';
import { MongoMemoryServer } from 'mongodb-memory-server';
import registerHelper from '../utils/testHelpers';

const app = createServer();

describe('User', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Register', () => {
    test('Fields missing 422', async () => {
      const { status, body } = await supertest(app).post('/users').send({ fullName: 'randomName' });
      expect(status).toBe(422);
      expect(body).toEqual({ message: 'The fields email, fullName, password and role are required!' });
    });
    test('Successful 201', async () => {
      const { status, body } = await supertest(app).post('/users').send(registerHelper(1).registerInput);
      expect(status).toBe(201);
      expect(body).toEqual(registerHelper(1).registerResult);
      expect(mongoose.isValidObjectId(body.data._id)).toBeTruthy();
    });
  });
  describe('Get All Users', () => {
    test('Get all users 200', async () => {
      const { status, body } = await supertest(app).get('/users');
      expect(status).toBe(200);
      expect(body).toHaveProperty('data');
    });
  });
  describe('Get User', () => {
    test('No user found 422', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const { status, body } = await supertest(app).get(`/users/${userId}`);
      expect(status).toBe(404);
      expect(body).toEqual({ message: `User with id '${userId}' not found!` });
    });
    test('User found 200', async () => {
      const { status, body } = await supertest(app).post('/users').send(registerHelper(2).registerInput);
      expect(status).toBe(201);
      expect(body).toEqual(registerHelper(2).registerResult);
    });
  });
});

// describe('health check', () => {
//   test('Math test', () => {
//     expect(2 + 2).toBe(4);
//   });
// });
