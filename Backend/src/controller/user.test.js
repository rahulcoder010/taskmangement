// Test cases for allUsers

// Test case 1: Successful retrieval of all users
test("Retrieve all users", () => {
  // Mock data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];

  // Mock findAll function
  Users.findAll = jest.fn().mockResolvedValue(users);

  // Request object
  const req = {};
  // Response object
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // Call allUsers function
  userController.allUsers(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(200);
  expect(res.json).toBeCalledWith({
    success: true,
    count: users.length,
    data: users,
  });
});

// Test case 2: Error in retrieving all users
test("Error in retrieving all users", () => {
  // Mock error
  const error = new Error("Failed to retrieve users");

  // Mock findAll function to throw an error
  Users.findAll = jest.fn().mockRejectedValue(error);

  // Request object
  const req = {};
  // Response object
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // Call allUsers function
  userController.allUsers(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(404);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: error.message,
  });
});


// Test cases for registerUser

// Test case 1: Successful registration of user
test("Register user - success", async () => {
  // Mock request body
  const req = {
    body: {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    },
  };

  // Mock schema validation
  const validateAsyncMock = jest.fn().mockResolvedValue(req.body);
  jest.mock("joi", () => ({
    object: jest.fn().mockReturnThis(),
    string: jest.fn().mockReturnThis(),
    required: jest.fn().mockReturnThis(),
    email: jest.fn().mockReturnThis(),
    min: jest.fn().mockReturnThis(),
    validateAsync: validateAsyncMock,
  }));

  // Mock findOne function
  Users.findOne = jest.fn().mockResolvedValue(null);

  // Mock create function
  Users.create = jest.fn().mockResolvedValue({ id: 1, ...req.body });

  // Response object
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // Call registerUser function
  await userController.registerUser(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(201);
  expect(res.json).toBeCalledWith({
    success: true,
    data: { id: 1, ...req.body },
    message: "User created successfully",
  });
});

// Test case 2: User already exists
test("Register user - user already exists", async () => {
  // Mock request body
  const req = {
    body: {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    },
  };

  // Mock schema validation
  const validateAsyncMock = jest.fn().mockResolvedValue(req.body);
  jest.mock("joi", () => ({
    object: jest.fn().mockReturnThis(),
    string: jest.fn().mockReturnThis(),
    required: jest.fn().mockReturnThis(),
    email: jest.fn().mockReturnThis(),
    min: jest.fn().mockReturnThis(),
    validateAsync: validateAsyncMock,
  }));

  // Mock findOne function to return a user
  const user = { id: 1, name: "John Doe", email: "john@example.com" };
  Users.findOne = jest.fn().mockResolvedValue(user);

  // Response object
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // Call registerUser function
  await userController.registerUser(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: `User ${user.name} already registered!`,
  });
});

// Test case 3: Error in registering user
test("Register user - error", async () => {
  // Mock request body
  const req = {
    body: {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    },
  };

  // Mock schema validation
  const validateAsyncMock = jest.fn().mockResolvedValue(req.body);
  jest.mock("joi", () => ({
    object: jest.fn().mockReturnThis(),
    string: jest.fn().mockReturnThis(),
    required: jest.fn().mockReturnThis(),
    email: jest.fn().mockReturnThis(),
    min: jest.fn().mockReturnThis(),
    validateAsync: validateAsyncMock,
  }));

  // Mock findOne function to throw an error
  const error = new Error("Failed to check if user exists");
  Users.findOne = jest.fn().mockRejectedValue(error);

  // Response object
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // Call registerUser function
  await userController.registerUser(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(404);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: error.message,
    message: "Failed to create user",
  });
});


// Test cases for login

// Test case 1: Successful login
test("Login - success", async () => {
  // Mock request body
  const req = {
    body: {
      email: "john@example.com",
      password: "password123",
    },
  };

  // Mock findOne function
  const user = { id: 1, name: "John Doe", email: "john@example.com" };
  Users.findOne = jest.fn().mockResolvedValue(user);

  // Mock validPassword function to return true
  user.validPassword = jest.fn().mockResolvedValue(true);

  // Call login function
  await userController.login(req, res);

  // Check if sendTokenResponse function is called with correct values
  expect(sendTokenResponse).toBeCalledWith(user, 200, res);
});

// Test case 2: Missing email or password
test("Login - missing email or password", async () => {
  // No request body
  const req = {
    body: {},
  };

  // Call login function
  await userController.login(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: "Please provide an email and password",
    message: "Authentication failed",
  });
});

// Test case 3: User not found
test("Login - user not found", async () => {
  // Mock request body
  const req = {
    body: {
      email: "john@example.com",
      password: "password123",
    },
  };

  // Mock findOne function to return null
  Users.findOne = jest.fn().mockResolvedValue(null);

  // Call login function
  await userController.login(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(401);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: "Invalid credential",
    message: "Authentication failed",
  });
});

