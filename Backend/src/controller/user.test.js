// UNIT TESTS

// Importing necessary libraries
const jest = require("jest");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

// Importing the user controller
const userController = require("../controller/user");

// Mocking the user model
const Users = require("../models/index").User;

// Mocking the request and response objects
const req = {};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// Mocking the JWT token
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mockToken"),
}));

// Function to test the 'allUsers' function
describe("allUsers", () => {
  it("should return all users with success status code and count", async () => {
    // Mocking the findAll function of the User model
    Users.findAll = jest.fn().mockResolvedValue([
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ]);

    // Calling the function
    await userController.allUsers(req, res);

    // Expecting the response to have success status code, count and data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 2,
      data: [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ],
    });
  });

  it("should return error status code and message if an error occurs", async () => {
    // Mocking the findAll function of the User model to throw an error
    Users.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    // Calling the function
    await userController.allUsers(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Function to test the 'registerUser' function
describe("registerUser", () => {
  it("should register a new user with success status code and data", async () => {
    // Mocking the validateAsync function of the blogSchema object
    const mockValidateAsync = jest.fn().mockResolvedValue({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    // Mocking the findOne function of the Users model
    Users.findOne = jest.fn().mockResolvedValue(null);

    // Mocking the create function of the Users model
    Users.create = jest.fn().mockResolvedValue({
      name: "Test User",
      email: "test@example.com",
    });

    // Mocking the request body
    req.body = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    // Mocking the blogSchema object
    jest.mock("joi", () => ({
      object: jest.fn(() => ({
        string: jest.fn().mockReturnThis(),
        required: jest.fn().mockReturnThis(),
        email: jest.fn(() => ({
          tlds: jest.fn().mockReturnThis(),
          required: jest.fn().mockReturnThis(),
        })),
        password: jest.fn().mockReturnThis(),
        min: jest.fn().mockReturnThis(),
        validateAsync: mockValidateAsync,
      })),
    }));

    // Calling the function
    await userController.registerUser(req, res);

    // Expecting the response to have success status code, data and message
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        name: "Test User",
        email: "test@example.com",
      },
      message: "User created successfully",
    });
  });

  it("should return error status code and message if user already exists", async () => {
    // Mocking the findOne function of the Users model to return a user object
    Users.findOne = jest.fn().mockResolvedValue({
      name: "Existing User",
      email: "existing@example.com",
    });

    // Mocking the request body
    req.body = {
      name: "Existing User",
      email: "existing@example.com",
      password: "password123",
    };

    // Calling the function
    await userController.registerUser(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "User Existing User already registered!",
    });
  });

  it("should return error status code and message if an error occurs", async () => {
    // Mocking the findOne function of the Users model to throw an error
    Users.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

    // Mocking the request body
    req.body = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    // Calling the function
    await userController.registerUser(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
      message: "Failed to create user",
    });
  });
});

// Function to test the 'login' function
describe("login", () => {
  it("should log in a user with success status code and token", async () => {
    // Mocking the findOne function of the Users model
    Users.findOne = jest.fn().mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      validPassword: jest.fn().mockReturnValue(true),
    });

    // Mocking the request body
    req.body = {
      email: "test@example.com",
      password: "password123",
    };

    // Calling the function
    await userController.login(req, res);

    // Expecting the response to have success status code, token, user, and message
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: "mockToken",
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        validPassword: expect.any(Function),
      },
      message: "Login successful",
    });
  });

  it("should return error status code and message if email or password is missing", async () => {
    // Calling the function with empty request body
    await userController.login(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Please provide an email and password",
      message: "Authentication failed",
    });
  });

  it("should return error status code and message if user does not exist", async () => {
    // Mocking the findOne function of the Users model to return null
    Users.findOne = jest.fn().mockResolvedValue(null);

    // Mocking the request body
    req.body = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    // Calling the function
    await userController.login(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Invalid credential",
      message: "Authentication failed",
    });
  });

  it("should return error status code and message if password is incorrect", async () => {
    // Mocking the findOne function of the Users model
    Users.findOne = jest.fn().mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      validPassword: jest.fn().mockReturnValue(false),
    });

    // Mocking the request body
    req.body = {
      email: "test@example.com",
      password: "incorrectpassword",
    };

    // Calling the function
    await userController.login(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Incorrect Password",
      message: "Authentication failed",
    });
  });
});

