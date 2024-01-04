const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');

chai.use(chaiHttp);

describe('User API', () => {
  describe('GET /users', () => {
    it('should return all users', (done) => {
      chai
        .request(app)
        .get('/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').to.equal(true);
          expect(res.body).to.have.property('count');
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });

  describe('POST /register', () => {
    it('should register a new user', (done) => {
      const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('success').to.equal(true);
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('message').to.equal('User created successfully');
          done();
        });
    });

    it('should return an error if user already exists', (done) => {
      const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('success').to.equal(false);
          expect(res.body).to.have.property('Error').to.equal('User John Doe already registered!');
          done();
        });
    });
  });

  describe('POST /login', () => {
    it('should log in a user with valid credentials', (done) => {
      const user = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').to.equal(true);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          expect(res.body).to.have.property('message').to.equal('Login successful');
          done();
        });
    });

    it('should return an error if email and password are not provided', (done) => {
      const user = {};

      chai
        .request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('success').to.equal(false);
          expect(res.body).to.have.property('Error').to.equal('Please provide an email and password');
          expect(res.body).to.have.property('message').to.equal('Authentication failed');
          done();
        });
    });

    it('should return an error if invalid credentials are provided', (done) => {
      const user = {
        email: 'invalid@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('success').to.equal(false);
          expect(res.body).to.have.property('Error').to.equal('Invalid credential');
          expect(res.body).to.have.property('message').to.equal('Authentication failed');
          done();
        });
    });

    it('should return an error if incorrect password is provided', (done) => {
      const user = {
        email: 'johndoe@example.com',
        password: 'incorrectpassword',
      };

      chai
        .request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('success').to.equal(false);
          expect(res.body).to.have.property('Error').to.equal('Incorrect Password');
          expect(res.body).to.have.property('message').to.equal('Authentication failed');
          done();
        });
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', (done) => {
      const user = {
        name: 'New Name',
        email: 'newemail@example.com',
      };

      chai
        .request(app)
        .put('/users/1')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').to.equal(true);
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('message').to.equal('User updated successfully');
          done();
        });
    });
  });

  describe('PUT /users/password', () => {
    it('should update a user\'s password', (done) => {
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newpassword123',
      };

      chai
        .request(app)
        .put('/users/password')
        .send(passwordData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('success').to.equal(true);
          expect(res.body).to.have.property('newPassword');
          expect(res.body).to.have.property('message').to.equal('Password updated successfully');
          done();
        });
    });

    it('should return an error if user is not found', (done) => {
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newpassword123',
      };

      chai
        .request(app)
        .put('/users/password')
        .send(passwordData)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('success').to.equal(false);
          expect(res.body).to.have.property('Error').to.equal('Invalid credential');
          expect(res.body).to.have.property('message').to.equal('Failed to update password');
          done();
        });
    });

    it('should return an error if current password is incorrect', (done) => {
      const passwordData = {
        currentPassword: 'incorrectpassword',
        newPassword: 'newpassword123',
      };

      chai
        .request(app)
        .put('/users/password')
        .send(passwordData)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('success').to.equal(false);
          expect(res.body).to.have.property('Error').to.equal('CurrentPassword is incorrect');
          expect(res.body).to.have.property('message').to.equal('Failed to update password');
          done();
        });
    });
  });

  describe('POST /logout', () => {
    it('should log out a user', (done) => {
      const user = {
        token: 'jwtTokenValue',
      };

      chai
        .request(app)
        .post('/logout')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('success').to.equal(true);
          expect(res.body).to.have.property('message').to.equal('Logout successful');
          done();
        });
    });

    it('should return an error if user is not found', (done) => {
      const user = {
        token: 'jwtTokenValue',
      };

      chai
        .request(app)
        .post('/logout')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('success').to.equal(false);
          expect(res.body).to.have.property('Error').to.equal('please login again!');
          expect(res.body).to.have.property('message').to.equal('Logout failed');
          done();
        });
    });
  });
});