import supertest from 'supertest';
import app from '../src/app';
import HttpStatus from 'http-status-codes';
import { Response } from 'superagent';
import { UserModel } from '../src/models/user';

const request = supertest(app);

describe('User', () => {
  let signupResponse: Response;
  let token: string;

  afterAll(async () => {
    await UserModel.deleteMany();
  });
  // Signup User
  it('Should not create user when payload is empty', async () => {
    const response = await request
      .post('/v1/signup')
      .send({ email: '', password: '', name: '' });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.data).toStrictEqual({
      email: {
        message: 'email is not allowed to be empty'
      },
      password: {
        message: 'password is not allowed to be empty'
      },
      name: {
        message: 'name is not allowed to be empty'
      }
    });
  });

  it('Should not create partner when email format is invalid', async () => {
    const response = await request.post('/v1/signup').send({
      email: 'koriko@.com',
      password: 'Qwertuiop4@#',
      name: 'round tripping'
    });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.data).toStrictEqual({
      email: {
        message: 'email should be a valid email'
      }
    });
  });

  it('Should not create partner when password format is invalid', async () => {
    const response = await request.post('/v1/signup').send({
      email: 'koriko@ymail.com',
      password: 'Qwertui@#',
      name: 'ding hana'
    });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.data).toStrictEqual({
      password: {
        message: 'password with value Qwertui@# fails to match the digits pattern'
      }
    });
  });

  it('Should create user when payload is valid', async () => {
    signupResponse = await request.post('/v1/signup').send({
      email: 'koriko@ymail.com',
      password: 'Qwertuiy76@#',
      name: 'rasheed dipo'
    });

    expect(signupResponse.status).toBe(HttpStatus.CREATED);
    expect(signupResponse.body.data).toHaveProperty('_id');
    expect(signupResponse.body.data).toHaveProperty('email');
    expect(signupResponse.body.data).toHaveProperty('password');
  });

  it('Should not create partner when email is already existing', async () => {
    const response = await request.post('/v1/signup').send({
      email: 'koriko@ymail.com',
      password: 'Qwertuiy76@#',
      name: 'rasheed dipo'
    });
    expect(response.status).toBe(HttpStatus.CONFLICT);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toStrictEqual('Email already in use');
  });

  // Login User
  it('Should throw an error when email and password are empty', async () => {
    const response = await request.post('/v1/login').send({
      email: '  ',
      password: '   '
    });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.data).toStrictEqual({
      email: {
        message: 'email is not allowed to be empty'
      },
      password: {
        message: 'password is not allowed to be empty'
      }
    });
  });

  it('Should throw an error when email is valid and password does not match', async () => {
    const response = await request.post('/v1/login').send({
      email: 'koriko@ymail.com',
      password: 'Qwertuiy76@='
    });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toStrictEqual('Invalid credentials');
  });

  it('Should login partner when email and password are valid', async () => {
    const response = await request.post('/v1/login').send({
      email: 'koriko@ymail.com',
      password: 'Qwertuiy76@#'
    });
    
    token = response.body.data.token;

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.status).toBe('success');
    expect(response.body.data.existingUser.email).toStrictEqual('koriko@ymail.com');
    expect(response.body.data.token).toBeDefined();
  });
});
