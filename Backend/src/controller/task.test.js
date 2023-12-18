const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe("Task API", () => {
  describe("GET /tasks", () => {
    it("should return all tasks", (done) => {
      chai.request(app)
        .get('/tasks')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('count').be.a('number');
          res.body.should.have.property('data').be.a('array');
          done();
        });
    });
  });

  describe("POST /tasks", () => {
    it("should add a new task", (done) => {
      const task = {
        title: "New Task",
        description: "This is a new task"
      };
      chai.request(app)
        .post('/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data').be.a('object');
          res.body.data.should.have.property('title').eq(task.title);
          res.body.data.should.have.property('description').eq(task.description);
          done();
        });
    });

    it("should return an error if title or description is missing", (done) => {
      const task = {
        description: "This task has no title"
      };
      chai.request(app)
        .post('/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('Error').eq("**title & description are required!**");
          done();
        });
    });

    it("should return an error if title or description length is too long", (done) => {
      const task = {
        title: "This is a very long title that exceeds the limit of 50 characters",
        description: "This is a very long description that exceeds the limit of 200 characters"
      };
      chai.request(app)
        .post('/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(false);
          res.body.should.have.property('Error').eq("**Title or description length too long!**");
          done();
        });
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update the status of a task", (done) => {
      const taskId = 1;
      const status = "completed";
      chai.request(app)
        .put(`/tasks/${taskId}`)
        .send({ status: status })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data').be.a('object');
          res.body.data.should.have.property('status').eq(status);
          done();
        });
    });

    it("should return an error if task is not found", (done) => {
      const taskId = 999;
      const status = "completed";
      chai.request(app)
        .put(`/tasks/${taskId}`)
        .send({ status: status })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq(false);
          res.body.should.have.property('message').eq("Task not found!");
          done();
        });
    });

    it("should return an error if status is missing", (done) => {
      const taskId = 1;
      chai.request(app)
        .put(`/tasks/${taskId}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq(false);
          res.body.should.have.property('message').eq("Please add status in body!");
          done();
        });
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", (done) => {
      const taskId = 1;
      chai.request(app)
        .delete(`/tasks/${taskId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eq(true);
          res.body.should.have.property('data').be.a('object');
          done();
        });
    });

    it("should return an error if task is not found", (done) => {
      const taskId = 999;
      chai.request(app)
        .delete(`/tasks/${taskId}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq(false);
          res.body.should.have.property('Error').eq("Task not found!");
          done();
        });
    });
  });
});