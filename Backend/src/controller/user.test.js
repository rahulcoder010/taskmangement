// Test: allUsers
describe("allUsers", () => {
  it("should return all users", async () => {
    // Mock Users.findAll method
    Users.findAll = jest.fn().mockReturnValue([
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ]);

    // Mock res.status and res.json methods
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await allUsers({}, res);

    // Check that the response is correct
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      success: true,
      count: 2,
      data: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ],
    });
  });
});

// Test: registerUser
describe("registerUser", () => {
  it("should register a new user", async () => {
    // Mock req.body and req.user objects
    const req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      },
    };

    // Mock UsersController.create method
    Users.create = jest.fn().mockReturnValue({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    // Mock res.status and res.json methods
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await registerUser(req, res, {});

    // Check that the response is correct
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      success: true,
      data: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      },
      message: "User created successfully",
    });
  });

  it("should return an error if user already exists", async () => {
    // Mock req.body and req.user objects
    const req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      },
    };

    // Mock Users.findOne method
    Users.findOne = jest.fn().mockReturnValue({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    // Mock res.status and res.json methods
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await registerUser(req, res, {});

    // Check that the response is correct
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      success: false,
      Error: "User John Doe already registered!",
    });
  });

  // Add more test cases as needed
});

// Test: login
describe("login", () => {
  it("should authenticate user with valid credentials", async () => {
    // Mock req.body object
    const req = {
      body: {
        email: "john@example.com",
        password: "password123",
      },
    };

    // Mock Users.findOne method
    Users.findOne = jest.fn().mockReturnValue({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      validPassword: jest.fn().mockReturnValue(true),
    });

    // Mock sendTokenResponse method
    sendTokenResponse = jest.fn();

    // Mock res.status and res.json methods
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await login(req, res, {});

    // Check that the response is correct
    expect(res.status).toBeCalledWith(200);
    expect(sendTokenResponse).toBeCalledWith(
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        validPassword: expect.any(Function),
      },
      200,
      res
    );
  });

  // Add more test cases as needed
});

// Test: updateUser
describe("updateUser", () => {
  it("should update the user", async () => {
    // Mock req.body and req.user objects
    const req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
      },
      user: {
        id: 1,
      },
    };

    // Mock Users.update method
    Users.update = jest.fn();

    // Mock res.status and res.json methods
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await updateUser(req, res, {});

    // Check that the response is correct
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      success: true,
      data: {
        name: "John Doe",
        email: "john@example.com",
      },
      message: "User updated successfully",
    });
  });

  // Add more test cases as needed
});

// Test: updatePassword
describe("updatePassword", () => {
  it("should update the user's password", async () => {
    // Mock req.body and req.user objects
    const req = {
      body: {
        currentPassword: "oldpassword",
        newPassword: "newpassword",
      },
      user: {
        id: 1,
      },
    };

    // Mock Users.findByPk and Users.update methods
    Users.findByPk = jest.fn().mockReturnValue({
      id: 1,
      password: "oldpassword",
      matchPassword: jest.fn().mockReturnValue(true),
      save: jest.fn(),
    });
    Users.update = jest.fn();

    // Mock res.status and res.json methods
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await updatePassword(req, res, {});

    // Check that the response is correct
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      success: true,
      newPassword: "newpassword",
      message: "Password updated successfully",
    });
  });

  // Add more test cases as needed
});

// Test: logout
describe("logout", () => {
  it("should logout the user", async () => {
    // Mock req.user object
    const req = {
      user: {
        token: "abc123",
      },
    };

    // Mock Users.findOne and Users.save methods
    Users.findOne = jest.fn().mockReturnValue({
      token: "abc123",
      save: jest.fn(),
    });

    // Mock res.status and res.json methods
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await logout(req, res);

    // Check that the response is correct
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      success: true,
      message: "logout User null successfully!",
    });
  });

  it("should return an error if user is not found", async () => {
    // Mock req.user object
    const req = {
      user: {
        token: "abc123",
      },
    };

    // Mock Users.findOne method
    Users.findOne = jest.fn().mockReturnValue(null);

    // Mock res.status and res.json methods
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await logout(req, res);

    // Check that the response is correct
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      success: false,
      Error: "please login again!",
    });
  });

  // Add more test cases as needed
});