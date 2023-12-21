const Joi = require("joi");
const db = require("../models/index.js");
const Users = db.User;

// UNIT TEST CASES for allUsers
describe("allUsers", () => {
  it("should return all users with status code 200", async () => {
    // Mocking Users.findAll function
    Users.findAll = jest.fn().mockResolvedValue([
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ]);

    const expectedResponse = {
      success: true,
      count: 2,
      data: [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ],
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await allUsers({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 404 if there is an error", async () => {
    // Mocking Users.findAll function to throw an error
    Users.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    const expectedResponse = {
      success: false,
      Error: "Database error",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await allUsers({}, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});


// UNIT TEST CASES for registerUser
describe("registerUser", () => {
  it("should create a new user and return success message with status code 201 if user does not exist", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
      },
    };

    // Mocking Users.findOne function to return null, indicating user does not exist
    Users.findOne = jest.fn().mockResolvedValue(null);

    // Mocking Users.create function to return a new user
    Users.create = jest.fn().mockResolvedValue({
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
    });

    const expectedResponse = {
      success: true,
      data: { id: 1, name: "John Doe", email: "johndoe@example.com" },
      message: "User created successfully",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 400 if user already exists", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
      },
    };

    // Mocking Users.findOne function to return an existing user
    Users.findOne = jest.fn().mockResolvedValue({
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
    });

    const expectedResponse = {
      success: false,
      Error: "User John Doe already registered!",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 404 if there is an error", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
      },
    };

    // Mocking Users.findOne function to return an error
    Users.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

    const expectedResponse = {
      success: false,
      Error: "Database error",
      message: "Failed to create user",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});


// UNIT TEST CASES for login
describe("login", () => {
  it("should authenticate user and send token response with status code 200 if credentials are correct", async () => {
    const req = {
      body: {
        email: "johndoe@example.com",
        password: "password",
      },
    };

    const user = {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      password: "hashedPassword",
      validPassword: jest.fn().mockResolvedValue(true),
    };

    // Mocking Users.findOne function to return the user
    Users.findOne = jest.fn().mockResolvedValue(user);

    const expectedResponse = {
      success: true,
      token: "jwtToken",
      user: { id: 1, name: "John Doe", email: "johndoe@example.com" },
      message: "Login successful",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 400 if email or password is missing", async () => {
    const req = {
      body: {},
    };

    const expectedResponse = {
      success: false,
      Error: "Please provide an email and password",
      message: "Authentication failed",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 401 if user does not exist", async () => {
    const req = {
      body: {
        email: "johndoe@example.com",
        password: "password",
      },
    };

    // Mocking Users.findOne function to return null, indicating user does not exist
    Users.findOne = jest.fn().mockResolvedValue(null);

    const expectedResponse = {
      success: false,
      Error: "Invalid credential",
      message: "Authentication failed",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 401 if password is incorrect", async () => {
    const req = {
      body: {
        email: "johndoe@example.com",
        password: "password",
      },
    };

    const user = {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      password: "hashedPassword",
      validPassword: jest.fn().mockResolvedValue(false),
    };

    // Mocking Users.findOne function to return the user
    Users.findOne = jest.fn().mockResolvedValue(user);

    const expectedResponse = {
      success: false,
      Error: "Incorrect Password",
      message: "Authentication failed",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 404 if there is an error", async () => {
    const req = {
      body: {
        email: "johndoe@example.com",
        password: "password",
      },
    };

    // Mocking Users.findOne function to return an error
    Users.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

    const expectedResponse = {
      success: false,
      Error: "Database error",
      message: "Authentication failed",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});


// UNIT TEST CASES for updateUser
describe("updateUser", () => {
  it("should update user and return updated user data with status code 200", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
      },
      user: {
        id: 1,
      },
    };

    // Mocking Users.update function
    Users.update = jest.fn().mockResolvedValue(true);

    const expectedResponse = {
      success: true,
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
      },
      message: "User updated successfully",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 404 if there is an error", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
      },
      user: {
        id: 1,
      },
    };

    // Mocking Users.update function to throw an error
    Users.update = jest.fn().mockRejectedValue(new Error("Database error"));

    const expectedResponse = {
      success: false,
      Error: "Database error",
      message: "Failed to update user",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});


// UNIT TEST CASES for updatePassword
describe("updatePassword", () => {
  it("should update user password and return updated password with status code 201 if current password is correct", async () => {
    const req = {
      body: {
        currentPassword: "currentPassword",
        newPassword: "newPassword",
      },
      user: {
        id: 1,
      },
    };

    const user = {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      matchPassword: jest.fn().mockResolvedValue(true),
      save: jest.fn(),
    };

    // Mocking Users.findByPk function to return the user
    Users.findByPk = jest.fn().mockResolvedValue(user);

    const expectedResponse = {
      success: true,
      newPassword: "newPassword",
      message: "Password updated successfully",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updatePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
    expect(user.password).toBe("newPassword");
    expect(user.save).toHaveBeenCalled();
  });

  it("should return error with status code 401 if user does not exist", async () => {
    const req = {
      body: {
        currentPassword: "currentPassword",
        newPassword: "newPassword",
      },
      user: {
        id: 1,
      },
    };

    // Mocking Users.findByPk function to return null, indicating user does not exist
    Users.findByPk = jest.fn().mockResolvedValue(null);

    const expectedResponse = {
      success: false,
      Error: "Invalid credential",
      message: "Failed to update password",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updatePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 401 if current password is incorrect", async () => {
    const req = {
      body: {
        currentPassword: "currentPassword",
        newPassword: "newPassword",
      },
      user: {
        id: 1,
      },
    };

    const user = {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      matchPassword: jest.fn().mockResolvedValue(false),
    };

    // Mocking Users.findByPk function to return the user
    Users.findByPk = jest.fn().mockResolvedValue(user);

    const expectedResponse = {
      success: false,
      Error: "CurrentPassword is incorrect",
      message: "Failed to update password",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updatePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 404 if there is an error", async () => {
    const req = {
      body: {
        currentPassword: "currentPassword",
        newPassword: "newPassword",
      },
      user: {
        id: 1,
      },
    };

    // Mocking Users.findByPk function to return an error
    Users.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    const expectedResponse = {
      success: false,
      Error: "Database error",
      message: "Failed to update password",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updatePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});


// UNIT TEST CASES for logout
describe("logout", () => {
  it("should logout user and return success message with status code 201 if user token is valid", async () => {
    const req = {
      user: {
        token: "validToken",
      },
    };

    const finderUser = {
      token: "validToken",
      name: "John Doe",
      save: jest.fn(),
    };

    // Mocking Users.findOne function to return the user
    Users.findOne = jest.fn().mockResolvedValue(finderUser);

    const expectedResponse = {
      success: true,
      message: `logout User John Doe successfully!`,
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
    expect(finderUser.token).toBeNull();
    expect(finderUser.save).toHaveBeenCalled();
  });

  it("should return error with status code 400 if user token is not valid", async () => {
    const req = {
      user: {
        token: "invalidToken",
      },
    };

    // Mocking Users.findOne function to return null, indicating token is not valid
    Users.findOne = jest.fn().mockResolvedValue(null);

    const expectedResponse = {
      success: false,
      Error: "please login again!",
      message: "Logout failed",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should return error with status code 404 if there is an error", async () => {
    const req = {
      user: {
        token: "validToken",
      },
    };

    // Mocking Users.findOne function to return an error
    Users.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

    const expectedResponse = {
      success: false,
      Error: "Database error",
      message: "Logout failed",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});


// Utility function to create token and send response
const sendTokenResponse = async (user, statusCode, res) => {
  const token = user.getSignedJwtToken(user.id);
  res.status(statusCode).json({
    success: true,
    token,
    user,
    message: "Login successful",
  });
  await Users.update({ token }, { where: { id: user.id } });
};