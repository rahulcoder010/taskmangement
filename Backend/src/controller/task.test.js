const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); //assuming app is the express application
const expect = chai.expect;

chai.use(chaiHttp);

describe("Task Controller", () => {
  describe("GET /tasks", () => {
    it("should get all tasks", (done) => {
      chai
        .request(app)
        .get("/tasks")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success").equal(true);
          expect(res.body).to.have.property("count");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.be.an("array");
          done();
        });
    });
  });

  describe("POST /tasks", () => {
    it("should add a new task", (done) => {
      const task = {
        title: "Task Title",
        description: "Task Description",
      };
      chai
        .request(app)
        .post("/tasks")
        .send(task)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success").equal(true);
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.be.an("object");
          done();
        });
    });

    it("should return an error if title or description is missing", (done) => {
      const task = {
        // missing title and description
      };
      chai
        .request(app)
        .post("/tasks")
        .send(task)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success").equal(false);
          expect(res.body).to.have.property("Error");
          done();
        });
    });

    it("should return an error if title or description is too long", (done) => {
      const task = {
        title: "This is a very long task title that exceeds the character limit",
        description: "This is a very long task description that exceeds the character limit",
      };
      chai
        .request(app)
        .post("/tasks")
        .send(task)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success").equal(false);
          expect(res.body).to.have.property("Error");
          done();
        });
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update a task status", (done) => {
      const taskId = "task_id_here";
      const task = {
        status: "completed",
      };
      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .send(task)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success").equal(true);
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.be.an("object");
          done();
        });
    });

    it("should return an error if task is not found", (done) => {
      const taskId = "non_existing_task_id";
      const task = {
        status: "completed",
      };
      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .send(task)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("status").equal(false);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("should return an error if status is missing", (done) => {
      const taskId = "task_id_here";
      const task = {
        // missing status
      };
      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .send(task)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("status").equal(false);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", (done) => {
      const taskId = "task_id_here";
      chai
        .request(app)
        .delete(`/tasks/${taskId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success").equal(true);
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.be.an("object");
          done();
        });
    });

    it("should return an error if task is not found", (done) => {
      const taskId = "non_existing_task_id";
      chai
        .request(app)
        .delete(`/tasks/${taskId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("status").equal(false);
          expect(res.body).to.have.property("Error");
          done();
        });
    });
  });
});
