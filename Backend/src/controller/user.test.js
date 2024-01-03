// Backend/src/controller/user.test.js

const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);

const app = require("../app");
const db = require("../models/index.js");
const { User } = db;

describe("User", () => {
  // Run this function before all test cases
  before(async () => {
    // Clear the database before running the tests
    await User.destroy({ truncate: true });
  });

  describe("POST /users/register", () => {
    it("should register a new user", async () => {
      const user = {
        name: "John",
        email: "john@example.com",
        password: "password123"
      };

      const res = await chai
        .request(app)
        .post("/users/register")
        .send(user);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("success").to.be.true;
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.have.property("name").to.equal(user.name);
      expect(res.body.data).to.have.property("email").to.equal(user.email);
    });

    it("should not register a user with an existing email", async () => {
      const existingUser = {
        name: "Jane",
        email: "john@example.com",
        password: "password456"
      };

      const res = await chai
        .request(app)
        .post("/users/register")
        .send(existingUser);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("success").to.be.false;
      expect(res.body).to.have.property("Error").to.equal(
        `User ${existingUser.name} already registered!`
      );
    });
  });

  describe("POST /users/login", () => {
    it("should login a user with valid credentials", async () => {
      const user = {
        email: "john@example.com",
        password: "password123"
      };

      const res = await chai
        .request(app)
        .post("/users/login")
        .send(user);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success").to.be.true;
      expect(res.body).to.have.property("token");
      expect(res.body).to.have.property("user");
      expect(res.body.user).to.have.property("name");
      expect(res.body.user).to.have.property("email");
    });

    it("should not login a user with invalid credentials", async () => {
      const user = {
        email: "john@example.com",
        password: "wrongpassword"
      };

      const res = await chai
        .request(app)
        .post("/users/login")
        .send(user);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property("success").to.be.false;
      expect(res.body).to.have.property("Error").to.equal("Invalid credential");
    });

    it("should not login a user without email or password", async () => {
      const user = {
        email: "john@example.com"
      };

      const res = await chai
        .request(app)
        .post("/users/login")
        .send(user);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("success").to.be.false;
      expect(res.body).to.have.property("Error").to.equal(
        "Please provide an email and password"
      );
    });
  });

  describe("PUT /users/update", () => {
    let token;

    // Run this function before this test case
    before(async () => {
      // Login the user to get the access token
      const user = {
        email: "john@example.com",
        password: "password123"
      };

      const res = await chai
        .request(app)
        .post("/users/login")
        .send(user);

      token = res.body.token;
    });

    it("should update the user's name and email", async () => {
      const updateUser = {
        name: "John Doe",
        email: "johndoe@example.com"
      };

      const res = await chai
        .request(app)
        .put("/users/update")
        .set("Authorization", `Bearer ${token}`)
        .send(updateUser);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success").to.be.true;
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.have.property("name").to.equal(updateUser.name);
      expect(res.body.data).to.have.property("email").to.equal(updateUser.email);
    });
  });

  describe("PUT /users/update-password", () => {
    let token;

    // Run this function before this test case
    before(async () => {
      // Login the user to get the access token
      const user = {
        email: "johndoe@example.com",
        password: "password123"
      };

      const res = await chai
        .request(app)
        .post("/users/login")
        .send(user);

      token = res.body.token;
    });

    it("should update the user's password", async () => {
      const updatePassword = {
        currentPassword: "password123",
        newPassword: "newpassword456"
      };

      const res = await chai
        .request(app)
        .put("/users/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send(updatePassword);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("success").to.be.true;
      expect(res.body).to.have.property("newPassword");
      expect(res.body).to.have.property("message").to.equal("Password updated successfully");
    });

    it("should not update the user's password with incorrect current password", async () => {
      const updatePassword = {
        currentPassword: "wrongpassword",
        newPassword: "newpassword456"
      };

      const res = await chai
        .request(app)
        .put("/users/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send(updatePassword);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property("success").to.be.false;
      expect(res.body).to.have.property("Error").to.equal("CurrentPassword is incorrect");
    });
  });

  describe("POST /users/logout", () => {
    let token;

    // Run this function before this test case
    before(async () => {
      // Login the user to get the access token
      const user = {
        email: "johndoe@example.com",
        password: "newpassword456"
      };

      const res = await chai
        .request(app)
        .post("/users/login")
        .send(user);

      token = res.body.token;
    });

    it("should logout the user", async () => {
      const res = await chai
        .request(app)
        .post("/users/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("success").to.be.true;
      expect(res.body).to.have.property("message").to.equal("logout User John Doe successfully!");
    });
  });
});