// Function to test the 'updateUser' function
describe("updateUser", () => {
  it("should update a user with success status code and updated data", async () => {
    // Mocking the update function of the Users model
    Users.update = jest.fn().mockResolvedValue([1]);

    // Mocking the request body
    req.body = {
      name: "Updated User",
      email: "updated@example.com",
    };

    // Mocking the user ID from the request object
    req.user = {
      id: 1,
    };

    // Calling the function
    await userController.updateUser(req, res);

    // Expecting the response to have success status code, updated data, and message
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        name: "Updated User",
        email: "updated@example.com",
      },
      message: "User updated successfully",
    });
  });

  it("should return error status code and message if an error occurs", async () => {
    // Mocking the update function of the Users model to throw an error
    Users.update = jest.fn().mockRejectedValue(new Error("Database error"));

    // Mocking the request body
    req.body = {
      name: "Updated User",
      email: "updated@example.com",
    };

    // Mocking the user ID from the request object
    req.user = {
      id: 1,
    };

    // Calling the function
    await userController.updateUser(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
      message: "Failed to update user",
    });
  });
});

// Function to test the 'updatePassword' function
describe("updatePassword", () => {
  it("should update a user's password with success status code and updated password", async () => {
    // Mocking the findByPk function of the Users model
    Users.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      matchPassword: jest.fn().mockReturnValue(true),
      save: jest.fn(),
    });

    // Mocking the request body
    req.body = {
      currentPassword: "password123",
      newPassword: "newpassword123",
    };

    // Mocking the user ID from the request object
    req.user = {
      id: 1,
    };

    // Calling the function
    await userController.updatePassword(req, res);

    // Expecting the response to have success status code, updated password, and message
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      newPassword: "newpassword123",
      message: "Password updated successfully",
    });
  });

  it("should return error status code and message if user does not exist", async () => {
    // Mocking the findByPk function of the Users model to return null
    Users.findByPk = jest.fn().mockResolvedValue(null);

    // Mocking the request body
    req.body = {
      currentPassword: "password123",
      newPassword: "newpassword123",
    };

    // Mocking the user ID from the request object
    req.user = {
      id: 1,
    };

    // Calling the function
    await userController.updatePassword(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Invalid credential",
      message: "Failed to update password",
    });
  });

  it("should return error status code and message if current password is incorrect", async () => {
    // Mocking the findByPk function of the Users model
    Users.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      matchPassword: jest.fn().mockReturnValue(false),
    });

    // Mocking the request body
    req.body = {
      currentPassword: "incorrectpassword",
      newPassword: "newpassword123",
    };

    // Mocking the user ID from the request object
    req.user = {
      id: 1,
    };

    // Calling the function
    await userController.updatePassword(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "CurrentPassword is incorrect",
      message: "Failed to update password",
    });
  });

  it("should return error status code and message if an error occurs", async () => {
    // Mocking the findByPk function of the Users model to throw an error
    Users.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Mocking the request body
    req.body = {
      currentPassword: "password123",
      newPassword: "newpassword123",
    };

    // Mocking the user ID from the request object
    req.user = {
      id: 1,
    };

    // Calling the function
    await userController.updatePassword(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
      message: "Failed to update password",
    });
  });
});

// Function to test the 'logout' function
describe("logout", () => {
  it("should log out a user with success status code and message", async () => {
    // Mocking the findOne function of the Users model
    Users.findOne = jest.fn().mockResolvedValue({
      name: "Test User",
      token: "mockToken",
      save: jest.fn(),
    });

    // Mocking the user token from the request object
    req.user = {
      token: "mockToken",
    };

    // Calling the function
    await userController.logout(req, res);

    // Expecting the response to have success status code and message
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "logout User Test User successfully!",
    });
  });

  it("should return error status code and message if user is not found", async () => {
    // Mocking the findOne function of the Users model to return null
    Users.findOne = jest.fn().mockResolvedValue(null);

    // Mocking the user token from the request object
    req.user = {
      token: "mockToken",
    };

    // Calling the function
    await userController.logout(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "please login again!",
      message: "Logout failed",
    });
  });

  it("should return error status code and message if an error occurs", async () => {
    // Mocking the findOne function of the Users model to throw an error
    Users.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

    // Mocking the user token from the request object
    req.user = {
      token: "mockToken",
    };

    // Calling the function
    await userController.logout(req, res);

    // Expecting the response to have error status code and error message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
      message: "Logout failed",
    });
  });
});

// Function to test the 'sendTokenResponse' function
describe("sendTokenResponse", () => {
  it("should send a token response with success status code, token, user, and message", async () => {
    // Mocking the getSignedJwtToken function of the user object
    const mockGetSignedJwtToken = jest.fn().mockReturnValue("mockToken");

    // Mocking the update function of the Users model
    Users.update = jest.fn();

    // Mocking the user ID and user object
    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      getSignedJwtToken: mockGetSignedJwtToken,
    };

    // Calling the function
    await userController.sendTokenResponse(user, 200, res);

    // Expecting the response to have success status code, token, user, and message
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: "mockToken",
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        getSignedJwtToken: expect.any(Function),
      },
      message: "Login successful",
    });

    // Expecting the update function of the Users model to be called
    expect(Users.update).toHaveBeenCalledWith(
      { token: "mockToken" },
      { where: { id: 1 } }
    );
  });
});