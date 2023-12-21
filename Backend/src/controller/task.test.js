// Unit Test for task.js

const db = require("../models/index.js");
const Tasks = db.Task;

// Test for allTasks function
describe("allTasks", () => {
  it("should return all tasks", async () => {
    // Mock req and res objects
    const req = {
      user: {
        token: "XYZ123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the allTasks function
    await exports.allTasks(req, res);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: expect.any(Number),
      data: expect.any(Array),
    });
  });

  it("should return an error message if user is not logged in", async () => {
    // Mock req and res objects
    const req = {
      user: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the allTasks function
    await exports.allTasks(req, res);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Please login again!**",
    });
  });

  it("should return an error message if an exception occurs", async () => {
    // Mock req and res objects
    const req = {
      user: {
        token: "XYZ123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findAll function to throw an exception
    Tasks.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the allTasks function
    await exports.allTasks(req, res);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Test for addTask function
describe("addTask", () => {
  it("should add a new task", async () => {
    // Mock req, res, and next objects
    const req = {
      body: {
        title: "Task 1",
        description: "Description 1",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock Tasks.create function to return a task
    Tasks.create = jest.fn().mockResolvedValue({
      id: 1,
      title: "Task 1",
      description: "Description 1",
    });

    // Call the addTask function
    await exports.addTask(req, res, next);

    // Check if res.status, res.json, and next are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 1,
        title: "Task 1",
        description: "Description 1",
      },
      method: "addTask",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should return an error message if title or description is missing", async () => {
    // Mock req and res objects
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the addTask function
    await exports.addTask(req, res, next);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**title & description are required!**",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error message if title or description length is too long", async () => {
    // Mock req and res objects
    const req = {
      body: {
        title: "This is a very long title that exceeds the limit of 50 characters",
        description: "This is a very long description that exceeds the limit of 200 characters",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the addTask function
    await exports.addTask(req, res, next);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Title or description length too long!**",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error message if an exception occurs", async () => {
    // Mock req, res, and next objects
    const req = {
      body: {
        title: "Task 1",
        description: "Description 1",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock Tasks.create function to throw an exception
    Tasks.create = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the addTask function
    await exports.addTask(req, res, next);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

// Test for updateTask function
describe("updateTask", () => {
  it("should update the status of a task", async () => {
    // Mock req, res, and next objects
    const req = {
      params: {
        id: 1,
      },
      body: {
        status: "Completed",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock Tasks.findByPk function to return a task
    Tasks.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      title: "Task 1",
      description: "Description 1",
      status: "Pending",
      save: jest.fn(),
    });

    // Call the updateTask function
    await exports.updateTask(req, res, next);

    // Check if res.status, res.json, and next are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        status: "Completed",
      },
      method: "updateTask",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should return an error message if task is not found", async () => {
    // Mock req and res objects
    const req = {
      params: {
        id: 1,
      },
      body: {
        status: "Completed",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock Tasks.findByPk function to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call the updateTask function
    await exports.updateTask(req, res, next);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Task not found!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error message if status is missing", async () => {
    // Mock req and res objects
    const req = {
      params: {
        id: 1,
      },
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the updateTask function
    await exports.updateTask(req, res, next);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Please add status in body!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error message if an exception occurs", async () => {
    // Mock req, res, and next objects
    const req = {
      params: {
        id: 1,
      },
      body: {
        status: "Completed",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock Tasks.findByPk function to throw an exception
    Tasks.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the updateTask function
    await exports.updateTask(req, res, next);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

// Test for deleteTask function
describe("deleteTask", () => {
  it("should delete a task", async () => {
    // Mock req, res, and next objects
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock Tasks.findByPk function to return a task
    Tasks.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      title: "Task 1",
      description: "Description 1",
      destroy: jest.fn(),
    });

    // Call the deleteTask function
    await exports.deleteTask(req, res, next);

    // Check if res.status, res.json, and next are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 1,
        title: "Task 1",
        description: "Description 1",
      },
      method: "deleteTask",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should return an error message if task is not found", async () => {
    // Mock req and res objects
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock Tasks.findByPk function to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call the deleteTask function
    await exports.deleteTask(req, res, next);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      Error: "Task not found!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error message if an exception occurs", async () => {
    // Mock req, res, and next objects
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock Tasks.findByPk function to throw an exception
    Tasks.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the deleteTask function
    await exports.deleteTask(req, res, next);

    // Check if res.status and res.json are called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

// Unit Test for user.js
// This code is not testable as it only contains an export statement and does not contain any logic or functionality.