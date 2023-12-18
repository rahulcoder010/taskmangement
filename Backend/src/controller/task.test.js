// Unit Test Cases for task.js

// Mocking the dependencies
jest.mock("../models/index.js", () => ({
  Task: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
}));

const db = require("../models/index.js");
const {
  allTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controller/task.js");

describe("allTasks", () => {
  it("should return all tasks when user is logged in", async () => {
    const req = {
      user: {
        token: "123456789",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const tasks = [
      { id: 1, title: "Task 1", description: "Description 1" },
      { id: 2, title: "Task 2", description: "Description 2" },
    ];

    db.Task.findAll.mockResolvedValue(tasks);

    await allTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  });

  it("should return an error when user is not logged in", async () => {
    const req = {
      user: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await allTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Please login again!**",
    });
  });

  it("should return an error when there is an exception", async () => {
    const req = {
      user: {
        token: "123456789",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    db.Task.findAll.mockRejectedValue(new Error("Database error"));

    await allTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

describe("addTask", () => {
  it("should add a new task", async () => {
    const req = { body: { title: "Task 1", description: "Description 1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const task = { id: 1, title: "Task 1", description: "Description 1" };

    db.Task.create.mockResolvedValue(task);

    await addTask(req, res, next);

    expect(db.Task.create).toHaveBeenCalledWith({
      title: req.body.title,
      description: req.body.description,
    });
    expect(req.mainData).toEqual({
      success: true,
      data: task,
      method: "addTask",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should return an error when title or description is missing in the request", async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**title & description are required!**",
    });
    expect(next).toHaveBeenCalledTimes(0);
  });

  it("should return an error when title or description length is too long", async () => {
    const req = {
      body: {
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sagittis sapien nec dapibus eleifend. Pellentesque id mauris tincidunt, cursus lectus sed, hendrerit nibh. Morbi interdum aliquet ligula, ac tincidunt purus sollicitudin et. Mauris maximus felis ut ex condimentum cursus. Quisque vehicula turpis ligula, venenatis ultrices erat auctor eu. Nullam a ligula vel est luctus egestas non vitae massa.",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Title or description length too long!**",
    });
    expect(next).toHaveBeenCalledTimes(0);
  });

  it("should return an error when there is an exception", async () => {
    const req = { body: { title: "Task 1", description: "Description 1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    db.Task.create.mockRejectedValue(new Error("Database error"));

    await addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(next).toHaveBeenCalledTimes(0);
  });
});

describe("updateTask", () => {
  it("should update the status of a task", async () => {
    const req = { params: { id: 1 }, body: { status: "completed" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const task = { id: 1, title: "Task 1", description: "Description 1" };

    db.Task.findByPk.mockResolvedValue(task);
    task.save.mockResolvedValue();

    await updateTask(req, res, next);

    expect(db.Task.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(task.status).toEqual(req.body.status);
    expect(task.save).toHaveBeenCalled();
    expect(req.mainData).toEqual({
      success: true,
      data: task,
      method: "updateTask",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should return an error when task is not found", async () => {
    const req = { params: { id: 1 }, body: { status: "completed" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    db.Task.findByPk.mockResolvedValue(null);

    await updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Task not found!",
    });
    expect(next).toHaveBeenCalledTimes(0);
  });

  it("should return an error when status is missing in the request", async () => {
    const req = { params: { id: 1 }, body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const task = { id: 1, title: "Task 1", description: "Description 1" };

    db.Task.findByPk.mockResolvedValue(task);

    await updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Please add status in body!",
    });
    expect(next).toHaveBeenCalledTimes(0);
  });

  it("should return an error when there is an exception", async () => {
    const req = { params: { id: 1 }, body: { status: "completed" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    db.Task.findByPk.mockRejectedValue(new Error("Database error"));

    await updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(next).toHaveBeenCalledTimes(0);
  });
});

describe("deleteTask", () => {
  it("should delete a task", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const task = { id: 1, title: "Task 1", description: "Description 1" };

    db.Task.findByPk.mockResolvedValue(task);
    task.destroy.mockResolvedValue();

    await deleteTask(req, res, next);

    expect(db.Task.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(task.destroy).toHaveBeenCalled();
    expect(req.mainData).toEqual({
      success: true,
      data: task,
      method: "deleteTask",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should return an error when task is not found", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    db.Task.findByPk.mockResolvedValue(null);

    await deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      Error: "Task not found!",
    });
    expect(next).toHaveBeenCalledTimes(0);
  });

  it("should return an error when there is an exception", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const task = { id: 1, title: "Task 1", description: "Description 1" };

    db.Task.findByPk.mockResolvedValue(task);
    task.destroy.mockRejectedValue(new Error("Database error"));

    await deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(next).toHaveBeenCalledTimes(0);
  });
});