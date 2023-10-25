Create a new file named Backend/tasks.test.js and copy the following contents in it:

```javascript
const chai = require("chai");
const chaiHttp = require("chai-http");
const { describe, it } = require("mocha");
const { expect } = chai;
chai.use(chaiHttp);
const app = require("./app");

describe("Tasks Controller Test", () => {
  describe("GET /api/tasks", () => {
    it("should return all tasks", (done) => {
      chai
        .request(app)
        .get("/task")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an("array");
          // Add more assertions as needed
          done();
        });
    });

    it("should return an error if user token is missing", (done) => {
      chai
        .request(app)
        .get("/task")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          console.log("🚀 ~ file: test.test.js:282 ~ .end ~ res:", res)
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal("Please login again!");
          done();
        });
    });

    it("should return an error if user is not authenticated", (done) => {
      chai
        .request(app)
        .get("/task")
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal(
            "Not authorized to access this route"
          );
          // Add more assertions as needed
          done();
        });
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", (done) => {
      chai
        .request(app)
        .post("/task")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task 1", description: "Description 1" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an("object");
          taskId = res.body.data.id;
          // Add more assertions as needed
          done();
        });
    });

    it("should return an error if title or description is missing", (done) => {
      chai
        .request(app)
        .post("/task")
        .send({ title: "", description: "Description 1" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal("title & description are required!");
          done();
        });
    });

    it("should return an error if title or description length is too long", (done) => {
      chai
        .request(app)
        .post("/task")
        .send({
          title: "This is a very long title that exceeds the character limit",
          description: "Description 1",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal(
            "Title or description length too long!"
          );
          done();
        });
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update the status of a task", (done) => {
      chai
        .request(app)
        .put(`/task/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "completed" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an("object");
          // Add more assertions as needed
          done();
        });
    });

    it("should return an error if the task ID is not found", (done) => {
      chai
        .request(app)
        .put(`/task/${taskId + 10}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "completed" })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an("object");
          expect(res.body.status).to.equal(false);
          expect(res.body.message).to.equal("Task not found!");
          done();
        });
    });

    it("should return an error if status is missing in the request body", (done) => {
      chai
        .request(app)
        .put(`/task/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an("object");
          expect(res.body.status).to.equal(false);
          expect(res.body.message).to.equal("Please add status in body!");
          done();
        });
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", (done) => {
      chai
        .request(app)
        .delete(`/task/${taskId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an("object");
          // Add more assertions as needed
          done();
        });
    });

    it("should return an error if the task ID is not found", (done) => {
      const taskId = 999; // Replace with a non-existent task ID
      chai
        .request(app)
        .delete(`/task/${taskId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an("object");
          expect(res.body.status).to.equal(false);
          expect(res.body.Error).to.equal("Task not found!");
          done();
        });
    });
  });
});
```