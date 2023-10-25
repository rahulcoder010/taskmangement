'use strict';

const request = require('supertest');
const app = require('../app');

describe('User routes', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
  });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBeInstanceOf(Array);
  });
});

describe('Task routes', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        description: 'Finish homework',
        completed: false
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
  });

  it('should get all tasks', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBeInstanceOf(Array);
  });
});