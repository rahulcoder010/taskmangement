const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app.js");

chai.use(chaiHttp);

describe("User API", () => {
  describe("GET /users", () => {
    it("should get all users", (done) => {
      chai
        .request(app)
        .get("/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("count").be.a("number");
          res.body.should.have.property("data").be.an("array");
          done();
        });
    });
  });

  describe("POST /register", () => {
    it("should register a new user", (done) => {
      const user = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
      };
      chai
        .request(app)
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("data").be.an("object");
          done();
        });
    });

    it("should return an error if user already exists", (done) => {
      const user = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
      };
      chai
        .request(app)
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("Error").be.a("string");
          done();
        });
    });

    it("should return an error if required fields are missing", (done) => {
      const user = {
        name: "John Doe",
        password: "password",
      };
      chai
        .request(app)
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("Error").be.a("string");
          done();
        });
    });
  });

  describe("POST /login", () => {
    it("should log in a user with valid credentials", (done) => {
      const user = {
        email: "johndoe@example.com",
        password: "password",
      };
      chai
        .request(app)
        .post("/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("token").be.a("string");
          res.body.should.have.property("user").be.an("object");
          done();
        });
    });

    it("should return an error with invalid email", (done) => {
      const user = {
        email: "invalidemail@example.com",
        password: "password",
      };
      chai
        .request(app)
        .post("/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("Error").be.a("string");
          done();
        });
    });

    it("should return an error with invalid password", (done) => {
      const user = {
        email: "johndoe@example.com",
        password: "invalidpassword",
      };
      chai
        .request(app)
        .post("/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("Error").be.a("string");
          done();
        });
    });

    it("should return an error if required fields are missing", (done) => {
      const user = {
        email: "johndoe@example.com",
      };
      chai
        .request(app)
        .post("/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("Error").be.a("string");
          done();
        });
    });
  });

  describe("PUT /users/:id", () => {
    it("should update a user with valid data", (done) => {
      const user = {
        name: "Jane Doe",
        email: "janedoe@example.com",
      };
      chai
        .request(app)
        .put("/users/1")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("data").be.an("object");
          done();
        });
    });

    it("should return an error if user does not exist", (done) => {
      const user = {
        name: "Jane Doe",
        email: "janedoe@example.com",
      };
      chai
        .request(app)
        .put("/users/999")
        .send(user)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("Error").be.a("string");
          done();
        });
    });
  });

  describe("PUT /users/:id/password", () => {
    it("should update a user's password with valid credentials", (done) => {
      const user = {
        currentPassword: "password",
        newPassword: "newpassword",
      };
      chai
        .request(app)
        .put("/users/1/password")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("newPassword").be.a("string");
          done();
        });
    });

    it("should return an error with incorrect current password", (done) => {
      const user = {
        currentPassword: "invalidpassword",
        newPassword: "newpassword",
      };
      chai
        .request(app)
        .put("/users/1/password")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("Error").be.a("string");
          done();
        });
    });

    it("should return an error if user does not exist", (done) => {
      const user = {
        currentPassword: "password",
        newPassword: "newpassword",
      };
      chai
        .request(app)
        .put("/users/999/password")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("Error").be.a("string");
          done();
        });
    });
  });

  describe("GET /users/logout", () => {
    it("should log out a user", (done) => {
      chai
        .request(app)
        .get("/users/logout")
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("message").be.a("string");
          done();
        });
    });

    it("should return an error if user is not logged in", (done) => {
      chai
        .request(app)
        .get("/users/logout")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("Error").be.a("string");
          done();
        });
    });
  });
});
