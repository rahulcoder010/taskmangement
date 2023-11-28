const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

describe('User API endpoints', () => {
  it('should get all users', (done) => {
    chai
      .request(app)
      .get('/users')
      .end((err, res) => {
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body.success).to.equal(true);
        chai.expect(res.body.data).to.be.an('array');
        done();
      });
  });

  it('should register a new user', (done) => {
    chai
      .request(app)
      .post('/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      })
      .end((err, res) => {
        chai.expect(res.status).to.equal(201);
        chai.expect(res.body.success).to.equal(true);
        chai.expect(res.body.data).to.be.an('object');
        chai.expect(res.body.data.name).to.equal('John Doe');
        chai.expect(res.body.data.email).to.equal('johndoe@example.com');
        done();
      });
  });

  it('should login a user', (done) => {
    chai
      .request(app)
      .post('/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password',
      })
      .end((err, res) => {
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body.success).to.equal(true);
        chai.expect(res.body.token).to.be.a('string');
        chai.expect(res.body.user).to.be.an('object');
        chai.expect(res.body.user.name).to.equal('John Doe');
        chai.expect(res.body.user.email).to.equal('johndoe@example.com');
        done();
      });
  });

  it('should update a user', (done) => {
    chai
      .request(app)
      .put('/users/1')
      .send({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
      })
      .end((err, res) => {
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body.success).to.equal(true);
        chai.expect(res.body.data).to.be.an('object');
        chai.expect(res.body.data.name).to.equal('Jane Doe');
        chai.expect(res.body.data.email).to.equal('janedoe@example.com');
        done();
      });
  });

  it('should update a user\'s password', (done) => {
    chai
      .request(app)
      .put('/users/1/password')
      .send({
        currentPassword: 'password',
        newPassword: 'newpassword',
      })
      .end((err, res) => {
        chai.expect(res.status).to.equal(201);
        chai.expect(res.body.success).to.equal(true);
        chai.expect(res.body.newPassword).to.equal('newpassword');
        done();
      });
  });

  it('should logout a user', (done) => {
    chai
      .request(app)
      .post('/logout')
      .end((err, res) => {
        chai.expect(res.status).to.equal(201);
        chai.expect(res.body.success).to.equal(true);
        done();
      });
  });
});