const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const server = require('../server');
const Tasks = require('../models/task');

describe('Task API', () => {
  beforeEach((done) => {
    // Clear the database before each test
    Tasks.deleteMany({}, (err) => {
      done();
    });
  });

  describe('GET /tasks', () => {
    it('should get all tasks', (done) => {
      chai.request(server)
        .get('/tasks')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('count').eql(0);
          res.body.should.have.property('data').to.be.an('array');
          done();
        });
    });
  });

  describe('POST /tasks', () => {
    it('should add a new task', (done) => {
      const task = {
        title: 'Test Task',
        description: 'This is a test task'
      };
      chai.request(server)
        .post('/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data').to.be.an('object');
          res.body.data.should.have.property('_id');
          done();
        });
    });
    it('should return an error if title and description are not provided', (done) => {
      const task = {
        description: 'This is a test task'
      };
      chai.request(server)
        .post('/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('Error').eql('title & description are required!');
          done();
        });
    });
    it('should return an error if title or description length is too long', (done) => {
      const task = {
        title: 'This is a very long title that is more than 50 characters',
        description: 'This is a test task'
      };
      chai.request(server)
        .post('/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('Error').eql('Title or description length too long!');
          done();
        });
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', (done) => {
      const task = new Task({ title: 'Test Task', description: 'This is a test task' });
      task.save((err, task) => {
        chai.request(server)
          .put('/tasks/' + task.id)
          .send({ status: 'completed' })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('success').eql(true);
            res.body.should.have.property('data').to.be.an('object');
            res.body.data.should.have.property('_id');
            res.body.data.should.have.property('status').eql('completed');
            done();
          });
      });
    });
    it('should return an error if the task is not found', (done) => {
      chai.request(server)
        .put('/tasks/123')
        .send({ status: 'completed' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql('Task not found!');
          done();
        });
    });
    it('should return an error if the status is not provided', (done) => {
      const task = new Task({ title: 'Test Task', description: 'This is a test task' });
      task.save((err, task) => {
        chai.request(server)
          .put('/tasks/' + task.id)
          .send({})
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.an('object');
            res.body.should.have.property('success').eql(false);
            res.body.should.have.property('message').eql('Please add status in body!');
            done();
          });
      });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', (done) => {
      const task = new Task({ title: 'Test Task', description: 'This is a test task' });
      task.save((err, task) => {
        chai.request(server)
          .delete('/tasks/' + task.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('success').eql(true);
            res.body.should.have.property('data').to.be.an('object');
            res.body.data.should.have.property('_id');
            done();
          });
      });
    });
    it('should return an error if the task is not found', (done) => {
      chai.request(server)
        .delete('/tasks/123')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('Error').eql('Task not found!');
          done();
        });
    });
  });
});