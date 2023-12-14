// Write unit test cases for task.js and user.js

// user.test.js

const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const db = require("../models/index.js");
const Users = db.User;
const {
  allUsers,
  registerUser,
  login,
  updateUser,
  updatePassword,
  logout,
} = require("./user");

describe("User Controller Unit Tests", () => {
  describe("allUsers", () => {
    it("should return all users with success status", async () => {
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      
      await allUsers(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.called).to.be.true;
    });

    it("should return an error with status 404 if there is an error", async () => {
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const error = new Error("Test Error");
      
      Users.findAll = sinon.stub().throws(error);

      await allUsers(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });
  });

  describe("registerUser", () => {
    it("should create a new user with success status", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      
      Users.findOne = sinon.stub().returns(null);
      Users.create = sinon.stub().resolves({ id: 1, name: req.body.name, email: req.body.email });

      await registerUser(req, res);

      expect(Users.findOne.called).to.be.true;
      expect(Users.create.called).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].success).to.be.true;
      expect(res.json.args[0][0].data).to.deep.equal({ id: 1, name: req.body.name, email: req.body.email });
    });

    it("should return an error with status 404 if there is an error", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const error = new Error("Test Error");

      Users.findOne = sinon.stub().returns(null);
      Users.create = sinon.stub().throws(error);

      await registerUser(req, res);

      expect(Users.findOne.called).to.be.true;
      expect(Users.create.called).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });

    it("should return an error with status 400 if user already exists", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const userExists = { name: "John Doe" };

      Users.findOne = sinon.stub().returns(userExists);

      await registerUser(req, res);

      expect(Users.findOne.called).to.be.true;
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].success).to.be.false;
      expect(res.json.args[0][0].Error).to.equal(`User ${userExists.name} already registered!`);
    });
  });

  describe("login", () => {
    it("should authenticate the user with success status", async () => {
      const req = {
        body: {
          email: "johndoe@example.com",
          password: "password",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const user = { name: "John Doe", validPassword: sinon.stub().resolves(true) };

      Users.findOne = sinon.stub().returns(user);

      await login(req, res);

      expect(Users.findOne.called).to.be.true;
      expect(user.validPassword.calledWith(req.body.password, user.password)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].success).to.be.true;
      expect(res.json.args[0][0].user).to.deep.equal(user);
    });

    it("should return an error with status 401 if invalid credential", async () => {
      const req = {
        body: {
          email: "johndoe@example.com",
          password: "password",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const error = new Error("Invalid credential");

      Users.findOne = sinon.stub().returns(null);

      await login(req, res);

      expect(Users.findOne.called).to.be.true;
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });

    it("should return an error with status 401 if incorrect password", async () => {
      const req = {
        body: {
          email: "johndoe@example.com",
          password: "password",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const user = { validPassword: sinon.stub().resolves(false) };
      const error = new Error("Incorrect Password");

      Users.findOne = sinon.stub().returns(user);

      await login(req, res);

      expect(Users.findOne.called).to.be.true;
      expect(user.validPassword.calledWith(req.body.password, user.password)).to.be.true;
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });

    it("should return an error with status 400 if email or password is not provided", async () => {
      const req = {
        body: {},
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const error = new Error("Please provide an email and password");

      await login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });
  });

  describe("updateUser", () => {
    it("should update the user with success status", async () => {
      const req = {
        body: {
          name: "Updated Name",
          email: "updatedemail@example.com",
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      Users.update = sinon.stub().resolves();

      await updateUser(req, res);

      expect(Users.update.calledWith({ name: req.body.name, email: req.body.email }, { where: { id: req.user.id } })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].success).to.be.true;
      expect(res.json.args[0][0].data).to.deep.equal({ name: req.body.name, email: req.body.email });
    });

    it("should return an error with status 404 if there is an error", async () => {
      const req = {
        body: {
          name: "Updated Name",
          email: "updatedemail@example.com",
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const error = new Error("Test Error");

      Users.update = sinon.stub().throws(error);

      await updateUser(req, res);

      expect(Users.update.calledWith({ name: req.body.name, email: req.body.email }, { where: { id: req.user.id } })).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });
  });

  describe("updatePassword", () => {
    it("should update the user password with success status", async () => {
      const req = {
        body: {
          currentPassword: "currentpassword",
          newPassword: "newpassword",
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const user = { matchPassword: sinon.stub().resolves(true), save: sinon.spy() };

      Users.findByPk = sinon.stub().returns(user);

      await updatePassword(req, res);

      expect(Users.findByPk.calledWith(req.user.id)).to.be.true;
      expect(user.matchPassword.calledWith(req.body.currentPassword)).to.be.true;
      expect(user.password).to.equal(req.body.newPassword);
      expect(user.save.called).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].success).to.be.true;
      expect(res.json.args[0][0].newPassword).to.equal(user.password);
    });

    it("should return an error with status 404 if user is not found", async () => {
      const req = {
        body: {
          currentPassword: "currentpassword",
          newPassword: "newpassword",
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const error = new Error("Invalid credential");

      Users.findByPk = sinon.stub().returns(null);

      await updatePassword(req, res);

      expect(Users.findByPk.calledWith(req.user.id)).to.be.true;
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });

    it("should return an error with status 401 if current password is incorrect", async () => {
      const req = {
        body: {
          currentPassword: "currentpassword",
          newPassword: "newpassword",
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const user = { matchPassword: sinon.stub().resolves(false) };
      const error = new Error("CurrentPassword is incorrect");

      Users.findByPk = sinon.stub().returns(user);

      await updatePassword(req, res);

      expect(Users.findByPk.calledWith(req.user.id)).to.be.true;
      expect(user.matchPassword.calledWith(req.body.currentPassword)).to.be.true;
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });

    it("should return an error with status 404 if there is an error", async () => {
      const req = {
        body: {
          currentPassword: "currentpassword",
          newPassword: "newpassword",
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const user = { matchPassword: sinon.stub().resolves(true) };
      const error = new Error("Test Error");

      Users.findByPk = sinon.stub().returns(user);
      user.save = sinon.stub().throws(error);

      await updatePassword(req, res);

      expect(Users.findByPk.calledWith(req.user.id)).to.be.true;
      expect(user.matchPassword.calledWith(req.body.currentPassword)).to.be.true;
      expect(user.password).to.equal(req.body.newPassword);
      expect(user.save.called).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });
  });

  describe("logout", () => {
    it("should logout the user with success status", async () => {
      const req = {
        user: {
          token: "token",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const finderUser = { token: req.user.token, save: sinon.spy() };

      Users.findOne = sinon.stub().returns(finderUser);

      await logout(req, res);

      expect(Users.findOne.calledWith({ where: { token: req.user.token } })).to.be.true;
      expect(finderUser.token).to.be.null;
      expect(finderUser.save.called).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].success).to.be.true;
      expect(res.json.args[0][0].message).to.equal(`logout User ${finderUser.name} successfully!`);
    });

    it("should return an error with status 400 if user is not found", async () => {
      const req = {
        user: {
          token: "token",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const error = new Error("please login again!");

      Users.findOne = sinon.stub().returns(null);

      await logout(req, res);

      expect(Users.findOne.calledWith({ where: { token: req.user.token } })).to.be.true;
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });

    it("should return an error with status 404 if there is an error", async () => {
      const req = {
        user: {
          token: "token",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const finderUser = { token: req.user.token, save: sinon.spy() };
      const error = new Error("Test Error");

      Users.findOne = sinon.stub().returns(finderUser);
      finderUser.save = sinon.stub().throws(error);

      await logout(req, res);

      expect(Users.findOne.calledWith({ where: { token: req.user.token } })).to.be.true;
      expect(finderUser.token).to.be.null;
      expect(finderUser.save.called).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });
  });
});

// task.test.js

const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const db = require("../models/index.js");
const Tasks = db.Task;
const { createTask, updateTask, deleteTask } = require("./task");

describe("Task Controller Unit Tests", () => {
  describe("createTask", () => {
    it("should create a new task with success status", async () => {
      const req = {
        body: {
          title: "Task Title",
          description: "Task Description",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      Tasks.create = sinon.stub().resolves({ id: 1, title: req.body.title, description: req.body.description });

      await createTask(req, res);

      expect(Tasks.create.called).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].success).to.be.true;
      expect(res.json.args[0][0].data).to.deep.equal({ id: 1, title: req.body.title, description: req.body.description });
    });

    it("should return an error with status 404 if there is an error", async () => {
      const req = {
        body: {
          title: "Task Title",
          description: "Task Description",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const error = new Error("Test Error");

      Tasks.create = sinon.stub().throws(error);

      await createTask(req, res);

      expect(Tasks.create.called).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });
  });

  describe("updateTask", () => {
    it("should update the task with success status", async () => {
      const req = {
        body: {
          title: "Updated Task Title",
          description: "Updated Task Description",
        },
        params: {
          id: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      Tasks.update = sinon.stub().resolves();

      await updateTask(req, res);

      expect(Tasks.update.calledWith({ title: req.body.title, description: req.body.description }, { where: { id: req.params.id } })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].success).to.be.true;
      expect(res.json.args[0][0].data).to.deep.equal({ title: req.body.title, description: req.body.description });
    });

    it("should return an error with status 404 if there is an error", async () => {
      const req = {
        body: {
          title: "Updated Task Title",
          description: "Updated Task Description",
        },
        params: {
          id: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const error = new Error("Test Error");

      Tasks.update = sinon.stub().throws(error);

      await updateTask(req, res);

      expect(Tasks.update.calledWith({ title: req.body.title, description: req.body.description }, { where: { id: req.params.id } })).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });
  });

  describe("deleteTask", () => {
    it("should delete the task with success status", async () => {
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      Tasks.destroy = sinon.stub().resolves();

      await deleteTask(req, res);

      expect(Tasks.destroy.calledWith({ where: { id: req.params.id } })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].success).to.be.true;
      expect(res.json.args[0][0].message).to.equal("Task deleted successfully");
    });

    it("should return an error with status 404 if there is an error", async () => {
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const error = new Error("Test Error");

      Tasks.destroy = sinon.stub().throws(error);

      await deleteTask(req, res);

      expect(Tasks.destroy.calledWith({ where: { id: req.params.id } })).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.called).to.be.true;
      expect(res.json.args[0][0].Error).to.equal(error.message);
    });
  });
});