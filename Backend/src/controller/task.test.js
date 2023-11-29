Testing for task.js in task.test.js file:

```javascript
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
chai.should();

describe("Task", () => {
  describe("GET /tasks", () => {
    it("should return all tasks", (done) => {
      chai
        .request(app)
        .get("/tasks")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return a single task", (done) => {
      const taskId = 1;
      chai
        .request(app)
        .get(`/tasks/${taskId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id").eq(taskId);
          done();
        });
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", (done) => {
      const task = {
        name: "New Task",
        description: "This is a new task",
      };
      chai
        .request(app)
        .post("/tasks")
        .send(task)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("name").eq(task.name);
          res.body.should.have.property("description").eq(task.description);
          done();
        });
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update a task", (done) => {
      const taskId = 1;
      const updatedTask = {
        name: "Updated Task",
        description: "This is an updated task",
      };
      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .send(updatedTask)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id").eq(taskId);
          res.body.should.have.property("name").eq(updatedTask.name);
          res.body.should.have
            .property("description")
            .eq(updatedTask.description);
          done();
        });
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", (done) => {
      const taskId = 1;
      chai
        .request(app)
        .delete(`/tasks/${taskId}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
```