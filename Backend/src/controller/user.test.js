// Unit test cases for user.js

// 1. Test case for allUsers function
test("Should return all users", () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  Users.findAll = jest.fn().mockResolvedValue([
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
  ]);

  return allUsers(req, res).then(() => {
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 2,
      data: [{ id: 1, name: "John" }, { id: 2, name: "Jane" }]
    });
  });
});

// 2. Test case for registerUser function
test("Should register a new user", () => {
  const req = {
    body: {
      name: "John",
      email: "john@example.com",
      password: "123456"
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const blogSchema = {
    validateAsync: jest.fn().mockResolvedValue(req.body)
  };
  Joi.object = jest.fn().mockReturnValue(blogSchema);
  Users.findOne = jest.fn().mockResolvedValue(null);
  Users.create = jest.fn().mockResolvedValue({
    id: 1,
    name: "John",
    email: "john@example.com",
    password: "123456"
  });

  return registerUser(req, res).then(() => {
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 1,
        name: "John",
        email: "john@example.com",
        password: "123456"
      },
      message: "User created successfully"
    });
  });
});

// 3. Test case for login function
test("Should login a user", () => {
  const req = {
    body: {
      email: "john@example.com",
      password: "123456"
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  Users.findOne = jest.fn().mockResolvedValue({
    id: 1,
    name: "John",
    email: "john@example.com",
    password: "123456",
    validPassword: jest.fn().mockResolvedValue(true),
    getSignedJwtToken: jest.fn().mockReturnValue("token")
  });

  return login(req, res).then(() => {
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: "token",
      user: {
        id: 1,
        name: "John",
        email: "john@example.com",
        password: "123456"
      },
      message: "Login successful"
    });
  });
});

// 4. Test case for updateUser function
test("Should update a user", () => {
  const req = {
    body: {
      name: "Jane",
      email: "jane@example.com"
    },
    user: {
      id: 1
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  Users.update = jest.fn().mockResolvedValue(true);

  return updateUser(req, res).then(() => {
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        name: "Jane",
        email: "jane@example.com"
      },
      message: "User updated successfully"
    });
  });
});

// 5. Test case for updatePassword function
test("Should update user password", () => {
  const req = {
    body: {
      currentPassword: "oldpassword",
      newPassword: "newpassword"
    },
    user: {
      id: 1
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  Users.findByPk = jest.fn().mockResolvedValue({
    id: 1,
    matchPassword: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true)
  });

  return updatePassword(req, res).then(() => {
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      newPassword: "newpassword",
      message: "Password updated successfully"
    });
  });
});

// 6. Test case for logout function
test("Should logout a user", () => {
  const req = {
    user: {
      token: "token"
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  Users.findOne = jest.fn().mockResolvedValue({
    token: "token",
    save: jest.fn().mockResolvedValue(true)
  });

  return logout(req, res).then(() => {
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "logout User undefined successfully!"
    });
  });
});