// Test case 4: Incorrect password
test("Login - incorrect password", async () => {
  // Mock request body
  const req = {
    body: {
      email: "john@example.com",
      password: "password123",
    },
  };

  // Mock findOne function to return a user
  const user = { id: 1, name: "John Doe", email: "john@example.com" };
  Users.findOne = jest.fn().mockResolvedValue(user);

  // Mock validPassword function to return false
  user.validPassword = jest.fn().mockResolvedValue(false);

  // Call login function
  await userController.login(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(401);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: "Incorrect Password",
    message: "Authentication failed",
  });
});


// Test cases for updateUser

// Test case 1: Successful update of user
test("Update user - success", async () => {
  // Mock request body
  const req = {
    body: {
      name: "John Doe",
      email: "john@example.com",
    },
    user: { id: 1 },
  };

  // Mock update function
  Users.update = jest.fn();

  // Call updateUser function
  await userController.updateUser(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(200);
  expect(res.json).toBeCalledWith({
    success: true,
    data: req.body,
    message: "User updated successfully",
  });
});

// Test case 2: Error in updating user
test("Update user - error", async () => {
  // Mock request body
  const req = {
    body: {
      name: "John Doe",
      email: "john@example.com",
    },
    user: { id: 1 },
  };

  // Mock update function to throw an error
  const error = new Error("Failed to update user");
  Users.update = jest.fn().mockRejectedValue(error);

  // Call updateUser function
  await userController.updateUser(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(404);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: error.message,
    message: "Failed to update user",
  });
});


// Test cases for updatePassword

// Test case 1: Successful update of password
test("Update password - success", async () => {
  // Mock request body
  const req = {
    body: {
      currentPassword: "password123",
      newPassword: "newpassword123",
    },
    user: { id: 1 },
  };

  // Mock findByPk function
  const user = { id: 1, name: "John Doe", email: "john@example.com" };
  Users.findByPk = jest.fn().mockResolvedValue(user);

  // Mock matchPassword function to return true
  user.matchPassword = jest.fn().mockResolvedValue(true);

  // Call updatePassword function
  await userController.updatePassword(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(201);
  expect(res.json).toBeCalledWith({
    success: true,
    newPassword: req.body.newPassword,
    message: "Password updated successfully",
  });
});

// Test case 2: User not found
test("Update password - user not found", async () => {
  // Mock request body
  const req = {
    body: {
      currentPassword: "password123",
      newPassword: "newpassword123",
    },
    user: { id: 1 },
  };

  // Mock findByPk function to return null
  Users.findByPk = jest.fn().mockResolvedValue(null);

  // Call updatePassword function
  await userController.updatePassword(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(401);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: "Invalid credential",
    message: "Failed to update password",
  });
});

// Test case 3: Incorrect current password
test("Update password - incorrect current password", async () => {
  // Mock request body
  const req = {
    body: {
      currentPassword: "password123",
      newPassword: "newpassword123",
    },
    user: { id: 1 },
  };

  // Mock findByPk function to return a user
  const user = { id: 1, name: "John Doe", email: "john@example.com" };
  Users.findByPk = jest.fn().mockResolvedValue(user);

  // Mock matchPassword function to return false
  user.matchPassword = jest.fn().mockResolvedValue(false);

  // Call updatePassword function
  await userController.updatePassword(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(401);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: "CurrentPassword is incorrect",
    message: "Failed to update password",
  });
});

// Test case 4: Error in updating password
test("Update password - error", async () => {
  // Mock request body
  const req = {
    body: {
      currentPassword: "password123",
      newPassword: "newpassword123",
    },
    user: { id: 1 },
  };

  // Mock findByPk function to throw an error
  const error = new Error("Failed to find user");
  Users.findByPk = jest.fn().mockRejectedValue(error);

  // Call updatePassword function
  await userController.updatePassword(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(404);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: error.message,
    message: "Failed to update password",
  });
});


// Test cases for logout

// Test case 1: Successful logout
test("Logout - success", async () => {
  // Mock request user token
  const req = {
    user: { id: 1, token: "token123" },
  };

  // Mock findOne function
  const user = { id: 1, name: "John Doe", token: "token123" };
  Users.findOne = jest.fn().mockResolvedValue(user);

  // Call logout function
  await userController.logout(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(201);
  expect(res.json).toBeCalledWith({
    success: true,
    message: `logout User ${user.name} successfully!`,
  });
});

// Test case 2: User not found
test("Logout - user not found", async () => {
  // Mock request user token
  const req = {
    user: { id: 1, token: "token123" },
  };

  // Mock findOne function to return null
  Users.findOne = jest.fn().mockResolvedValue(null);

  // Call logout function
  await userController.logout(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: "please login again!",
    message: "Logout failed",
  });
});

// Test case 3: Error in updating user token
test("Logout - error", async () => {
  // Mock request user token
  const req = {
    user: { id: 1, token: "token123" },
  };

  // Mock findOne function to throw an error
  const error = new Error("Failed to update user token");
  Users.findOne = jest.fn().mockRejectedValue(error);

  // Call logout function
  await userController.logout(req, res);

  // Check if status and json functions are called with correct values
  expect(res.status).toBeCalledWith(404);
  expect(res.json).toBeCalledWith({
    success: false,
    Error: error.message,
    message: "Logout failed",
  });
});
