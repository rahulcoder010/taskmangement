const db = require("../models/index.js");
const Tasks = db.Task;

exports.allTasks = async (req, res) => {
  try {
    if (!req.user.token) {
      return res.status(400).json({
        success: false,
        Error: "**Please login again!**",
      });
    }
    const tasks = await Tasks.findAll({
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};

exports.addTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        Error: "**title & description are required!**",
      });
    }
    if (title.length >= 50 || description.length >= 200) {
      return res.status(400).json({
        success: false,
        Error: "**Title or description length too long!**",
      });
    }

    const task = await Tasks.create({ title, description });

    req.mainData = {
      success: true,
      data: task,
      method: "addTask",
    };
    next();
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Tasks.findByPk(id);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found!" });
    }
    if (!status) {
      return res
        .status(404)
        .json({ status: false, message: "Please add status in body!" });
    }
    task.status = status;
    await task.save();

    req.mainData = {
      success: true,
      data: task,
      method: "updateTask",
    };
    next();
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Tasks.findByPk(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        Error: "Task not found!",
      });
    }
    await task.destroy();

    req.mainData = {
      success: true,
      data: task,
      method: "deleteTask",
    };
    next();
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};

// Unit Test Cases
describe("Task Controller Unit Tests", () => {
  // Mock req and res objects
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();
  
  // Test for allTasks function
  it("should return all tasks", async () => {
    await exports.allTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  // Test for addTask function
  it("should add a new task", async () => {
    req.body = {
      title: "New Task",
      description: "This is a new task",
    };

    await exports.addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should return an error if title or description is missing in addTask", async () => {
    req.body = {
      title: "",
      description: "This is a new task",
    };

    await exports.addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  it("should return an error if title or description length is too long in addTask", async () => {
    req.body = {
      title: "This is a very long title that exceeds 50 characters",
      description: "This is a new task",
    };

    await exports.addTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  // Test for updateTask function
  it("should update a task", async () => {
    req.params = {
      id: 1,
    };
    req.body = {
      status: "Completed",
    };

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should return an error if task with the given id is not found in updateTask", async () => {
    req.params = {
      id: 999,
    };
    req.body = {
      status: "Completed",
    };

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
  });

  it("should return an error if status is missing in updateTask", async () => {
    req.params = {
      id: 1,
    };
    req.body = {};

    await exports.updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
  });

  // Test for deleteTask function
  it("should delete a task", async () => {
    req.params = {
      id: 1,
    };

    await exports.deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should return an error if task with the given id is not found in deleteTask", async () => {
    req.params = {
      id: 999,
    };

    await exports.deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
  });
});