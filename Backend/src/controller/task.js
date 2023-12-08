const db = require("../models/index.js");
const Tasks = db.Task;

// Test cases for allTasks
describe("allTasks", () => {
  it("should return all tasks with success status", async () => {
    const req = { user: { token: "validToken" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findAllSpy = jest.spyOn(Tasks, "findAll").mockResolvedValue([]);
    
    await exports.allTasks(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 0,
      data: [],
    });
    expect(findAllSpy).toHaveBeenCalled();
  });

  it("should return error status if user token is missing", async () => {
    const req = { user: {} };
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

  it("should return error status if an error occurs", async () => {
    const req = { user: { token: "validToken" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findAllSpy = jest.spyOn(Tasks, "findAll").mockRejectedValue(new Error("Database error"));
    
    await exports.allTasks(req, res);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(findAllSpy).toHaveBeenCalled();
  });
});

// Test cases for addTask
describe("addTask", () => {
  it("should add a task with success status", async () => {
    const req = {
      body: {
        title: "New Task",
        description: "Task description",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const createSpy = jest.spyOn(Tasks, "create").mockResolvedValue({ id: 1 });

    const next = jest.fn();

    await exports.addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 1 },
      method: "addTask",
    });
    expect(createSpy).toHaveBeenCalledWith({
      title: "New Task",
      description: "Task description",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should return error status if title or description is missing", async () => {
    const req = { body: {} };
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

  it("should return error status if title or description length is too long", async () => {
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

    const next = jest.fn();

    await exports.addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Title or description length too long!**",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return error status if an error occurs", async () => {
    const req = {
      body: {
        title: "New Task",
        description: "Task description",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const createSpy = jest.spyOn(Tasks, "create").mockRejectedValue(new Error("Database error"));

    const next = jest.fn();

    await exports.addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(createSpy).toHaveBeenCalledWith({
      title: "New Task",
      description: "Task description",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

// Test cases for updateTask
describe("updateTask", () => {
  it("should update a task with success status", async () => {
    const req = {
      params: { id: 1 },
      body: { status: "completed" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValue({ id: 1, status: "pending", save: jest.fn() });

    const next = jest.fn();

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 1, status: "completed" },
      method: "updateTask",
    });
    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalled();
  });

  it("should return error status if task is not found", async () => {
    const req = {
      params: { id: 1 },
      body: { status: "completed" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValue(null);

    const next = jest.fn();

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Task not found!",
    });
    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return error status if status is missing in body", async () => {
    const req = {
      params: { id: 1 },
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValue({ id: 1, status: "pending", save: jest.fn() });

    const next = jest.fn();

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Please add status in body!",
    });
    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return error status if an error occurs", async () => {
    const req = {
      params: { id: 1 },
      body: { status: "completed" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockRejectedValue(new Error("Database error"));

    const next = jest.fn();

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(next).not.toHaveBeenCalled();
  });
});

// Test cases for deleteTask
describe("deleteTask", () => {
  it("should delete a task with success status", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValue({ id: 1, destroy: jest.fn() });

    const next = jest.fn();

    await exports.deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 1 },
      method: "deleteTask",
    });
    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalled();
  });

  it("should return error status if task is not found", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValue(null);

    const next = jest.fn();

    await exports.deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      Error: "Task not found!",
    });
    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return error status if an error occurs", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockRejectedValue(new Error("Database error"));

    const next = jest.fn();

    await exports.deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(next).not.toHaveBeenCalled();
  });
});