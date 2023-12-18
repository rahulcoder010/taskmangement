// Test cases for task.js

// Import dependencies
const db = require("../models/index.js");
const Tasks = db.Task;

describe("allTasks", () => {
  it("should return all tasks", async () => {
    // Create mock request and response objects
    const req = {
      user: {
        token: "mock_token",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Tasks.findAll method
    Tasks.findAll = jest.fn().mockResolvedValue([]);

    // Call the allTasks function
    await exports.allTasks(req, res);

    // Assert response status and data
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      success: true,
      count: 0,
      data: [],
    });
  });

  it("should return an error if user is not logged in", async () => {
    // Create mock request and response objects
    const req = {
      user: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the allTasks function
    await exports.allTasks(req, res);

    // Assert response status and error message
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      success: false,
      Error: "**Please login again!**",
    });
  });

  it("should return an error if there is an exception", async () => {
    // Create mock request and response objects
    const req = {
      user: {
        token: "mock_token",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Tasks.findAll method to throw an error
    Tasks.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the allTasks function
    await exports.allTasks(req, res);

    // Assert response status and error message
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

describe("addTask", () => {
  it("should add a new task", async () => {
    // Create mock request and response objects
    const req = {
      body: {
        title: "New Task",
        description: "This is a new task",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Tasks.create method
    Tasks.create = jest.fn().mockResolvedValue({
      id: 1,
      title: "New Task",
      description: "This is a new task",
    });

    // Create a mock next function
    const next = jest.fn();

    // Call the addTask function
    await exports.addTask(req, res, next);

    // Assert the mainData object and call to next function
    expect(req.mainData).toEqual({
      success: true,
      data: {
        id: 1,
        title: "New Task",
        description: "This is a new task",
      },
      method: "addTask",
    });
    expect(next).toBeCalled();
  });

  it("should return an error if title and description are not provided", async () => {
    // Create mock request and response objects
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the addTask function
    await exports.addTask(req, res);

    // Assert response status and error message
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      success: false,
      Error: "**title & description are required!**",
    });
  });

  it("should return an error if title or description length is too long", async () => {
    // Create mock request and response objects
    const req = {
      body: {
        title: "This is a very long title that exceeds the character limit",
        description: "This is a very long description that exceeds the character limit",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the addTask function
    await exports.addTask(req, res);

    // Assert response status and error message
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      success: false,
      Error: "**Title or description length too long!**",
    });
  });

  it("should return an error if there is an exception", async () => {
    // Create mock request and response objects
    const req = {
      body: {
        title: "New Task",
        description: "This is a new task",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Tasks.create method to throw an error
    Tasks.create = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the addTask function
    await exports.addTask(req, res);

    // Assert response status and error message
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

describe("updateTask", () => {
  it("should update the status of a task", async () => {
    // Create mock request and response objects
    const req = {
      params: {
        id: 1,
      },
      body: {
        status: "completed",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Tasks.findByPk and task.save methods
    Tasks.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      title: "New Task",
      description: "This is a new task",
      status: "in-progress",
      save: jest.fn(),
    });

    // Create a mock next function
    const next = jest.fn();

    // Call the updateTask function
    await exports.updateTask(req, res, next);

    // Assert the mainData object and call to next function
    expect(req.mainData).toEqual({
      success: true,
      data: {
        id: 1,
        title: "New Task",
        description: "This is a new task",
        status: "completed",
      },
      method: "updateTask",
    });
    expect(next).toBeCalled();
  });

  it("should return an error if task is not found", async () => {
    // Create mock request and response objects
    const req = {
      params: {
        id: 1,
      },
      body: {
        status: "completed",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Tasks.findByPk method to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call the updateTask function
    await exports.updateTask(req, res);

    // Assert response status and error message
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      status: false,
      message: "Task not found!",
    });
  });

  it("should return an error if status is not provided", async () => {
    // Create mock request and response objects
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

    // Call the updateTask function
    await exports.updateTask(req, res);

    // Assert response status and error message
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      status: false,
      message: "Please add status in body!",
    });
  });

  it("should return an error if there is an exception", async () => {
    // Create mock request and response objects
    const req = {
      params: {
        id: 1,
      },
      body: {
        status: "completed",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Tasks.findByPk method to throw an error
    Tasks.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the updateTask function
    await exports.updateTask(req, res);

    // Assert response status and error message
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

describe("deleteTask", () => {
  it("should delete a task", async () => {
    // Create mock request and response objects
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Tasks.findByPk and task.destroy methods
    const destroyMock = jest.fn();
    Tasks.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      title: "New Task",
      description: "This is a new task",
      destroy: destroyMock,
    });

    // Create a mock next function
    const next = jest.fn();

    // Call the deleteTask function
    await exports.deleteTask(req, res, next);

    // Assert the mainData object and call to next function
    expect(req.mainData).toEqual({
      success: true,
      data: {
        id: 1,
        title: "New Task",
        description: "This is a new task",
      },
      method: "deleteTask",
    });
    expect(next).toBeCalled();
    expect(destroyMock).toBeCalled();
  });

  it("should return an error if task is not found", async () => {
    // Create mock request and response objects
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Tasks.findByPk method to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call the deleteTask function
    await exports.deleteTask(req, res);

    // Assert response status and error message
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      status: false,
      Error: "Task not found!",
    });
  });

  it("should return an error if there is an exception", async () => {
    // Create mock request and response objects
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Tasks.findByPk method to throw an error
    Tasks.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the deleteTask function
    await exports.deleteTask(req, res);

    // Assert response status and error message
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});