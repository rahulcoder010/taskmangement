const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('Task API', () => {
  describe('GET /tasks', () => {
    it('should get all tasks', (done) => {
      chai
        .request(app)
        .get('/tasks')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('count');
          res.body.should.have.property('data');
          done();
        });
    });
  });

  describe('POST /tasks', () => {
    it('should add a task', (done) => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          title: 'Task 1',
          description: 'This is task 1',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data');
          res.body.should.have.property('method').eq('addTask');
          done();
        });
    });

    it('should return an error if title is missing', (done) => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          description: 'This is task 2',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('Error').eq('**title & description are required!**');
          done();
        });
    });

    it('should return an error if description is missing', (done) => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          title: 'Task 3',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('Error').eq('**title & description are required!**');
          done();
        });
    });

    it('should return an error if title length is too long', (done) => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          title: 'Task with a very long title that exceeds the maximum character limit',
          description: 'This is task 4',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('Error').eq('**Title or description length too long!**');
          done();
        });
    });

    it('should return an error if description length is too long', (done) => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          title: 'Task 5',
          description: 'Task description that is longer than the maximum allowed character limit of 200 characters. The length of this description exceeds the limit and should trigger an error.',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('Error').eq('**Title or description length too long!**');
          done();
        });
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', (done) => {
      const taskId = '1';
      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .send({
          status: 'completed',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data');
          res.body.should.have.property('method').eq('updateTask');
          done();
        });
    });

    it('should return an error if task is not found', (done) => {
      const taskId = '999';
      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .send({
          status: 'completed',
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq(false);
          res.body.should.have.property('message').eq('Task not found!');
          done();
        });
    });

    it('should return an error if status is missing', (done) => {
      const taskId = '1';
      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .send({})
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq(false);
          res.body.should.have.property('message').eq('Please add status in body!');
          done();
        });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', (done) => {
      const taskId = '1';
      chai
        .request(app)
        .delete(`/tasks/${taskId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data');
          res.body.should.have.property('method').eq('deleteTask');
          done();
        });
    });

    it('should return an error if task is not found', (done) => {
      const taskId = '999';
      chai
        .request(app)
        .delete(`/tasks/${taskId}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq(false);
          res.body.should.have.property('Error').eq('Task not found!');
          done();
        });
    });
  });
});