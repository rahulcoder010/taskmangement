const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Task API', () => {
  describe('GET /tasks', () => {
    it('should get all tasks', (done) => {
      chai.request('http://localhost:3000')
        .get('/tasks')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /tasks', () => {
    it('should add a new task', (done) => {
      chai.request('http://localhost:3000')
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'This is a test task'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('should return an error if title or description is missing', (done) => {
      chai.request('http://localhost:3000')
        .post('/tasks')
        .send({
          title: '',
          description: ''
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal('**title & description are required!**');
          done();
        });
    });

    it('should return an error if title or description length is too long', (done) => {
      chai.request('http://localhost:3000')
        .post('/tasks')
        .send({
          title: 'This is a very long title that exceeds the character limit',
          description: 'This is a very long description that exceeds the character limit'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal('**Title or description length too long!**');
          done();
        });
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update the status of a task', (done) => {
      chai.request('http://localhost:3000')
        .put('/tasks/1')
        .send({
          status: 'completed'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.status).to.equal('completed');
          done();
        });
    });

    it('should return an error if task is not found', (done) => {
      chai.request('http://localhost:3000')
        .put('/tasks/99')
        .send({
          status: 'completed'
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(false);
          expect(res.body.message).to.equal('Task not found!');
          done();
        });
    });

    it('should return an error if status is missing in the request body', (done) => {
      chai.request('http://localhost:3000')
        .put('/tasks/1')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(false);
          expect(res.body.message).to.equal('Please add status in body!');
          done();
        });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', (done) => {
      chai.request('http://localhost:3000')
        .delete('/tasks/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('should return an error if task is not found', (done) => {
      chai.request('http://localhost:3000')
        .delete('/tasks/99')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(false);
          expect(res.body.Error).to.equal('Task not found!');
          done();
        });
    });
  });
});