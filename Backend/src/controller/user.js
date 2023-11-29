const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../app');
const db = require('../models');
const Users = db.User;

chai.use(chaiHttp);
const expect = chai.expect;

describe('User API', () => {
  before(async () => {
    await Users.destroy({ truncate: true });
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const res = await chai
        .request(app)
        .post('/register')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123',
        });

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.true;
      expect(res.body).to.have.property('data').to.be.an('object');
      expect(res.body.data).to.have.property('name', 'John Doe');
      expect(res.body.data).to.have.property('email', 'johndoe@example.com');
      expect(res.body).to.have.property('message', 'User created successfully');
    });

    it('should return an error if the email is already registered', async () => {
      const res = await chai
        .request(app)
        .post('/register')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('User John Doe already registered!');
    });

    it('should return an error if required fields are missing', async () => {
      const res = await chai
        .request(app)
        .post('/register')
        .send({
          name: 'John Doe',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('child "email" fails because ["email" is required]');
    });

    it('should return an error if the email format is invalid', async () => {
      const res = await chai
        .request(app)
        .post('/register')
        .send({
          name: 'John Doe',
          email: 'johndoe',
          password: 'password123',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('child "email" fails because ["email" must be a valid email]');
    });

    it('should return an error if the password is less than 6 characters', async () => {
      const res = await chai
        .request(app)
        .post('/register')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'pass',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('child "password" fails because ["password" length must be at least 6 characters long]');
    });
  });

  describe('POST /login', () => {
    before(async () => {
      await Users.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      });
    });

    it('should login a user with valid credentials', async () => {
      const res = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'johndoe@example.com',
          password: 'password123',
        });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.true;
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('user').to.be.an('object');
      expect(res.body.user).to.have.property('name', 'John Doe');
      expect(res.body.user).to.have.property('email', 'johndoe@example.com');
      expect(res.body).to.have.property('message', 'Login successful');
    });

    it('should return an error if email is missing', async () => {
      const res = await chai
        .request(app)
        .post('/login')
        .send({
          password: 'password123',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('Please provide an email and password');
    });

    it('should return an error if password is missing', async () => {
      const res = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'johndoe@example.com',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('Please provide an email and password');
    });

    it('should return an error if email is invalid', async () => {
      const res = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'johndoe',
          password: 'password123',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('Invalid credential');
    });

    it('should return an error if password is incorrect', async () => {
      const res = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'johndoe@example.com',
          password: 'password1234',
        });

      expect(res).to.have.status(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('Incorrect Password');
    });
  });

  describe('PUT /update-user', () => {
    let authToken = '';

    before(async () => {
      await Users.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      });

      const res = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'johndoe@example.com',
          password: 'password123',
        });

      authToken = res.body.token;
    });

    it('should update the user information', async () => {
      const res = await chai
        .request(app)
        .put('/update-user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Jane Doe',
          email: 'janedoe@example.com',
        });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.true;
      expect(res.body).to.have.property('data').to.be.an('object');
      expect(res.body.data).to.have.property('name', 'Jane Doe');
      expect(res.body.data).to.have.property('email', 'janedoe@example.com');
      expect(res.body).to.have.property('message', 'User updated successfully');
    });

    it('should return an error if user does not exist', async () => {
      const res = await chai
        .request(app)
        .put('/update-user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Jane Doe',
          email: 'janedoe@example.com',
        });

      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('User not found');
    });
  });

  describe('PUT /update-password', () => {
    let authToken = '';

    before(async () => {
      await Users.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      });

      const res = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'johndoe@example.com',
          password: 'password123',
        });

      authToken = res.body.token;
    });

    it('should update the user password', async () => {
      const res = await chai
        .request(app)
        .put('/update-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        });

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.true;
      expect(res.body).to.have.property('newPassword', 'newpassword456');
      expect(res.body).to.have.property('message', 'Password updated successfully');
    });

    it('should return an error if user does not exist', async () => {
      const res = await chai
        .request(app)
        .put('/update-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        });

      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('User not found');
    });

    it('should return an error if current password is incorrect', async () => {
      const res = await chai
        .request(app)
        .put('/update-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'password1234',
          newPassword: 'newpassword456',
        });

      expect(res).to.have.status(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('CurrentPassword is incorrect');
    });
  });

  describe('POST /logout', () => {
    let authToken = '';

    before(async () => {
      await Users.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      });

      const res = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'johndoe@example.com',
          password: 'password123',
        });

      authToken = res.body.token;
    });

    it('should logout the user', async () => {
      const res = await chai
        .request(app)
        .post('/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.true;
      expect(res.body).to.have.property('message', 'Logout successful');
    });

    it('should return an error if user not found', async () => {
      const res = await chai
        .request(app)
        .post('/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('success').to.be.false;
      expect(res.body).to.have.property('Error').to.equal('User not found');
    });
  });
});