// Unit test cases for task.js

const db = require("../models/index.js");
const Tasks = db.Task;

// Test case for allTasks function
describe("allTasks", () => {
  it("should return all tasks", async () => {
    // Mock user token
    const req = { user: { token: "mockToken" } };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock findAll function
    Tasks.findAll = jest.fn().mockResolvedValue([
      { id: 1, title: "Task 1", description: "Description 1" },
      { id: 2, title: "Task 2", description: "Description 2" },
    ]);

    // Call the function
    await allTasks(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 2,
      data: [
        { id: 1, title: "Task 1", description: "Description 1" },
        { id: 2, title: "Task 2", description: "Description 2" },
      ],
    });
  });

  it("should return error if user token is missing", async () => {
    // Mock request object without user token
    const req = { user: {} };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function
    await allTasks(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Please login again!",
    });
  });

  it("should return error if an exception is thrown", async () => {
    // Mock user token
    const req = { user: { token: "mockToken" } };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock findAll function to throw an exception
    Tasks.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the function
    await allTasks(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Test case for addTask function
describe("addTask", () => {
  it("should add a new task", async () => {
    // Mock request body
    const req = { body: { title: "New Task", description: "New Description" } };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock create function
    Tasks.create = jest.fn().mockResolvedValue({
      id: 1,
      title: "New Task",
      description: "New Description",
    });

    // Mock next function
    const next = jest.fn();

    // Call the function
    await addTask(req, res, next);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 1, title: "New Task", description: "New Description" },
      method: "addTask",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should return error if title or description are missing", async () => {
    // Mock request body without title and description
    const req = { body: {} };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function
    await addTask(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "title & description are required!",
    });
  });

  it("should return error if title or description length is too long", async () => {
    // Mock request body with long title and description
    const req = {
      body: {
        title: "This is a very long title that exceeds the limit",
        description: "This is a very long description that exceeds the limit",
      },
    };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function
    await addTask(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Title or description length too long!",
    });
  });

  it("should return error if an exception is thrown", async () => {
    // Mock request body
    const req = { body: { title: "New Task", description: "New Description" } };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock create function to throw an exception
    Tasks.create = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the function
    await addTask(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Test case for updateTask function
describe("updateTask", () => {
  it("should update the status of a task", async () => {
    // Mock request parameters and body
    const req = { params: { id: 1 }, body: { status: "Completed" } };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock findByPk function
    Tasks.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      title: "Task 1",
      description: "Description 1",
      status: "Pending",
      save: jest.fn().mockResolvedValue(),
    });

    // Mock next function
    const next = jest.fn();

    // Call the function
    await updateTask(req, res, next);

    // Check if the response is correct
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

  it("should return error if task is not found", async () => {
    // Mock request parameters without valid id
    const req = { params: { id: 100 }, body: { status: "Completed" } };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock findByPk function to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call the function
    await updateTask(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Task not found!",
    });
  });

  it("should return error if status is missing", async () => {
    // Mock request parameters and body without status
    const req = { params: { id: 1 }, body: {} };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock findByPk function
    Tasks.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      title: "Task 1",
      description: "Description 1",
    });

    // Call the function
    await updateTask(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Please add status in body!",
    });
  });

  it("should return error if an exception is thrown", async () => {
    // Mock request parameters and body
    const req = { params: { id: 1 }, body: { status: "Completed" } };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock findByPk function to throw an exception
    Tasks.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the function
    await updateTask(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Test case for deleteTask function
describe("deleteTask", () => {
  it("should delete a task", async () => {
    // Mock request parameters
    const req = { params: { id: 1 } };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock findByPk function
    Tasks.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      title: "Task 1",
      description: "Description 1",
      destroy: jest.fn().mockResolvedValue(),
    });

    // Mock next function
    const next = jest.fn();

    // Call the function
    await deleteTask(req, res, next);

    // Check if the response is correct
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

  it("should return error if task is not found", async () => {
    // Mock request parameters without valid id
    const req = { params: { id: 100 } };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock findByPk function to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call the function
    await deleteTask(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      Error: "Task not found!",
    });
  });

  it("should return error if an exception is thrown", async () => {
    // Mock request parameters
    const req = { params: { id: 1 } };
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock findByPk function to throw an exception
    Tasks.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the function
    await deleteTask(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});