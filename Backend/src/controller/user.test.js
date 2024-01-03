// Tests for user.js using chai and mocha

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');

chai.use(chaiHttp);

describe('User', () => {
  describe('GET /users', () => {
    it('should return all users', (done) => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.count).to.be.equal(res.body.data.length);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /users', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an('object');
          expect(res.body.message).to.be.equal('User created successfully');
          done();
        });
    });

    it('should return an error if user already exists', (done) => {
      chai.request(app)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.equal('User John Doe already registered!');
          done();
        });
    });

    it('should return an error if validation fails', (done) => {
      chai.request(app)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@example',
          password: 'pass'
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.a('string');
          expect(res.body.message).to.be.equal('Failed to create user');
          done();
        });
    });
  });

  describe('POST /users/login', () => {
    it('should return a token and user data on successful login', (done) => {
      chai.request(app)
        .post('/users/login')
        .send({
          email: 'johndoe@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.token).to.be.a('string');
          expect(res.body.user).to.be.an('object');
          expect(res.body.message).to.be.equal('Login successful');
          done();
        });
    });

    it('should return an error if email and/or password are missing', (done) => {
      chai.request(app)
        .post('/users/login')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.equal('Please provide an email and password');
          expect(res.body.message).to.be.equal('Authentication failed');
          done();
        });
    });

    it('should return an error if user is not found', (done) => {
      chai.request(app)
        .post('/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.equal('Invalid credential');
          expect(res.body.message).to.be.equal('Authentication failed');
          done();
        });
    });

    it('should return an error if password is incorrect', (done) => {
      chai.request(app)
        .post('/users/login')
        .send({
          email: 'johndoe@example.com',
          password: 'incorrectpassword'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.equal('Incorrect Password');
          expect(res.body.message).to.be.equal('Authentication failed');
          done();
        });
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', (done) => {
      chai.request(app)
        .put('/users/1')
        .send({
          name: 'John Updated',
          email: 'updated@example.com'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an('object');
          expect(res.body.message).to.be.equal('User updated successfully');
          done();
        });
    });

    it('should return an error if user is not found', (done) => {
      chai.request(app)
        .put('/users/100')
        .send({
          name: 'John Updated',
          email: 'updated@example.com'
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.a('string');
          expect(res.body.message).to.be.equal('Failed to update user');
          done();
        });
    });
  });

  describe('PUT /users/:id/password', () => {
    it('should update a user password', (done) => {
      chai.request(app)
        .put('/users/1/password')
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.success).to.be.true;
          expect(res.body.newPassword).to.be.a('string');
          expect(res.body.message).to.be.equal('Password updated successfully');
          done();
        });
    });

    it('should return an error if user is not found', (done) => {
      chai.request(app)
        .put('/users/100/password')
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.equal('Invalid credential');
          expect(res.body.message).to.be.equal('Failed to update password');
          done();
        });
    });

    it('should return an error if current password is incorrect', (done) => {
      chai.request(app)
        .put('/users/1/password')
        .send({
          currentPassword: 'incorrectpassword',
          newPassword: 'newpassword123'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.equal('CurrentPassword is incorrect');
          expect(res.body.message).to.be.equal('Failed to update password');
          done();
        });
    });
  });

  describe('POST /users/logout', () => {
    it('should logout a user', (done) => {
      chai.request(app)
        .post('/users/logout')
        .send({
          token: 'mockedtoken123'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.be.equal('logout User John Updated successfully!');
          done();
        });
    });

    it('should return an error if user is not found', (done) => {
      chai.request(app)
        .post('/users/logout')
        .send({
          token: 'invalidtoken'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.equal('please login again!');
          expect(res.body.message).to.be.equal('Logout failed');
          done();
        });
    });
  });
});
