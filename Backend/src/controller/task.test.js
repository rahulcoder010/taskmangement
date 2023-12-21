// Unit test for task.js

const taskController = require("../controller/task");
const db = require("../models/index.js");
const Tasks = db.Task;

// Test for allTasks function
describe("allTasks", () => {
  it("should return all tasks when the user is logged in", async () => {
    // Mock req and res objects
    const req = {
      user: { token: "mockToken" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findAll function
    Tasks.findAll = jest.fn().mockResolvedValue([
      { id: 1, title: "task 1", description: "description 1" },
      { id: 2, title: "task 2", description: "description 2" },
    ]);

    // Call the allTasks function
    await taskController.allTasks(req, res);

    // Check if Tasks.findAll and res.status have been called with the correct arguments
    expect(Tasks.findAll).toHaveBeenCalledWith({ order: [["id", "ASC"]] });
    expect(res.status).toHaveBeenCalledWith(200);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 2,
      data: [
        { id: 1, title: "task 1", description: "description 1" },
        { id: 2, title: "task 2", description: "description 2" },
      ],
    });
  });

  it("should return an error message when the user is not logged in", async () => {
    // Mock req and res objects
    const req = {
      user: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the allTasks function
    await taskController.allTasks(req, res);

    // Check if res.status has been called with the correct argument
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Please login again!**",
    });
  });

  it("should return an error message when Tasks.findAll throws an error", async () => {
    // Mock req and res objects
    const req = {
      user: { token: "mockToken" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findAll function to throw an error
    Tasks.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the allTasks function
    await taskController.allTasks(req, res);

    // Check if res.status has been called with the correct argument
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Test for addTask function
describe("addTask", () => {
  it("should add a new task", async () => {
    // Mock req and res objects
    const req = {
      body: { title: "task 1", description: "description 1" },
      mainData: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.create function
    Tasks.create = jest.fn().mockResolvedValue({ id: 1, title: "task 1", description: "description 1" });

    // Mock next function
    const next = jest.fn();

    // Call the addTask function
    await taskController.addTask(req, res, next);

    // Check if Tasks.create has been called with the correct argument
    expect(Tasks.create).toHaveBeenCalledWith({ title: "task 1", description: "description 1" });

    // Check if req.mainData has been updated with the correct value
    expect(req.mainData).toEqual({
      success: true,
      data: { id: 1, title: "task 1", description: "description 1" },
      method: "addTask",
    });

    // Check if next has been called
    expect(next).toHaveBeenCalled();
  });

  it("should return an error message when title or description is missing", async () => {
    // Mock req and res objects
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the addTask function
    await taskController.addTask(req, res);

    // Check if res.status has been called with the correct argument
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**title & description are required!**",
    });
  });

  it("should return an error message when title or description length is too long", async () => {
    // Mock req and res objects
    const req = {
      body: { title: "A".repeat(51), description: "A".repeat(201) },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the addTask function
    await taskController.addTask(req, res);

    // Check if res.status has been called with the correct argument
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Title or description length too long!**",
    });
  });

  it("should return an error message when Tasks.create throws an error", async () => {
    // Mock req and res objects
    const req = {
      body: { title: "task 1", description: "description 1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.create function to throw an error
    Tasks.create = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the addTask function
    await taskController.addTask(req, res);

    // Check if res.status has been called with the correct argument
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Test for updateTask function
describe("updateTask", () => {
  it("should update the status of a task", async () => {
    // Mock req and res objects
    const req = {
      params: { id: 1 },
      body: { status: "completed" },
      mainData: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk function
    Tasks.findByPk = jest.fn().mockResolvedValue({ id: 1, title: "task 1", description: "description 1", status: "pending", save: jest.fn() });

    // Mock next function
    const next = jest.fn();

    // Call the updateTask function
    await taskController.updateTask(req, res, next);

    // Check if Tasks.findByPk has been called with the correct argument
    expect(Tasks.findByPk).toHaveBeenCalledWith(1);

    // Check if task.status has been updated with the correct value
    expect(req.mainData).toEqual({
      success: true,
      data: { id: 1, title: "task 1", description: "description 1", status: "completed", save: expect.any(Function) },
      method: "updateTask",
    });

    // Check if task.save has been called
    expect(req.mainData.data.save).toHaveBeenCalled();

    // Check if next has been called
    expect(next).toHaveBeenCalled();
  });

  it("should return an error message when the task is not found", async () => {
    // Mock req and res objects
    const req = {
      params: { id: 1 },
      body: { status: "completed" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk function to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call the updateTask function
    await taskController.updateTask(req, res);

    // Check if res.status has been called with the correct argument
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Task not found!",
    });
  });

  it("should return an error message when status is missing in the request body", async () => {
    // Mock req and res objects
    const req = {
      params: { id: 1 },
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk function
    Tasks.findByPk = jest.fn().mockResolvedValue({ id: 1, title: "task 1", description: "description 1" });

    // Call the updateTask function
    await taskController.updateTask(req, res);

    // Check if res.status has been called with the correct argument
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Please add status in body!",
    });
  });

  it("should return an error message when task.save throws an error", async () => {
    // Mock req and res objects
    const req = {
      params: { id: 1 },
      body: { status: "completed" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk function
    Tasks.findByPk = jest.fn().mockResolvedValue({ id: 1, title: "task 1", description: "description 1", status: "pending", save: jest.fn().mockRejectedValue(new Error("Database error")) });

    // Call the updateTask function
    await taskController.updateTask(req, res);

    // Check if res.status has been called with the correct argument
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Test for deleteTask function
describe("deleteTask", () => {
  it("should delete a task", async () => {
    // Mock req and res objects
    const req = {
      params: { id: 1 },
      mainData: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk function
    Tasks.findByPk = jest.fn().mockResolvedValue({ id: 1, title: "task 1", description: "description 1", destroy: jest.fn() });

    // Mock next function
    const next = jest.fn();

    // Call the deleteTask function
    await taskController.deleteTask(req, res, next);

    // Check if Tasks.findByPk has been called with the correct argument
    expect(Tasks.findByPk).toHaveBeenCalledWith(1);

    // Check if task.destroy has been called
    expect(req.mainData).toEqual({
      success: true,
      data: { id: 1, title: "task 1", description: "description 1", destroy: expect.any(Function) },
      method: "deleteTask",
    });
    expect(req.mainData.data.destroy).toHaveBeenCalled();

    // Check if next has been called
    expect(next).toHaveBeenCalled();
  });

  it("should return an error message when the task is not found", async () => {
    // Mock req and res objects
    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk function to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call the deleteTask function
    await taskController.deleteTask(req, res);

    // Check if res.status has been called with the correct argument
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      Error: "Task not found!",
    });
  });

  it("should return an error message when task.destroy throws an error", async () => {
    // Mock req and res objects
    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk function
    Tasks.findByPk = jest.fn().mockResolvedValue({ id: 1, title: "task 1", description: "description 1", destroy: jest.fn().mockRejectedValue(new Error("Database error")) });

    // Call the deleteTask function
    await taskController.deleteTask(req, res);

    // Check if res.status has been called with the correct argument
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if res.json has been called with the correct response data
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Unit test for user.js
// Please provide the content of user.js in order to write unit tests.