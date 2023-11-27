const Joi = require("joi");
const db = require("../models/index.js");
const Users = db.User;

// UNIT TEST CASES FOR allUsers FUNCTION
test("should return all users", async () => {
  const findAll = jest.spyOn(Users, "findAll").mockResolvedValue([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);

  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.allUsers(req, res);

  expect(findAll).toHaveBeenCalled();
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

test("should return error when allUsers function fails", async () => {
  const findAll = jest.spyOn(Users, "findAll").mockRejectedValue(new Error("Database Connection Error"));

  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.allUsers(req, res);

  expect(findAll).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "Database Connection Error",
  });
});



// UNIT TEST CASES FOR registerUser FUNCTION
test("should create and return user with valid data", async () => {
  const create = jest.spyOn(Users, "create").mockResolvedValue({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password",
  });

  const req = {
    body: {
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.registerUser(req, res);

  expect(create).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    data: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    },
    message: "User created successfully",
  });
});

test("should return error when user already exists", async () => {
  const findOne = jest.spyOn(Users, "findOne").mockResolvedValue({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password",
  });

  const req = {
    body: {
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.registerUser(req, res);

  expect(findOne).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "User John Doe already registered!"
  });
});

test("should return error when registerUser function fails", async () => {
  const create = jest.spyOn(Users, "create").mockRejectedValue(new Error("Database Connection Error"));

  const req = {
    body: {
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.registerUser(req, res);

  expect(create).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "Database Connection Error",
    message: "Failed to create user",
  });
});



// UNIT TEST CASES FOR login FUNCTION
test("should login and return token with valid credentials", async () => {
  const findOne = jest.spyOn(Users, "findOne").mockResolvedValue({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password",
    validPassword: jest.fn().mockResolvedValue(true),
    getSignedJwtToken: jest.fn().mockReturnValue("token"),
  });

  const req = {
    body: {
      email: "john@example.com",
      password: "password",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.login(req, res);

  expect(findOne).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    token: "token",
    user: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    },
    message: "Login successful",
  });
});

test("should return error when email or password is not provided", async () => {
  const req = {
    body: {
      email: "",
      password: "password",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "Please provide an email and password",
    message: "Authentication failed",
  });
});

test("should return error when user with given email is not found", async () => {
  const findOne = jest.spyOn(Users, "findOne").mockResolvedValue(null);

  const req = {
    body: {
      email: "john@example.com",
      password: "password",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.login(req, res);

  expect(findOne).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "Invalid credential",
    message: "Authentication failed",
  });
});

test("should return error when password is incorrect", async () => {
  const findOne = jest.spyOn(Users, "findOne").mockResolvedValue({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password",
    validPassword: jest.fn().mockResolvedValue(false),
  });

  const req = {
    body: {
      email: "john@example.com",
      password: "wrongpassword",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.login(req, res);

  expect(findOne).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "Incorrect Password",
    message: "Authentication failed",
  });
});



// UNIT TEST CASES FOR updateUser FUNCTION
test("should update user and return updated data", async () => {
  const update = jest.spyOn(Users, "update").mockResolvedValue(true);

  const req = {
    body: {
      name: "John Doe",
      email: "john@example.com",
    },
    user: {
      id: 1,
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.updateUser(req, res);

  expect(update).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    data: {
      name: "John Doe",
      email: "john@example.com",
    },
    message: "User updated successfully",
  });
});

test("should return error when updateUser function fails", async () => {
  const update = jest.spyOn(Users, "update").mockRejectedValue(new Error("Database Connection Error"));

  const req = {
    body: {
      name: "",
      email: "john@example.com",
    },
    user: {
      id: 1,
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.updateUser(req, res);

  expect(update).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "Database Connection Error",
    message: "Failed to update user",
  });
});



// UNIT TEST CASES FOR updatePassword FUNCTION
test("should update password and return updated password", async () => {
  const findByPk = jest.spyOn(Users, "findByPk").mockResolvedValue({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "oldpassword",
    matchPassword: jest.fn().mockResolvedValue(true),
    save: jest.fn(),
  });

  const req = {
    body: {
      currentPassword: "oldpassword",
      newPassword: "newpassword",
    },
    user: {
      id: 1,
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.updatePassword(req, res);

  expect(findByPk).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    newPassword: "newpassword",
    message: "Password updated successfully",
  });
});

test("should return error when user is not found", async () => {
  const findByPk = jest.spyOn(Users, "findByPk").mockResolvedValue(null);

  const req = {
    body: {
      currentPassword: "oldpassword",
      newPassword: "newpassword",
    },
    user: {
      id: 1,
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.updatePassword(req, res);

  expect(findByPk).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "Invalid credential",
    message: "Failed to update password",
  });
});

test("should return error when current password is incorrect", async () => {
  const findByPk = jest.spyOn(Users, "findByPk").mockResolvedValue({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "oldpassword",
    matchPassword: jest.fn().mockResolvedValue(false),
  });

  const req = {
    body: {
      currentPassword: "wrongpassword",
      newPassword: "newpassword",
    },
    user: {
      id: 1,
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.updatePassword(req, res);

  expect(findByPk).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "CurrentPassword is incorrect",
    message: "Failed to update password",
  });
});

test("should return error when updatePassword function fails", async () => {
  const findByPk = jest.spyOn(Users, "findByPk").mockRejectedValue(new Error("Database Connection Error"));

  const req = {
    body: {
      currentPassword: "oldpassword",
      newPassword: "newpassword",
    },
    user: {
      id: 1,
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.updatePassword(req, res);

  expect(findByPk).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "Database Connection Error",
    message: "Failed to update password",
  });
});



// UNIT TEST CASES FOR logout FUNCTION
test("should logout user and return success message", async () => {
  const findOne = jest.spyOn(Users, "findOne").mockResolvedValue({
    name: "John Doe",
    token: "token"
  });
  const save = jest.fn();

  const req = {
    user: {
      token: "token",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.logout(req, res);

  expect(findOne).toHaveBeenCalled();
  expect(save).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    message: "logout User John Doe successfully!",
  });
});

test("should return error when user token is not found", async () => {
  const findOne = jest.spyOn(Users, "findOne").mockResolvedValue(null);

  const req = {
    user: {
      token: "token",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.logout(req, res);

  expect(findOne).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "please login again!",
    message: "Logout failed",
  });
});

test("should return error when logout function fails", async () => {
  const findOne = jest.spyOn(Users, "findOne").mockRejectedValue(new Error("Database Connection Error"));

  const req = {
    user: {
      token: "token",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await exports.logout(req, res);

  expect(findOne).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    Error: "Database Connection Error",
    message: "Logout failed",
  });
});