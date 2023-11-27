const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../models/User");

chai.use(chaiHttp);

describe("User API", () => {
  beforeEach(async () => {
    await User.destroy({ truncate: true });
  });

  describe("GET /api/users", () => {
    it("should return all users", (done) => {
      chai
        .request(app)
        .get("/api/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.should.have.lengthOf(0);
          done();
        });
    });
  });

  describe("POST /api/users", () => {
    it("should register a new user", (done) => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      chai
        .request(app)
        .post("/api/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eq(true);
          res.body.should.have.property("data");
          res.body.data.should.have.property("name").eq(user.name);
          res.body.data.should.have.property("email").eq(user.email);
          done();
        });
    });

    it("should not register a user with existing email", (done) => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      User.create(user).then(() => {
        chai
          .request(app)
          .post("/api/users")
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an("object");
            res.body.should.have.property("success").eq(false);
            res.body.should.have.property("Error");
            res.body.Error.should.equal(
              `User ${user.name} already registered!`
            );
            done();
          });
      });
    });
  });

  describe("POST /api/users/login", () => {
    it("should login a user with valid credentials", (done) => {
      const user = {
        email: "john@example.com",
        password: "password123",
      };

      User.create({
        name: "John Doe",
        email: user.email,
        password: user.password,
      }).then(() => {
        chai
          .request(app)
          .post("/api/users/login")
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("success").eq(true);
            res.body.should.have.property("token");
            res.body.should.have.property("message").eq("Login successful");
            done();
          });
      });
    });

    it("should not login a user with invalid credentials", (done) => {
      const user = {
        email: "john@example.com",
        password: "password123",
      };

      User.create({
        name: "John Doe",
        email: user.email,
        password: user.password,
      }).then(() => {
        chai
          .request(app)
          .post("/api/users/login")
          .send({ email: user.email, password: "password456" })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object");
            res.body.should.have.property("success").eq(false);
            res.body.should.have.property("Error").eq("Incorrect Password");
            res.body.should.have.property("message").eq("Authentication failed");
            done();
          });
      });
    });

    it("should not login a user with missing credentials", (done) => {
      const user = {
        email: "john@example.com",
        password: "password123",
      };

      User.create({
        name: "John Doe",
        email: user.email,
        password: user.password,
      }).then(() => {
        chai
          .request(app)
          .post("/api/users/login")
          .send({ email: user.email })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an("object");
            res.body.should.have.property("success").eq(false);
            res.body.should.have.property("Error").eq("Please provide an email and password");
            res.body.should.have.property("message").eq("Authentication failed");
            done();
          });
      });
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update a user", (done) => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
      };

      User.create({
        name: user.name,
        email: user.email,
        password: "password123",
      }).then((createdUser) => {
        chai
          .request(app)
          .put(`/api/users/${createdUser.id}`)
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("success").eq(true);
            res.body.should.have.property("data");
            res.body.data.should.have.property("name").eq(user.name);
            res.body.data.should.have.property("email").eq(user.email);
            done();
          });
      });
    });
  });

  describe("PUT /api/users/:id/password", () => {
    it("should update a user's password", (done) => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      User.create(user).then((createdUser) => {
        chai
          .request(app)
          .put(`/api/users/${createdUser.id}/password`)
          .send({
            currentPassword: user.password,
            newPassword: "newpassword123",
          })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.an("object");
            res.body.should.have.property("success").eq(true);
            res.body.should.have.property("newPassword").eq("newpassword123");
            res.body.should.have.property("message").eq("Password updated successfully");
            done();
          });
      });
    });

    it("should not update a user's password with incorrect current password", (done) => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      User.create(user).then((createdUser) => {
        chai
          .request(app)
          .put(`/api/users/${createdUser.id}/password`)
          .send({
            currentPassword: "wrongpassword",
            newPassword: "newpassword123",
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an("object");
            res.body.should.have.property("success").eq(false);
            res.body.should.have.property("Error").eq("CurrentPassword is incorrect");
            res.body.should.have.property("message").eq("Failed to update password");
            done();
          });
      });
    });

    it("should not update a user's password if user does not exist", (done) => {
      chai
        .request(app)
        .put("/api/users/1/password")
        .send({
          currentPassword: "password123",
          newPassword: "newpassword123",
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eq(false);
          res.body.should.have.property("Error").eq("Invalid credential");
          res.body.should.have.property("message").eq("Failed to update password");
          done();
        });
    });
  });

  describe("POST /api/users/logout", () => {
    it("should log out a user", (done) => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        token: "dummytoken",
      };

      User.create(user).then((createdUser) => {
        chai
          .request(app)
          .post("/api/users/logout")
          .set("Authorization", `Bearer ${user.token}`)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.an("object");
            res.body.should.have.property("success").eq(true);
            res.body.should.have.property("message").eq(`logout User ${user.name} successfully!`);
            done();
          });
      });
    });

    it("should not log out a user if token is invalid", (done) => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        token: "dummytoken",
      };

      User.create(user).then((createdUser) => {
        chai
          .request(app)
          .post("/api/users/logout")
          .set("Authorization", "Bearer invalidtoken")
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an("object");
            res.body.should.have.property("success").eq(false);
            res.body.should.have.property("Error").eq("please login again!");
            res.body.should.have.property("message").eq("Logout failed");
            done();
          });
      });
    });

    it("should not log out a user if user does not exist", (done) => {
      chai
        .request(app)
        .post("/api/users/logout")
        .set("Authorization", "Bearer dummytoken")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eq(false);
          res.body.should.have.property("Error").eq("Invalid credential");
          res.body.should.have.property("message").eq("Logout failed");
          done();
        });
    });
  });
});