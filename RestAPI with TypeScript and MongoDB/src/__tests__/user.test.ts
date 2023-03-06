import mongoose, { isValidObjectId } from 'mongoose';
import supertest from 'supertest';
import createServer from '../utils/createServer';
import { MongoMemoryServer } from 'mongodb-memory-server';
import registerHelper from '../utils/testHelpers';
import { updateUserPassword } from '../controllers/user.controller';

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
      const { status: registerStatus, body: registerBody } = await supertest(app).post('/users').send(registerHelper(2).registerInput);
      expect(registerStatus).toBe(201);
      const { status, body } = await supertest(app).get(`/users/${registerBody.data._id}`);
      expect(status).toBe(200);
      expect(body).toHaveProperty('data');
    });
  });
  describe('Update User', () => {
    test('User not found 422', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const { status, body } = await supertest(app).patch(`/users/${userId}`);
      expect(status).toBe(404);
      expect(body).toEqual({ message: `User with id '${userId}' not found!` });
    });
    test('Fields missing 422', async () => {
      const { status: registerStatus, body: registerBody } = await supertest(app).post('/users').send(registerHelper(3).registerInput);
      expect(registerStatus).toBe(201);
      const { status, body } = await supertest(app).patch(`/users/${registerBody.data._id}`).send({ fullName: 'randomName' });
      expect(status).toBe(422);
      expect(body).toEqual({ message: 'The fields fullName and role are required!' });
    });
    test('Successful 200', async () => {
      const roleId = new mongoose.Types.ObjectId().toString();
      // register user
      const { status: registerStatus, body: registerBody } = await supertest(app).post('/users').send(registerHelper(4).registerInput);
      expect(registerStatus).toBe(201);
      // update fields
      const { status, body } = await supertest(app)
        .patch(`/users/${registerBody.data._id}`)
        .send({ fullName: 'randomName', enabled: true, role: roleId });
      expect(status).toBe(200);
      expect(body.data.fullName).toEqual('randomName');
      expect(body.data.enabled).toEqual('true');
      expect(mongoose.isValidObjectId(body.data.role)).toBeTruthy();
    });
  });
  describe('Update user password', () => {
    test('User not found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const { status, body } = await supertest(app).patch(`/users/password/${userId}`);
      expect(status).toBe(404);
      expect(body).toEqual({ message: `User with id '${userId}' not found!` });
    });
    test('Fields missing 422', async () => {
      const { status: registerStatus, body: registerBody } = await supertest(app).post('/users').send(registerHelper(5).registerInput);
      expect(registerStatus).toBe(201);
      const { status, body } = await supertest(app).patch(`/users/password/${registerBody.data._id}`).send({ oldPassword: 'randomPassword' });
      expect(status).toBe(422);
      expect(body).toEqual({ message: 'The fields oldPassword and newPassword are required!' });
    });
    test('Password invalid 401', async () => {
      const { status: registerStatus, body: registerBody } = await supertest(app).post('/users').send(registerHelper(6).registerInput);
      expect(registerStatus).toBe(201);
      const { status, body } = await supertest(app)
        .patch(`/users/password/${registerBody.data._id}`)
        .send({ oldPassword: 'randomPassword', newPassword: 'anotherRandomPassword' });
      expect(status).toBe(401);
      expect(body).toEqual({ message: 'Invalid credentials!' });
    });
    test('Successful 200', async () => {
      const { status: registerStatus, body: registerBody } = await supertest(app).post('/users').send(registerHelper(7).registerInput);
      expect(registerStatus).toBe(201);

      const { status, body } = await supertest(app)
        .patch(`/users/password/${registerBody.data._id}`)
        .send({ oldPassword: registerHelper(7).registerInput.password, newPassword: 'newSecret' });
      expect(status).toBe(200);
      expect(body).toEqual(registerHelper(7).registerResult);
      expect(mongoose.isValidObjectId(body.data._id)).toBeTruthy();
    });
  });
  describe('Delete user', () => {
    test('Fields missing 422', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      console.log(userId);
      const { status, body } = await supertest(app).delete(`/users/${userId}`);
      expect(status).toBe(404);
      expect(body).toEqual({ message: `User with id '${userId}' not found!` });
    });
    test('Successful 200', async () => {
      const { status: registerStatus, body: registerBody } = await supertest(app).post('/users').send(registerHelper(8).registerInput);
      expect(registerStatus).toBe(201);
      const { status, body } = await supertest(app).delete(`/users/${registerBody.data._id}`);
      expect(status).toBe(200);
      expect(body).toEqual({ message: 'User deleted successfully!' });
    });
  });
});

// describe('health check', () => {
//   test('Math test', () => {
//     expect(2 + 2).toBe(4);
//   });
// });
