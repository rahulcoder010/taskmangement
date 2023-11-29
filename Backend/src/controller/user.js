const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assuming that the app.js file is in the same directory as this user.js file

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Controller', () => {
  describe('GET /users', () => {
    it('should return all users', async () => {
      const res = await chai.request(app).get('/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.true;
      expect(res.body.count).to.be.a('number');
      expect(res.body.data).to.be.an('array');
    });
  });

  describe('POST /users/register', () => {
    it('should register a new user', async () => {
      const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      const res = await chai.request(app).post('/users/register').send(user);
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('User created successfully');
    });

    it('should return an error if user email already exists', async () => {
      const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      const res = await chai.request(app).post('/users/register').send(user);
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.false;
      expect(res.body.Error).to.exist;
    });
  });

  describe('POST /users/login', () => {
    it('should log in a user with correct credentials', async () => {
      const user = {
        email: 'johndoe@example.com',
        password: '123456'
      };

      const res = await chai.request(app).post('/users/login').send(user);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.true;
      expect(res.body.token).to.exist;
      expect(res.body.user).to.exist;
      expect(res.body.message).to.equal('Login successful');
    });

    it('should return an error if email or password is missing', async () => {
      const user = {
        email: 'johndoe@example.com'
      };

      const res = await chai.request(app).post('/users/login').send(user);
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.false;
      expect(res.body.Error).to.exist;
    });

    it('should return an error if credentials are invalid', async () => {
      const user = {
        email: 'johndoe@example.com',
        password: '123'
      };

      const res = await chai.request(app).post('/users/login').send(user);
      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.false;
      expect(res.body.Error).to.exist;
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'johndoe@example.com'
      };

      const res = await chai.request(app).put('/users/1').send(user);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('User updated successfully');
    });
  });

  describe('PUT /users/password/:id', () => {
    it('should update a user password', async () => {
      const passwordData = {
        currentPassword: '123456',
        newPassword: 'abcdef'
      };

      const res = await chai.request(app).put('/users/password/1').send(passwordData);
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.true;
      expect(res.body.newPassword).to.exist;
      expect(res.body.message).to.equal('Password updated successfully');
    });

    it('should return an error if current password is incorrect', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'abcdef'
      };

      const res = await chai.request(app).put('/users/password/1').send(passwordData);
      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.false;
      expect(res.body.Error).to.exist;
    });
  });

  describe('POST /users/logout', () => {
    it('should log out a user', async () => {
      const res = await chai.request(app).post('/users/logout');
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal('Logout successful');
    });

    it('should return an error if user token is invalid', async () => {
      const res = await chai.request(app).post('/users/logout');
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.false;
      expect(res.body.Error).to.exist;
    });
  });
});