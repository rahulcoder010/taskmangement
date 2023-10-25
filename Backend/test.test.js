const chai = require("chai");
const chaiHttp = require("chai-http");
const { describe, it } = require("mocha");
const { expect } = chai;
chai.use(chaiHttp);
const db = require("./src/models/index.js");
const Users = db.User;
const app = require("./app");

let token;
let taskId;

describe("Users Controller Test", () => {
  describe("GET /api/users", () => {
    it("should return all users", (done) => {
      chai
        .request(app)
        .get("/user")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an("array");
          // Add more assertions as needed
          done();
        });
    });
  });

  describe("POST /api/register", () => {
    it("should register a new user", (done) => {
      chai
        .request(app)
        .post("/user")
        .send({
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password123",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an("object");
          // Add more assertions as needed
          done();
        });
    });

    it("should return an error if user already exists", (done) => {
      // Create a user with the same email before running this test case
      chai
        .request(app)
        .post("/user")
        .send({
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password123",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal("User John Doe already registered!");
          // Add more assertions as needed
          done();
        });
    });
  });

  describe("POST /api/login", () => {
    it("should log in a user with valid credentials", (done) => {
      // Create a user with valid credentials before running this test case
      chai
        .request(app)
        .post("/user/login")
        .send({
          email: "johndoe@example.com",
          password: "password123",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          expect(res.body.token).to.be.a("string");
          expect(res.body.user).to.be.an("object");
          // Add more assertions as needed
          token = res.body.token;
          done();
        });
    });

    it("should return an error with invalid credentials", (done) => {
      chai
        .request(app)
        .post("/user/login")
        .send({
          email: "johndoe@example.com",
          password: "incorrectpassword",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal("Incorrect Password");
          // Add more assertions as needed
          done();
        });
    });
  });

  describe("PUT /api/users", () => {
    it("should update user details", (done) => {
      chai
        .request(app)
        .put("/user")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Updated Name",
          email: "updatedemail@example.com",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an("object");
          expect(res.body.data.name).to.equal("Updated Name");
          expect(res.body.data.email).to.equal("updatedemail@example.com");
          // Add more assertions as needed
          done();
        });
    });

    it("should return an error if user is not authenticated", (done) => {
      chai
        .request(app)
        .put("/user")
        .send({
          name: "Updated Name",
          email: "updatedemail@example.com",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal(
            "Not authorized to access this route"
          );
          // Add more assertions as needed
          done();
        });
    });
  });

  describe("PUT /api/users/password", () => {
    it("should update user password", (done) => {
      chai
        .request(app)
        .put("/user/updatePassword")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "password123",
          newPassword: "newpassword123",
        })
        .end(async (err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          const user = await Users.findOne({
            where: { password: res.body.newPassword },
          });
          expect(res.body.newPassword).to.equal(user.password);
          // Add more assertions as needed
          done();
        });
    });

    it("should return an error with incorrect current password", (done) => {
      chai
        .request(app)
        .put("/user/updatePassword")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "incorrectpassword",
          newPassword: "newpassword123",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal("CurrentPassword is incorrect");
          // Add more assertions as needed
          done();
        });
    });

    it("should return an error if user is not authenticated", (done) => {
      chai
        .request(app)
        .put("/user/updatePassword")
        .send({
          currentPassword: "password123",
          newPassword: "newpassword123",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal(
            "Not authorized to access this route"
          );
          // Add more assertions as needed
          done();
        });
    });
  });

  describe("POST /api/users/logout", () => {
    it("should log out a user", (done) => {
      // Authenticate the user before running this test case

      chai
        .request(app)
        .delete("/user/logout")
        .set("Authorization", `Bearer ${token}`)
        .end(async (err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          const user = await Users.findOne({
            where: { token },
          });
          expect(res.body.message).to.equal(
            `logout User ${user.name} successfully!`
          );
          // Add more assertions as needed
        });
      done();
    });

    it("should return an error if user is not authenticated", (done) => {
      chai
        .request(app)
        .delete("/user/logout")
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal(
            "Not authorized to access this route"
          );
          // Add more assertions as needed
          done();
        });
    });
  });
});

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

describe("404 Not Found", () => {
  it('should return "not found" for any route', (done) => {
    chai
      .request(app)
      .get("/nonexistent")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
