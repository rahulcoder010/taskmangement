// Unit Test Cases for user.js

// Mocks
const req = { body: {} };
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// Mock Models
const Users = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findByPk: jest.fn(),
};

// Mock Joi
const Joi = {
  object: jest.fn(() => ({
    keys: jest.fn(() => ({
      required: jest.fn().mockReturnThis(),
      email: jest.fn().mockReturnThis(),
      min: jest.fn().mockReturnThis(),
    })),
  })),
  string: jest.fn(() => ({
    required: jest.fn().mockReturnThis(),
    email: jest.fn().mockReturnThis(),
    min: jest.fn().mockReturnThis(),
  })),
  validateAsync: jest.fn(),
};

// Mock user object
const user = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password: "password",
  validPassword: jest.fn(),
  getSignedJwtToken: jest.fn(() => "token"),
  save: jest.fn(),
};

// Mock Token Response
jest.mock("../models/index.js", () => ({
  User: Users,
}));

// Mock sendTokenResponse function
jest.mock("./sendTokenResponse.js", () => ({
  sendTokenResponse: jest.fn(),
}));

// Import the functions to be tested
const {
  allUsers,
  registerUser,
  login,
  updateUser,
  updatePassword,
  logout,
} = require("./user.js");

// Test allUsers function
describe("allUsers", () => {
  it("should return all users with a success status", async () => {
    Users.findAll.mockResolvedValueOnce([
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ]);

    await allUsers(req, res);

    expect(Users.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 2,
      data: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ],
    });
  });

  it("should return an error status if there is an error", async () => {
    Users.findAll.mockRejectedValueOnce(new Error("Database error"));

    await allUsers(req, res);

    expect(Users.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Test registerUser function
describe("registerUser", () => {
  beforeEach(() => {
    req.body = {
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    };
  });

  it("should create a new user and return success status", async () => {
    Users.findOne.mockResolvedValueOnce(null);
    Users.create.mockResolvedValueOnce(user);

    await registerUser(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(Users.create).toHaveBeenCalledWith({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: user,
      message: "User created successfully",
    });
  });

  it("should return an error status if the user already exists", async () => {
    Users.findOne.mockResolvedValueOnce(user);

    await registerUser(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: `User ${user.name} already registered!`,
    });
  });

  it("should return an error status if there is an error", async () => {
    Users.findOne.mockRejectedValueOnce(new Error("Database error"));

    await registerUser(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
      message: "Failed to create user",
    });
  });
});

// Test login function
describe("login", () => {
  beforeEach(() => {
    req.body = {
      email: "john@example.com",
      password: "password",
    };
  });

  it("should return an error status if the email or password is not provided", async () => {
    req.body = {};

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Please provide an email and password",
      message: "Authentication failed",
    });
  });

  it("should return an error status if the user does not exist", async () => {
    Users.findOne.mockResolvedValueOnce(null);

    await login(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Invalid credential",
      message: "Authentication failed",
    });
  });

  it("should return an error status if the password is incorrect", async () => {
    Users.findOne.mockResolvedValueOnce(user);
    user.validPassword.mockResolvedValueOnce(false);

    await login(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Incorrect Password",
      message: "Authentication failed",
    });
  });

  it("should call sendTokenResponse if the email and password are correct", async () => {
    Users.findOne.mockResolvedValueOnce(user);
    user.validPassword.mockResolvedValueOnce(true);

    await login(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(user.validPassword).toHaveBeenCalledWith(req.body.password, user.password);
    expect(sendTokenResponse).toHaveBeenCalledWith(user, 200, res);
  });
});

// Test updateUser function
describe("updateUser", () => {
  beforeEach(() => {
    req.body = {
      name: "John Doe",
      email: "john@example.com",
    };
    req.user = { id: 1 };
  });

  it("should update the user and return success status", async () => {
    await updateUser(req, res);

    expect(Users.update).toHaveBeenCalledWith(
      { name: req.body.name, email: req.body.email },
      { where: { id: req.user.id } }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        name: req.body.name,
        email: req.body.email,
      },
      message: "User updated successfully",
    });
  });

  it("should return an error status if there is an error", async () => {
    Users.update.mockRejectedValueOnce(new Error("Database error"));

    await updateUser(req, res);

    expect(Users.update).toHaveBeenCalledWith(
      { name: req.body.name, email: req.body.email },
      { where: { id: req.user.id } }
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
      message: "Failed to update user",
    });
  });
});

// Test updatePassword function
describe("updatePassword", () => {
  beforeEach(() => {
    req.body = {
      currentPassword: "password",
      newPassword: "newpassword",
    };
    req.user = { id: 1 };
  });

  it("should update the user's password and return success status", async () => {
    Users.findByPk.mockResolvedValueOnce(user);
    user.matchPassword.mockResolvedValueOnce(true);

    await updatePassword(req, res);

    expect(Users.findByPk).toHaveBeenCalledWith(req.user.id);
    expect(user.matchPassword).toHaveBeenCalledWith(req.body.currentPassword);
    expect(user.save).toHaveBeenCalled();
    expect(user.password).toBe(req.body.newPassword);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      newPassword: user.password,
      message: "Password updated successfully",
    });
  });

  it("should return an error status if the user does not exist", async () => {
    Users.findByPk.mockResolvedValueOnce(null);

    await updatePassword(req, res);

    expect(Users.findByPk).toHaveBeenCalledWith(req.user.id);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Invalid credential",
      message: "Failed to update password",
    });
  });

  it("should return an error status if the current password is incorrect", async () => {
    Users.findByPk.mockResolvedValueOnce(user);
    user.matchPassword.mockResolvedValueOnce(false);

    await updatePassword(req, res);

    expect(Users.findByPk).toHaveBeenCalledWith(req.user.id);
    expect(user.matchPassword).toHaveBeenCalledWith(req.body.currentPassword);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "CurrentPassword is incorrect",
      message: "Failed to update password",
    });
  });

  it("should return an error status if there is an error", async () => {
    Users.findByPk.mockRejectedValueOnce(new Error("Database error"));

    await updatePassword(req, res);

    expect(Users.findByPk).toHaveBeenCalledWith(req.user.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
      message: "Failed to update password",
    });
  });
});

// Test logout function
describe("logout", () => {
  beforeEach(() => {
    req.user = { token: "token" };
  });

  it("should logout the user and return success status", async () => {
    Users.findOne.mockResolvedValueOnce({ token: "token" });

    await logout(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ where: { token: req.user.token } });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: `logout User ${user.name} successfully!`,
      message: "Logout successful",
    });
  });

  it("should return an error status if the user does not exist", async () => {
    Users.findOne.mockResolvedValueOnce(null);

    await logout(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ where: { token: req.user.token } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "please login again!",
      message: "Logout failed",
    });
  });

  it("should return an error status if there is an error", async () => {
    Users.findOne.mockRejectedValueOnce(new Error("Database error"));

    await logout(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ where: { token: req.user.token } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
      message: "Logout failed",
    });
  });
});