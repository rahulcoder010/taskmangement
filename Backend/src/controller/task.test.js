// Unit tests for task.js

const db = require("../models/index.js");
const Tasks = db.Task;

describe("allTasks", () => {
  it("should return all tasks", async () => {
    const req = {
      user: {
        token: "abc123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findAllSpy = jest.spyOn(Tasks, "findAll").mockResolvedValueOnce([]);

    await exports.allTasks(req, res);

    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 0,
      data: [],
    });
  });

  it("should return an error if user token is missing", async () => {
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

  it("should return an error if Tasks.findAll throws an error", async () => {
    const req = {
      user: {
        token: "abc123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findAllSpy = jest.spyOn(Tasks, "findAll").mockRejectedValueOnce(new Error("Database error"));

    await exports.allTasks(req, res);

    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

describe("addTask", () => {
  it("should add a new task", async () => {
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
    const createSpy = jest.spyOn(Tasks, "create").mockResolvedValueOnce({
      id: 1,
      title: "Task 1",
      description: "Description 1",
    });

    const next = jest.fn();

    await exports.addTask(req, res, next);

    expect(createSpy).toHaveBeenCalledTimes(1);
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
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.mainData).toEqual({
      success: true,
      data: {
        id: 1,
        title: "Task 1",
        description: "Description 1",
      },
      method: "addTask",
    });
  });

  it("should return an error if title or description is missing", async () => {
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await exports.addTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**title & description are required!**",
    });
  });

  it("should return an error if title length is too long", async () => {
    const req = {
      body: {
        title: "This title is way too long and exceeds the limit of 50 characters",
        description: "Description 1",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await exports.addTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Title or description length too long!**",
    });
  });

  it("should return an error if description length is too long", async () => {
    const req = {
      body: {
        title: "Task 1",
        description: "This description is way too long and exceeds the limit of 200 characters.",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await exports.addTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Title or description length too long!**",
    });
  });

  it("should return an error if Tasks.create throws an error", async () => {
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
    const createSpy = jest.spyOn(Tasks, "create").mockRejectedValueOnce(new Error("Database error"));

    await exports.addTask(req, res);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

describe("updateTask", () => {
  it("should update a task status", async () => {
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
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValueOnce({
      id: 1,
      title: "Task 1",
      description: "Description 1",
      status: "pending",
      save: jest.fn(),
    });

    const next = jest.fn();

    await exports.updateTask(req, res, next);

    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        status: "completed",
      },
      method: "updateTask",
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.mainData).toEqual({
      success: true,
      data: {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        status: "completed",
      },
      method: "updateTask",
    });
  });

  it("should return an error if task is not found", async () => {
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
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValueOnce(null);

    await exports.updateTask(req, res);

    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Task not found!",
    });
  });

  it("should return an error if status is missing in request body", async () => {
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

    await exports.updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Please add status in body!",
    });
  });

  it("should return an error if task.save throws an error", async () => {
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
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValueOnce({
      id: 1,
      title: "Task 1",
      description: "Description 1",
      status: "pending",
      save: jest.fn().mockRejectedValueOnce(new Error("Database error")),
    });

    await exports.updateTask(req, res);

    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

describe("deleteTask", () => {
  it("should delete a task", async () => {
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValueOnce({
      id: 1,
      title: "Task 1",
      description: "Description 1",
      destroy: jest.fn(),
    });

    const next = jest.fn();

    await exports.deleteTask(req, res, next);

    expect(findByPkSpy).toHaveBeenCalledWith(1);
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
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.mainData).toEqual({
      success: true,
      data: {
        id: 1,
        title: "Task 1",
        description: "Description 1",
      },
      method: "deleteTask",
    });
  });

  it("should return an error if task is not found", async () => {
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValueOnce(null);

    await exports.deleteTask(req, res);

    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      Error: "Task not found!",
    });
  });

  it("should return an error if task.destroy throws an error", async () => {
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByPkSpy = jest.spyOn(Tasks, "findByPk").mockResolvedValueOnce({
      id: 1,
      title: "Task 1",
      description: "Description 1",
      destroy: jest.fn().mockRejectedValueOnce(new Error("Database error")),
    });

    await exports.deleteTask(req, res);

    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
}); 
