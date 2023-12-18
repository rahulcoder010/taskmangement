const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
chai.use(chaiHttp);
chai.should();

describe("Task API", () => {
  before((done) => {
    // This code will run before every test
    done();
  });

  after((done) => {
    // This code will run after every test
    done();
  });

  describe("GET /tasks", () => {
    it("should get all tasks", (done) => {
      chai
        .request(app)
        .get("/tasks")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eq(true);
          res.body.should.have.property("count");
          res.body.should.have.property("data");
          done();
        });
    });
  });

  describe("POST /task", () => {
    it("should add a task", (done) => {
      const task = {
        title: "Test Task",
        description: "This is a test task",
      };
      chai
        .request(app)
        .post("/task")
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eq(true);
          res.body.should.have.property("data");
          res.body.data.should.have.property("title").eq("Test Task");
          res.body.data.should.have.property("description").eq(
            "This is a test task"
          );
          done();
        });
    });

    it("should return an error if title or description is missing", (done) => {
      const task = {
        title: "",
        description: "This is a test task",
      };
      chai
        .request(app)
        .post("/task")
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eq(false);
          res.body.should.have
            .property("Error")
            .eq("**title & description are required!**");
          done();
        });
    });

    it("should return an error if title or description is too long", (done) => {
      const task = {
        title: "Task with a very long title that exceeds the character limit",
        description: "This is a test task",
      };
      chai
        .request(app)
        .post("/task")
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eq(false);
          res.body.should.have
            .property("Error")
            .eq("**Title or description length too long!**");
          done();
        });
    });
  });

  describe("PUT /task/:id", () => {
    it("should update a task", (done) => {
      const task = {
        status: "completed",
      };
      chai
        .request(app)
        .put("/task/1")
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eq(true);
          res.body.should.have.property("data");
          res.body.data.should.have.property("status").eq("completed");
          done();
        });
    });

    it("should return an error if task with the given id is not found", (done) => {
      const task = {
        status: "completed",
      };
      chai
        .request(app)
        .put("/task/100")
        .send(task)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eq(false);
          res.body.should.have.property("Error").eq("Task not found!");
          done();
        });
    });

    it("should return an error if status is not provided in the body", (done) => {
      const task = {};
      chai
        .request(app)
        .put("/task/1")
        .send(task)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eq(false);
          res.body.should.have
            .property("Error")
            .eq("Please add status in body!");
          done();
        });
    });
  });

  describe("DELETE /task/:id", () => {
    it("should delete a task", (done) => {
      chai
        .request(app)
        .delete("/task/1")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eq(true);
          res.body.should.have.property("data");
          done();
        });
    });

    it("should return an error if task with the given id is not found", (done) => {
      chai
        .request(app)
        .delete("/task/100")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eq(false);
          res.body.should.have.property("Error").eq("Task not found!");
          done();
        });
    });
  });
});