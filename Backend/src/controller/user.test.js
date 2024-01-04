const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const server = require("../server");

chai.use(chaiHttp);

describe("User API", () => {
  describe("POST /users/register", () => {
    it("should register a new user", (done) => {
      chai
        .request(server)
        .post("/users/register")
        .send({
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password123",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("success").to.equal(true);
          expect(res.body).to.have.property("data");
          expect(res.body).to.have.property("message").to.equal(
            "User created successfully"
          );
          done();
        });
    });

    it("should return an error if user already exists", (done) => {
      chai
        .request(server)
        .post("/users/register")
        .send({
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password123",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error").to.equal(
            "User John Doe already registered!"
          );
          done();
        });
    });

    it("should return an error if required fields are missing", (done) => {
      chai
        .request(server)
        .post("/users/register")
        .send({
          name: "John Doe",
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error");
          expect(res.body).to.have.property("message").to.equal(
            "Failed to create user"
          );
          done();
        });
    });

    it("should return an error if email is invalid", (done) => {
      chai
        .request(server)
        .post("/users/register")
        .send({
          name: "John Doe",
          email: "johndoe",
          password: "password123",
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error");
          expect(res.body).to.have.property("message").to.equal(
            "Failed to create user"
          );
          done();
        });
    });

    it("should return an error if password is less than 6 characters", (done) => {
      chai
        .request(server)
        .post("/users/register")
        .send({
          name: "John Doe",
          email: "johndoe@example.com",
          password: "pass",
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error");
          expect(res.body).to.have.property("message").to.equal(
            "Failed to create user"
          );
          done();
        });
    });
  });

  describe("POST /users/login", () => {
    it("should login a user", (done) => {
      chai
        .request(server)
        .post("/users/login")
        .send({
          email: "johndoe@example.com",
          password: "password123",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success").to.equal(true);
          expect(res.body).to.have.property("token");
          expect(res.body).to.have.property("user");
          expect(res.body).to.have.property("message").to.equal(
            "Login successful"
          );
          done();
        });
    });

    it("should return an error if email or password is missing", (done) => {
      chai
        .request(server)
        .post("/users/login")
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error").to.equal(
            "Please provide an email and password"
          );
          expect(res.body).to.have.property("message").to.equal(
            "Authentication failed"
          );
          done();
        });
    });

    it("should return an error if user is not found", (done) => {
      chai
        .request(server)
        .post("/users/login")
        .send({
          email: "janedoe@example.com",
          password: "password123",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error").to.equal(
            "Invalid credential"
          );
          expect(res.body).to.have.property("message").to.equal(
            "Authentication failed"
          );
          done();
        });
    });

    it("should return an error if password is incorrect", (done) => {
      chai
        .request(server)
        .post("/users/login")
        .send({
          email: "johndoe@example.com",
          password: "pass123",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error").to.equal(
            "Incorrect Password"
          );
          expect(res.body).to.have.property("message").to.equal(
            "Authentication failed"
          );
          done();
        });
    });
  });

  describe("PUT /users/:id", () => {
    it("should update a user", (done) => {
      chai
        .request(server)
        .put("/users/1")
        .send({
          name: "John Smith",
          email: "johnsmith@example.com",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success").to.equal(true);
          expect(res.body).to.have.property("data");
          expect(res.body).to.have.property("message").to.equal(
            "User updated successfully"
          );
          done();
        });
    });

    it("should return an error if user is not found", (done) => {
      chai
        .request(server)
        .put("/users/99")
        .send({
          name: "John Smith",
          email: "johnsmith@example.com",
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error").to.exist;
          expect(res.body).to.have.property("message").to.equal(
            "Failed to update user"
          );
          done();
        });
    });
  });

  describe("PUT /users/updatepassword", () => {
    it("should update a user's password", (done) => {
      chai
        .request(server)
        .put("/users/updatepassword")
        .send({
          currentPassword: "password123",
          newPassword: "newpassword123",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("success").to.equal(true);
          expect(res.body).to.have.property("newPassword");
          expect(res.body).to.have.property("message").to.equal(
            "Password updated successfully"
          );
          done();
        });
    });

    it("should return an error if user is not found", (done) => {
      chai
        .request(server)
        .put("/users/updatepassword")
        .send({
          currentPassword: "password123",
          newPassword: "newpassword123",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error").to.equal(
            "Invalid credential"
          );
          expect(res.body).to.have.property("message").to.equal(
            "Failed to update password"
          );
          done();
        });
    });

    it("should return an error if current password is incorrect", (done) => {
      chai
        .request(server)
        .put("/users/updatepassword")
        .send({
          currentPassword: "pass123",
          newPassword: "newpassword123",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error").to.equal(
            "CurrentPassword is incorrect"
          );
          expect(res.body).to.have.property("message").to.equal(
            "Failed to update password"
          );
          done();
        });
    });
  });

  describe("POST /users/logout", () => {
    it("should logout a user", (done) => {
      chai
        .request(server)
        .post("/users/logout")
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("success").to.equal(true);
          expect(res.body).to.have.property("message").to.equal(
            "logout User John Smith successfully!"
          );
          expect(res.body).to.have.property("message").to.equal(
            "Logout successful"
          );
          done();
        });
    });

    it("should return an error if user token is not found", (done) => {
      chai
        .request(server)
        .post("/users/logout")
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("success").to.equal(false);
          expect(res.body).to.have.property("Error").to.equal(
            "please login again!"
          );
          expect(res.body).to.have.property("message").to.equal(
            "Logout failed"
          );
          done();
        });
    });
  });
});