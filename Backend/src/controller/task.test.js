// Test cases for task.js using chai and mocha

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Assuming app.js is the main file for the application
const expect = chai.expect;

chai.use(chaiHttp);

describe("Task API", () => {
  // Test case for allTasks endpoint
  describe("GET /tasks", () => {
    it("should return all tasks", (done) => {
      chai
        .request(app)
        .get("/tasks")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.count).to.be.a("number");
          expect(res.body.data).to.be.an("array");
          done();
        });
    });

    it("should return an error if user token is missing", (done) => {
      chai
        .request(app)
        .get("/tasks")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.equal("Please login again!");
          done();
        });
    });

    it("should return an error if there is an error retrieving tasks", (done) => {
      chai
        .request(app)
        .get("/tasks")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.a("string");
          done();
        });
    });
  });

  // Test case for addTask endpoint
  describe("POST /tasks", () => {
    it("should create a new task", (done) => {
      chai
        .request(app)
        .post("/tasks")
        .send({ title: "Test Task", description: "Test Description" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an("object");
          expect(res.body.data.title).to.equal("Test Task");
          expect(res.body.data.description).to.equal("Test Description");
          done();
        });
    });

    it("should return an error if title or description is missing", (done) => {
      chai
        .request(app)
        .post("/tasks")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.equal("title & description are required!");
          done();
        });
    });

    it("should return an error if title or description length is too long", (done) => {
      chai
        .request(app)
        .post("/tasks")
        .send({
          title: "This is a very long title that exceeds the character limit",
          description: "This is a very long description that exceeds the character limit",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.equal("Title or description length too long!");
          done();
        });
    });

    it("should return an error if there is an error creating the task", (done) => {
      chai
        .request(app)
        .post("/tasks")
        .send({ title: "Test Task", description: "Test Description" })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.a("string");
          done();
        });
    });
  });

  // Test case for updateTask endpoint
  describe("PUT /tasks/:id", () => {
    it("should update the status of a task", (done) => {
      const taskId = "1"; // Replace with a valid task id

      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .send({ status: "Completed" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an("object");
          expect(res.body.data.status).to.equal("Completed");
          done();
        });
    });

    it("should return an error if task is not found", (done) => {
      const taskId = "invalidId"; // Provide an invalid task id

      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .send({ status: "Completed" })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.false;
          expect(res.body.message).to.equal("Task not found!");
          done();
        });
    });

    it("should return an error if status is missing in request body", (done) => {
      const taskId = "1"; // Replace with a valid task id

      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.false;
          expect(res.body.message).to.equal("Please add status in body!");
          done();
        });
    });

    it("should return an error if there is an error updating the task", (done) => {
      const taskId = "1"; // Replace with a valid task id

      chai
        .request(app)
        .put(`/tasks/${taskId}`)
        .send({ status: "Completed" })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.a("string");
          done();
        });
    });
  });

  // Test case for deleteTask endpoint
  describe("DELETE /tasks/:id", () => {
    it("should delete a task", (done) => {
      const taskId = "1"; // Replace with a valid task id

      chai
        .request(app)
        .delete(`/tasks/${taskId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an("object");
          done();
        });
    });

    it("should return an error if task is not found", (done) => {
      const taskId = "invalidId"; // Provide an invalid task id

      chai
        .request(app)
        .delete(`/tasks/${taskId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.false;
          expect(res.body.Error).to.equal("Task not found!");
          done();
        });
    });

    it("should return an error if there is an error deleting the task", (done) => {
      const taskId = "1"; // Replace with a valid task id

      chai
        .request(app)
        .delete(`/tasks/${taskId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.be.a("string");
          done();
        });
    });
  });
});