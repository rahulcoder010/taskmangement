Create or update this file "Backend/user.test.js" as needed based on the provided instructions.
The instructions are as follows: Write Test cases for task and user in separate file from Backend/test.test.js. and write task test cases in Backend/task.test.js and user test cases in Backend/user.test.js


	const request = require('supertest');
	const app = require('../app');

	describe('POST /user', () => {
	  test('It should create a new user', async () => {
	    const response = await request(app)
	      .post('/user')
	      .send({
	        name: 'John Doe',
	        email: 'johndoe@example.com',
	        password: 'password123'
	      });
	    expect(response.statusCode).toBe(201);
	    expect(response.body).toHaveProperty('id');
	    expect(response.body).toHaveProperty('name', 'John Doe');
	    expect(response.body).toHaveProperty('email', 'johndoe@example.com');
	  });
	});

	describe('GET /user', () => {
	  test('It should get all users', async () => {
	    const response = await request(app).get('/user');
	    expect(response.statusCode).toBe(200);
	    expect(response.body).toHaveLength(3);
	  });
	});

	describe('GET /user/:id', () => {
	  test('It should get a single user', async () => {
	    const response = await request(app).get('/user/1');
	    expect(response.statusCode).toBe(200);
	    expect(response.body).toHaveProperty('id', 1);
	    expect(response.body).toHaveProperty('name', 'John Doe');
	    expect(response.body).toHaveProperty('email', 'johndoe@example.com');
	  });

	  test('It should return error if user does not exist', async () => {
	    const response = await request(app).get('/user/100');
	    expect(response.statusCode).toBe(404);
	    expect(response.body).toHaveProperty('message', 'User not found');
	  });
	});

	describe('PUT /user/:id', () => {
	  test('It should update a user', async () => {
	    const response = await request(app)
	      .put('/user/1')
	      .send({
	        name: 'Jane Doe',
	        email: 'janedoe@example.com',
	        password: 'newpassword123'
	      });
	    expect(response.statusCode).toBe(200);
	    expect(response.body).toHaveProperty('id', 1);
	    expect(response.body).toHaveProperty('name', 'Jane Doe');
	    expect(response.body).toHaveProperty('email', 'janedoe@example.com');
	  });

	  test('It should return error if user does not exist', async () => {
	    const response = await request(app)
	      .put('/user/100')
	      .send({
	        name: 'Jane Doe',
	        email: 'janedoe@example.com',
	        password: 'newpassword123'
	      });
	    expect(response.statusCode).toBe(404);
	    expect(response.body).toHaveProperty('message', 'User not found');
	  });
	});

	describe('DELETE /user/:id', () => {
	  test('It should delete a user', async () => {
	    const response = await request(app).delete('/user/1');
	    expect(response.statusCode).toBe(200);
	    expect(response.body).toHaveProperty('message', 'User deleted');
	  });

	  test('It should return error if user does not exist', async () => {
	    const response = await request(app).delete('/user/100');
	    expect(response.statusCode).toBe(404);
	    expect(response.body).toHaveProperty('message', 'User not found');
	  });
	});