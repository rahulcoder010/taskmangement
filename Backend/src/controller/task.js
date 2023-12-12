const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');

chai.use(chaiHttp);

describe('Task API', () => {
  
  describe('GET /api/tasks', () => {
    it('should return all tasks', (done) => {
      chai
        .request(app)
        .get('/api/tasks')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('success').to.be.true;
          res.body.should.have.property('count').to.be.a('number');
          res.body.should.have.property('data').to.be.an('array');
          done();
        });
    });
  });

  describe('POST /api/tasks', () => {
    it('should add a new task', (done) => {
      chai
        .request(app)
        .post('/api/tasks')
        .send({
          title: 'Task 1',
          description: 'Description 1'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('success').to.be.true;
          res.body.should.have.property('data').to.be.an('object');
          done();
        });
    });

    it('should return an error if title or description is missing', (done) => {
      chai
        .request(app)
        .post('/api/tasks')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('success').to.be.false;
          res.body.should.have.property('Error').to.be.a('string');
          done();
        });
    });

    it('should return an error if title or description length is too long', (done) => {
      chai
        .request(app)
        .post('/api/tasks')
        .send({
          title: 'This is a very long title that exceeds the maximum limit',
          description: 'This is a very long description that exceeds the maximum limit'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('success').to.be.false;
          res.body.should.have.property('Error').to.be.a('string');
          done();
        });
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update the status of a task', (done) => {
      chai
        .request(app)
        .put('/api/tasks/1')
        .send({
          status: 'completed'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('success').to.be.true;
          res.body.should.have.property('data').to.be.an('object');
          done();
        });
    });

    it('should return an error if task is not found', (done) => {
      chai
        .request(app)
        .put('/api/tasks/999')
        .send({
          status: 'completed'
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.false;
          res.body.should.have.property('message').to.be.a('string');
          done();
        });
    });

    it('should return an error if status is missing', (done) => {
      chai
        .request(app)
        .put('/api/tasks/1')
        .send({})
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.false;
          res.body.should.have.property('message').to.be.a('string');
          done();
        });
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', (done) => {
      chai
        .request(app)
        .delete('/api/tasks/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('success').to.be.true;
          res.body.should.have.property('data').to.be.an('object');
          done();
        });
    });

    it('should return an error if task is not found', (done) => {
      chai
        .request(app)
        .delete('/api/tasks/999')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.false;
          res.body.should.have.property('Error').to.be.a('string');
          done();
        });
    });
  });

});