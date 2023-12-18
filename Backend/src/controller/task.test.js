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

// Unit test cases for task.js

// Test case for allTasks function
// Mock req and res objects
const mockReq = {};
const mockRes = {
  status: jest.fn(() => mockRes),
  json: jest.fn(),
};

// Mock Tasks.findAll function
jest.mock("../models/index.js", () => {
  return {
    Task: {
      findAll: jest.fn(() => []),
    },
  };
});

// Import the function to be tested
const { allTasks } = require("./controller/task.js");

test("allTasks should return a success response with an empty array", async () => {
  await allTasks(mockReq, mockRes);

  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(mockRes.json).toHaveBeenCalledWith({
    success: true,
    count: 0,
    data: [],
  });
});



// Test case for addTask function

// Mock req and res objects
const mockReq = {
  body: {
    title: "Test Title",
    description: "Test Description",
  },
};
const mockRes = {
  status: jest.fn(() => mockRes),
  json: jest.fn(),
};
const mockNext = jest.fn();

// Mock Tasks.create function
jest.mock("../models/index.js", () => {
  return {
    Task: {
      create: jest.fn(() => ({
        title: "Test Title",
        description: "Test Description",
      })),
    },
  };
});

// Import the function to be tested
const { addTask } = require("./controller/task.js");

test("addTask should return a success response and call the next middleware", async () => {
  await addTask(mockReq, mockRes, mockNext);

  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(mockRes.json).toHaveBeenCalledWith({
    success: true,
    data: {
      title: "Test Title",
      description: "Test Description",
    },
    method: "addTask",
  });
  expect(mockNext).toHaveBeenCalled();
});



// Test case for updateTask function

// Mock req and res objects
const mockReq = {
  params: {
    id: "1",
  },
  body: {
    status: "completed",
  },
};
const mockRes = {
  status: jest.fn(() => mockRes),
  json: jest.fn(),
};
const mockNext = jest.fn();

// Mock Tasks.findByPk and task.save functions
jest.mock("../models/index.js", () => {
  return {
    Task: {
      findByPk: jest.fn(() => ({
        id: "1",
        title: "Test Title",
        description: "Test Description",
        status: "pending",
        save: jest.fn(),
      })),
    },
  };
});

// Import the function to be tested
const { updateTask } = require("./controller/task.js");

test("updateTask should return a success response and call the next middleware", async () => {
  await updateTask(mockReq, mockRes, mockNext);

  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(mockRes.json).toHaveBeenCalledWith({
    success: true,
    data: {
      id: "1",
      title: "Test Title",
      description: "Test Description",
      status: "completed",
    },
    method: "updateTask",
  });
  expect(mockNext).toHaveBeenCalled();
});



// Test case for deleteTask function

// Mock req and res objects
const mockReq = {
  params: {
    id: "1",
  },
};
const mockRes = {
  status: jest.fn(() => mockRes),
  json: jest.fn(),
};
const mockNext = jest.fn();

// Mock Tasks.findByPk and task.destroy functions
jest.mock("../models/index.js", () => {
  return {
    Task: {
      findByPk: jest.fn(() => ({
        id: "1",
        title: "Test Title",
        description: "Test Description",
        status: "completed",
        destroy: jest.fn(),
      })),
    },
  };
});

// Import the function to be tested
const { deleteTask } = require("./controller/task.js");

test("deleteTask should return a success response and call the next middleware", async () => {
  await deleteTask(mockReq, mockRes, mockNext);

  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(mockRes.json).toHaveBeenCalledWith({
    success: true,
    data: {
      id: "1",
      title: "Test Title",
      description: "Test Description",
      status: "completed",
    },
    method: "deleteTask",
  });
  expect(mockNext).toHaveBeenCalled();
});