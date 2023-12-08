const assert = require("chai").assert;
const sinon = require("sinon");
const userController = require("../controller/user");

// Test for allUsers function
describe("allUsers", function() {
  it("should return all users and status code 200", async function() {
    const req = {};
    const res = { status: sinon.stub(), json: sinon.stub() };
    const findAllStub = sinon.stub(Users, "findAll").returns([]);
    res.status.returnsThis();

    await userController.allUsers(req, res);

    sinon.assert.calledOnce(findAllStub);
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, {
      success: true,
      count: 0,
      data: []
    });

    findAllStub.restore();
  });

  it("should return error message and status code 404 on error", async function() {
    const req = {};
    const res = { status: sinon.stub(), json: sinon.stub() };
    const error = new Error("Database error");
    sinon.stub(Users, "findAll").throws(error);
    res.status.returnsThis();

    await userController.allUsers(req, res);

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: error.message
    });

    Users.findAll.restore();
  });
});

// Test for registerUser function
describe("registerUser", function() {
  it("should create a new user and return status code 201", async function() {
    const req = { body: { name: "John", email: "john@example.com", password: "123456" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    const createStub = sinon.stub(Users, "create").returns({
      id: 1,
      name: "John",
      email: "john@example.com"
    });
    const findOneStub = sinon.stub(Users, "findOne").returns(null);
    res.status.returnsThis();

    await userController.registerUser(req, res, {});

    sinon.assert.calledOnce(findOneStub);
    sinon.assert.calledWith(res.status, 201);
    sinon.assert.calledWith(res.json, {
      success: true,
      data: {
        id: 1,
        name: "John",
        email: "john@example.com"
      },
      message: "User created successfully"
    });

    createStub.restore();
    findOneStub.restore();
  });

  it("should return error message and status code 404 on user already exists", async function() {
    const req = { body: { name: "John", email: "john@example.com", password: "123456" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    const findOneStub = sinon.stub(Users, "findOne").returns({
      id: 1,
      name: "John",
      email: "john@example.com"
    });
    res.status.returnsThis();

    await userController.registerUser(req, res, {});

    sinon.assert.calledOnce(findOneStub);
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: "User John already registered!"
    });

    findOneStub.restore();
  });

  it("should return error message and status code 404 on validation error", async function() {
    const req = { body: { name: "John", email: "john@example.com", password: "123" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    const validateAsyncStub = sinon.stub(Joi, "validateAsync").throws(new Error("Validation error"));
    res.status.returnsThis();

    await userController.registerUser(req, res, {});

    sinon.assert.calledOnce(validateAsyncStub);
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: "Validation error",
      message: "Failed to create user"
    });

    validateAsyncStub.restore();
  });

  it("should return error message and status code 404 on database error", async function() {
    const req = { body: { name: "John", email: "john@example.com", password: "123456" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    const error = new Error("Database error");
    sinon.stub(Users, "create").throws(error);
    res.status.returnsThis();

    await userController.registerUser(req, res, {});

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: error.message,
      message: "Failed to create user"
    });

    Users.create.restore();
  });
});

// Test for login function
describe("login", function() {
  beforeEach(function() {
    this.user = {
      id: 1,
      email: "john@example.com",
      password: "123456",
      validPassword: sinon.stub()
    };
    sinon.stub(Users, "findOne").returns(this.user);
  });

  afterEach(function() {
    Users.findOne.restore();
  });

  it("should return status code 400 if email or password is missing", async function() {
    const req = { body: {} };
    const res = { status: sinon.stub(), json: sinon.stub() };
    res.status.returnsThis();

    await userController.login(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: "Please provide an email and password",
      message: "Authentication failed"
    });
  });

  it("should return status code 401 if user does not exist", async function() {
    const req = { body: { email: "test@example.com", password: "123456" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    res.status.returnsThis();

    await userController.login(req, res);

    sinon.assert.calledOnce(Users.findOne);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: "Invalid credential",
      message: "Authentication failed"
    });
  });

  it("should return status code 401 if password is incorrect", async function() {
    const req = { body: { email: "john@example.com", password: "wrongpassword" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    res.status.returnsThis();

    await userController.login(req, res);

    sinon.assert.calledOnce(Users.findOne);
    sinon.assert.calledWith(this.user.validPassword, "wrongpassword", "123456");
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: "Incorrect Password",
      message: "Authentication failed"
    });
  });

  it("should call sendTokenResponse and return status code 200 if login is successful", async function() {
    const req = { body: { email: "john@example.com", password: "123456" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    const sendTokenResponseStub = sinon.stub(userController, "sendTokenResponse");
    res.status.returnsThis();

    await userController.login(req, res);

    sinon.assert.calledOnce(Users.findOne);
    sinon.assert.calledWith(this.user.validPassword, "123456", "123456");
    sinon.assert.calledWith(sendTokenResponseStub, this.user, 200, res);
    sinon.assert.calledWith(res.status, 200);

    sendTokenResponseStub.restore();
  });
});

// Test for updateUser function
describe("updateUser", function() {
  beforeEach(function() {
    this.user = { id: 1 };
    sinon.stub(Users, "update");
  });

  afterEach(function() {
    Users.update.restore();
  });

  it("should update user and return status code 200", async function() {
    const req = { body: { name: "John", email: "john@example.com" }, user: { id: 1 } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    res.status.returnsThis();

    await userController.updateUser(req, res);

    sinon.assert.calledWith(Users.update, {
      name: "John",
      email: "john@example.com"
    }, {
      where: { id: 1 }
    });
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, {
      success: true,
      data: {
        name: "John",
        email: "john@example.com"
      },
      message: "User updated successfully"
    });
  });

  it("should return error message and status code 404 on error", async function() {
    const req = { body: { name: "John", email: "john@example.com" }, user: { id: 1 } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    const error = new Error("Database error");
    sinon.stub(Users, "update").throws(error);
    res.status.returnsThis();

    await userController.updateUser(req, res);

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: error.message,
      message: "Failed to update user"
    });

    Users.update.restore();
  });
});

// Test for updatePassword function
describe("updatePassword", function() {
  beforeEach(function() {
    this.user = {
      id: 1,
      newPassword: "",
      save: sinon.stub(),
      matchPassword: sinon.stub()
    };
    sinon.stub(Users, "findByPk").returns(this.user);
  });

  afterEach(function() {
    Users.findByPk.restore();
  });

  it("should update user password and return status code 201", async function() {
    const req = { user: { id: 1 }, body: { currentPassword: "oldpassword", newPassword: "newpassword" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    res.status.returnsThis();
    this.user.matchPassword.returns(true);

    await userController.updatePassword(req, res);

    sinon.assert.calledWith(this.user.save);
    sinon.assert.calledWith(res.status, 201);
    sinon.assert.calledWith(res.json, {
      success: true,
      newPassword: "newpassword",
      message: "Password updated successfully"
    });
  });

  it("should return error message and status code 401 if user does not exist", async function() {
    const req = { user: { id: 1 }, body: { currentPassword: "oldpassword", newPassword: "newpassword" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    res.status.returnsThis();
    Users.findByPk.returns(null);

    await userController.updatePassword(req, res);

    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: "Invalid credential",
      message: "Failed to update password"
    });
  });

  it("should return error message and status code 401 if current password is incorrect", async function() {
    const req = { user: { id: 1 }, body: { currentPassword: "wrongpassword", newPassword: "newpassword" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    res.status.returnsThis();
    this.user.matchPassword.returns(false);

    await userController.updatePassword(req, res);

    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: "CurrentPassword is incorrect",
      message: "Failed to update password"
    });
  });

  it("should return error message and status code 404 on error", async function() {
    const req = { user: { id: 1 }, body: { currentPassword: "oldpassword", newPassword: "newpassword" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    const error = new Error("Database error");
    sinon.stub(Users, "findByPk").throws(error);
    res.status.returnsThis();

    await userController.updatePassword(req, res);

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: error.message,
      message: "Failed to update password"
    });

    Users.findByPk.restore();
  });
});

// Test for logout function
describe("logout", function() {
  beforeEach(function() {
    this.user = { token: "testtoken", name: "John" };
    sinon.stub(Users, "findOne").returns(this.user);
  });

  afterEach(function() {
    Users.findOne.restore();
  });

  it("should update user token to null and return status code 201", async function() {
    const req = { user: { token: "testtoken" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    res.status.returnsThis();

    await userController.logout(req, res);

    sinon.assert.calledWith(this.user.save);
    sinon.assert.calledWith(res.status, 201);
    sinon.assert.calledWith(res.json, {
      success: true,
      message: "logout User John successfully!"
    });
  });

  it("should return error message and status code 404 if user does not exist", async function() {
    const req = { user: { token: "invalidtoken" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    res.status.returnsThis();
    Users.findOne.returns(null);

    await userController.logout(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: "please login again!",
      message: "Logout failed"
    });
  });

  it("should return error message and status code 404 on error", async function() {
    const req = { user: { token: "testtoken" } };
    const res = { status: sinon.stub(), json: sinon.stub() };
    const error = new Error("Database error");
    sinon.stub(Users, "findOne").throws(error);
    res.status.returnsThis();

    await userController.logout(req, res);

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, {
      success: false,
      Error: error.message,
      message: "Logout failed"
    });

    Users.findOne.restore();
  });
});

// Test for sendTokenResponse function
describe("sendTokenResponse", function() {
  it("should send token response with status code 200", async function() {
    const user = { id: 1, getSignedJwtToken: sinon.stub().returns("testtoken") };
    const res = { status: sinon.stub(), json: sinon.stub() };
    res.status.returnsThis();

    userController.sendTokenResponse(user, 200, res);

    sinon.assert.calledWith(user.getSignedJwtToken, 1);
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, {
      success: true,
      token: "testtoken",
      user,
      message: "Login successful"
    });
  });
});