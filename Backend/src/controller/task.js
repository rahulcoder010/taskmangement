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

// Test cases

async function testCases() {
  try {
    const mockReq = {
      user: {
        token: "mockToken",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Test case for allTasks
    const allTasksResult = await exports.allTasks(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      count: allTasksResult.data.length,
      data: allTasksResult.data,
    });

    // Test case for addTask
    const mockReqAddTask = {
      body: {
        title: "Test Task",
        description: "This is a test task.",
      },
      mainData: {},
    };
    const mockResAddTask = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const addTaskResult = await exports.addTask(mockReqAddTask, mockResAddTask);
    expect(mockResAddTask.status).toHaveBeenCalledWith(200);
    expect(mockResAddTask.json).toHaveBeenCalledWith({
      success: true,
      data: addTaskResult.data,
      method: "addTask",
    });

    // Test case for updateTask
    const mockReqUpdateTask = {
      params: {
        id: "1",
      },
      body: {
        status: "Completed",
      },
      mainData: {},
    };
    const mockResUpdateTask = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const updateTaskResult = await exports.updateTask(
      mockReqUpdateTask,
      mockResUpdateTask
    );
    expect(mockResUpdateTask.status).toHaveBeenCalledWith(200);
    expect(mockResUpdateTask.json).toHaveBeenCalledWith({
      success: true,
      data: updateTaskResult.data,
      method: "updateTask",
    });

    // Test case for deleteTask
    const mockReqDeleteTask = {
      params: {
        id: "1",
      },
      mainData: {},
    };
    const mockResDeleteTask = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const deleteTaskResult = await exports.deleteTask(
      mockReqDeleteTask,
      mockResDeleteTask
    );
    expect(mockResDeleteTask.status).toHaveBeenCalledWith(200);
    expect(mockResDeleteTask.json).toHaveBeenCalledWith({
      success: true,
      data: deleteTaskResult.data,
      method: "deleteTask",
    });
  } catch (error) {
    console.error("Error in test cases:", error);
  }
}

testCases();