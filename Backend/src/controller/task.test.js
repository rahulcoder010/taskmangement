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
// Please note that these unit test cases are just an example, and you should write more comprehensive test cases based on the requirements of your application.

// Test case for allTasks function
it('should return all tasks', async () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await allTasks(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// Test case for addTask function
it('should add a new task', async () => {
  const req = {
    body: {
      title: 'Test Task',
      description: 'This is a test task'
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();

  await addTask(req, res, next);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    data: {
      title: 'Test Task',
      description: 'This is a test task'
    },
    method: 'addTask'
  });
  expect(next).toHaveBeenCalled();
});

// Test case for updateTask function
it('should update the status of a task', async () => {
  const req = {
    params: {
      id: 1
    },
    body: {
      status: 'completed'
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();

  await updateTask(req, res, next);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    data: {
      id: 1,
      status: 'completed'
    },
    method: 'updateTask'
  });
  expect(next).toHaveBeenCalled();
});

// Test case for deleteTask function
it('should delete a task', async () => {
  const req = {
    params: {
      id: 1
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();

  await deleteTask(req, res, next);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    data: {
      id: 1,
      status: 'completed'
    },
    method: 'deleteTask'
  });
  expect(next).toHaveBeenCalled();
});