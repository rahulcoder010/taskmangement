// Test cases for Backend/src/controller/task.js

// Mock dependencies
jest.mock("../models/index.js", () => {
  const Tasks = {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  };
  return { Task: Tasks };
});

const db = require("../models/index.js");
const Tasks = db.Task;

// Mock request and response objects
const req = { user: { token: "token" }, body: {}, params: {} };
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};
const next = jest.fn();

// Test case for allTasks function
describe("allTasks", () => {
  it("should return all tasks when user is logged in", async () => {
    req.user.token = "token";
    const tasks = [{ id: 1, title: "Task 1", description: "Description 1" }];
    Tasks.findAll.mockResolvedValue(tasks);

    await allTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  });

  it("should return an error message when user is not logged in", async () => {
    req.user.token = null;

    await allTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Please login again!**",
    });
  });

  it("should return an error message when an exception occurs", async () => {
    req.user.token = "token";
    Tasks.findAll.mockRejectedValue(new Error("Database error"));

    await allTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
  });
});

// Test case for addTask function
describe("addTask", () => {
  it("should add a new task when title and description are provided", async () => {
    req.body.title = "Task 1";
    req.body.description = "Description 1";
    const newTask = { id: 1, title: "Task 1", description: "Description 1" };
    Tasks.create.mockResolvedValue(newTask);

    await addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: newTask,
      method: "addTask",
    });
    expect(next).toHaveBeenCalled();
    expect(req.mainData).toEqual({
      success: true,
      data: newTask,
      method: "addTask",
    });
  });

  it("should return an error message when title or description is missing", async () => {
    req.body.title = null;
    req.body.description = "Description 1";

    await addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**title & description are required!**",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error message when title or description length is too long", async () => {
    req.body.title = "Task 1".repeat(10);
    req.body.description = "Description 1".repeat(50);

    await addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "**Title or description length too long!**",
    });
    expect(next)().not.toHaveBeenCalled();
  });

  it("should return an error message when an exception occurs", async () => {
    req.body.title = "Task 1";
    req.body.description = "Description 1";
    Tasks.create.mockRejectedValue(new Error("Database error"));

    await addTask(req, res, next);

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
  it("should update the status of a task when task exists and status is provided", async () => {
    req.params.id = 1;
    req.body.status = "completed";
    const updatedTask = { id: 1, title: "Task 1", description: "Description 1", status: "completed" };
    Tasks.findByPk.mockResolvedValue(updatedTask);
    Tasks.prototype.save = jest.fn().mockResolvedValue();

    await updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: updatedTask,
      method: "updateTask",
    });
    expect(next).toHaveBeenCalled();
    expect(req.mainData).toEqual({
      success: true,
      data: updatedTask,
      method: "updateTask",
    });
    expect(Tasks.prototype.save).toHaveBeenCalled();
  });

  it("should return an error message when task does not exist", async () => {
    req.params.id = 1;
    req.body.status = "completed";
    Tasks.findByPk.mockResolvedValue(null);

    await updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Task not found!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error message when status is not provided", async () => {
    req.params.id = 1;
    req.body.status = null;
    const task = { id: 1, title: "Task 1", description: "Description 1", status: "in progress" };
    Tasks.findByPk.mockResolvedValue(task);

    await updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Please add status in body!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error message when an exception occurs", async () => {
    req.params.id = 1;
    req.body.status = "completed";
    Tasks.findByPk.mockRejectedValue(new Error("Database error"));

    await updateTask(req, res, next);

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
  it("should delete a task when task exists", async () => {
    req.params.id = 1;
    const task = { id: 1, title: "Task 1", description: "Description 1" };
    Tasks.findByPk.mockResolvedValue(task);
    Tasks.prototype.destroy = jest.fn().mockResolvedValue();

    await deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: task,
      method: "deleteTask",
    });
    expect(next).toHaveBeenCalled();
    expect(req.mainData).toEqual({
      success: true,
      data: task,
      method: "deleteTask",
    });
    expect(Tasks.prototype.destroy).toHaveBeenCalled();
  });

  it("should return an error message when task does not exist", async () => {
    req.params.id = 1;
    Tasks.findByPk.mockResolvedValue(null);

    await deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      Error: "Task not found!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error message when an exception occurs", async () => {
    req.params.id = 1;
    Tasks.findByPk.mockRejectedValue(new Error("Database error"));

    await deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: "Database error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});