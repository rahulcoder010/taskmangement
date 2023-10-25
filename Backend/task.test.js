const request = require('supertest');
const app = require('../app');

// Placeholder test case for user
it('should return 200 status code', async () => {
  const response = await request(app).get('/user');
  expect(response.statusCode).toBe(200);
});

// Placeholder test case for tasks
it('should return 200 status code', async () => {
  const response = await request(app).get('/tasks');
  expect(response.statusCode).toBe(200);
});