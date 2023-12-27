// Unit tests for task.js

const db = require("../models/index.js");
const Tasks = db.Task;

// Test case for allTasks function
describe("allTasks", () => {
  it("should return all tasks", async () => {
    const req = {
      user: { token: "123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await exports.allTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: expect.any(Number),
      data: expect.any(Array),
    });
  });

  it("should return an error if user is not logged in", async () => {
    const req = {
      user: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await exports.allTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Please login again!**",
    });
  });

  it("should return an error if an exception occurs", async () => {
    const req = {
      user: { token: "123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Tasks, "findAll").mockRejectedValue(new Error("Database error"));

    await exports.allTasks(req, res);

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
    const req = {
      body: { title: "Task 1", description: "Description 1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await exports.addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.any(Object),
      method: "addTask",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should return an error if title or description is missing", async () => {
    const req = {
      body: { title: "", description: "Description 1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await exports.addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**title & description are required!**",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error if title or description is too long", async () => {
    const req = {
      body: { title: "Task title that is too long", description: "Description 1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await exports.addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Title or description length too long!**",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error if an exception occurs", async () => {
    const req = {
      body: { title: "Task 1", description: "Description 1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jest.spyOn(Tasks, "create").mockRejectedValue(new Error("Database error"));

    await exports.addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

// Test case for updateTask function
describe("updateTask", () => {
  it("should update the status of a task", async () => {
    const req = {
      params: { id: 1 },
      body: { status: "Completed" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockTask = {
      id: 1,
      title: "Task 1",
      description: "Description 1",
    };

    jest.spyOn(Tasks, "findByPk").mockResolvedValue(mockTask);
    jest.spyOn(mockTask, "save").mockResolvedValue();

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.any(Object),
      method: "updateTask",
    });
    expect(next).toHaveBeenCalled();
    expect(mockTask.status).toEqual("Completed");
    expect(mockTask.save).toHaveBeenCalled();
  });

  it("should return an error if the task is not found", async () => {
    const req = {
      params: { id: 1 },
      body: { status: "Completed" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jest.spyOn(Tasks, "findByPk").mockResolvedValue(null);

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Task not found!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error if the status is not provided in the request body", async () => {
    const req = {
      params: { id: 1 },
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockTask = {
      id: 1,
      title: "Task 1",
      description: "Description 1",
    };

    jest.spyOn(Tasks, "findByPk").mockResolvedValue(mockTask);

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Please add status in body!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error if an exception occurs", async () => {
    const req = {
      params: { id: 1 },
      body: { status: "Completed" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jest.spyOn(Tasks, "findByPk").mockRejectedValue(new Error("Database error"));

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

// Test case for deleteTask function
describe("deleteTask", () => {
  it("should delete a task", async () => {
    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockTask = {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      destroy: jest.fn(),
    };

    jest.spyOn(Tasks, "findByPk").mockResolvedValue(mockTask);

    await exports.deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.any(Object),
      method: "deleteTask",
    });
    expect(next).toHaveBeenCalled();
    expect(mockTask.destroy).toHaveBeenCalled();
  });

  it("should return an error if the task is not found", async () => {
    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jest.spyOn(Tasks, "findByPk").mockResolvedValue(null);

    await exports.deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      Error: "Task not found!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error if an exception occurs", async () => {
    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jest.spyOn(Tasks, "findByPk").mockRejectedValue(new Error("Database error"));

    await exports.deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});


// Unit tests for user.js
// Since the original file does not contain any code related to user.js,
// it is not testable.