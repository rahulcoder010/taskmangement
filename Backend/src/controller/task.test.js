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
      error: ""
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
      error: ""
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
      error: ""
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
      error: ""
    };
    next();
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};

// Unit test cases

// Mock data
const mockTasks = [
  { id: 1, title: "Task 1", description: "Description 1" },
  { id: 2, title: "Task 2", description: "Description 2" },
  { id: 3, title: "Task 3", description: "Description 3" },
];

// Mock requests
const mockRequest = (body, params, user) => ({
  body,
  params,
  user,
});

// Mock response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("allTasks", () => {
  it("should return all tasks", async () => {
    // Mock request
    const req = mockRequest({}, {}, { token: "dummyToken" });
    // Mock response
    const res = mockResponse();

    // Call allTasks
    await exports.allTasks(req, res);

    // Check if response status is 200
    expect(res.status).toHaveBeenCalledWith(200);

    // Check if response has success property set to true
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );

    // Check if response has count property equal to the number of mock tasks
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        count: mockTasks.length,
      })
    );

    // Check if response has data property equal to the mock tasks
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockTasks,
      })
    );
  });

  it("should return an error if user token is missing", async () => {
    // Mock request without user token
    const req = mockRequest({}, {}, {});
    // Mock response
    const res = mockResponse();

    // Call allTasks
    await exports.allTasks(req, res);

    // Check if response status is 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if response has success property set to false
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );

    // Check if response has Error property set to the error message
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Error: "**Please login again!**",
      })
    );
  });

  it("should return an error if an exception occurs", async () => {
    // Mock request with user token
    const req = mockRequest({}, {}, { token: "dummyToken" });
    // Mock response
    const res = mockResponse();

    // Mock Tasks.findAll to throw an error
    Tasks.findAll = jest.fn().mockRejectedValue(new Error("Mock error"));

    // Call allTasks
    await exports.allTasks(req, res);

    // Check if response status is 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if response has success property set to false
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );

    // Check if response has Error property set to the error message
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Error: "Mock error",
      })
    );
  });
});

describe("addTask", () => {
  it("should add a new task", async () => {
    // Mock request with title and description
    const req = mockRequest(
      { title: "New Task", description: "New Description" },
      {},
      {}
    );
    // Mock response
    const res = mockResponse();

    // Call addTask
    await exports.addTask(req, res, jest.fn());

    // Check if response has success property set to true
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );

    // Check if response has data property set to the new task
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          title: "New Task",
          description: "New Description",
        },
      })
    );
  });

  it("should return an error if title or description is missing", async () => {
    // Mock request without title and description
    const req = mockRequest({}, {}, {});
    // Mock response
    const res = mockResponse();

    // Call addTask
    await exports.addTask(req, res, jest.fn());

    // Check if response status is 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if response has success property set to false
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );

    // Check if response has Error property set to the error message
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Error: "**title & description are required!**",
      })
    );
  });

  it("should return an error if title or description is too long", async () => {
    // Mock request with long title and description
    const req = mockRequest(
      {
        title: "This is a very long title that exceeds the character limit",
        description:
          "This is a very long description that exceeds the character limit",
      },
      {},
      {}
    );
    // Mock response
    const res = mockResponse();

    // Call addTask
    await exports.addTask(req, res, jest.fn());

    // Check if response status is 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if response has success property set to false
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );

    // Check if response has Error property set to the error message
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Error: "**Title or description length too long!**",
      })
    );
  });

  it("should return an error if an exception occurs", async () => {
    // Mock request with title and description
    const req = mockRequest(
      { title: "New Task", description: "New Description" },
      {},
      {}
    );
    // Mock response
    const res = mockResponse();

    // Mock Tasks.create to throw an error
    Tasks.create = jest.fn().mockRejectedValue(new Error("Mock error"));

    // Call addTask
    await exports.addTask(req, res, jest.fn());

    // Check if response status is 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if response has success property set to false
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );

    // Check if response has Error property set to the error message
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Error: "Mock error",
      })
    );
  });
});

describe("updateTask", () => {
  it("should update a task status", async () => {
    // Mock request with task id and status
    const req = mockRequest({ status: "Completed" }, { id: 1 }, {});
    // Mock response
    const res = mockResponse();

    // Mock Tasks.findByPk to return a task
    Tasks.findByPk = jest.fn().mockResolvedValue({ id: 1 });

    // Call updateTask
    await exports.updateTask(req, res, jest.fn());

    // Check if response has success property set to true
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );

    // Check if response has data property set to the updated task
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          id: 1,
          status: "Completed",
        },
      })
    );
  });

  it("should return an error if task is not found", async () => {
    // Mock request with task id and status
    const req = mockRequest({ status: "Completed" }, { id: 1 }, {});
    // Mock response
    const res = mockResponse();

    // Mock Tasks.findByPk to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call updateTask
    await exports.updateTask(req, res, jest.fn());

    // Check if response status is 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if response has success property set to false
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );

    // Check if response has message property set to the error message
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Task not found!",
      })
    );
  });

  it("should return an error if status is missing", async () => {
    // Mock request without status
    const req = mockRequest({}, { id: 1 }, {});
    // Mock response
    const res = mockResponse();

    // Mock Tasks.findByPk to return a task
    Tasks.findByPk = jest.fn().mockResolvedValue({ id: 1 });

    // Call updateTask
    await exports.updateTask(req, res, jest.fn());

    // Check if response status is 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if response has success property set to false
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );

    // Check if response has message property set to the error message
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Please add status in body!",
      })
    );
  });

  it("should return an error if an exception occurs", async () => {
    // Mock request with task id and status
    const req = mockRequest({ status: "Completed" }, { id: 1 }, {});
    // Mock response
    const res = mockResponse();

    // Mock Tasks.findByPk to throw an error
    Tasks.findByPk = jest.fn().mockRejectedValue(new Error("Mock error"));

    // Call updateTask
    await exports.updateTask(req, res, jest.fn());

    // Check if response status is 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if response has success property set to false
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );

    // Check if response has Error property set to the error message
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Error: "Mock error",
      })
    );
  });
});

describe("deleteTask", () => {
  it("should delete a task", async () => {
    // Mock request with task id
    const req = mockRequest({}, { id: 1 }, {});
    // Mock response
    const res = mockResponse();

    // Mock Tasks.findByPk to return a task
    Tasks.findByPk = jest.fn().mockResolvedValue({ id: 1 });
    // Mock task.destroy() to return a promise
    Tasks.prototype.destroy = jest.fn().mockResolvedValue();

    // Call deleteTask
    await exports.deleteTask(req, res, jest.fn());

    // Check if response has success property set to true
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );

    // Check if response has data property set to the deleted task
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          id: 1,
        },
      })
    );
  });

  it("should return an error if task is not found", async () => {
    // Mock request with task id
    const req = mockRequest({}, { id: 1 }, {});
    // Mock response
    const res = mockResponse();

    // Mock Tasks.findByPk to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call deleteTask
    await exports.deleteTask(req, res, jest.fn());

    // Check if response status is 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if response has success property set to false
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );

    // Check if response has Error property set to the error message
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Error: "Task not found!",
      })
    );
  });

  it("should return an error if an exception occurs", async () => {
    // Mock request with task id
    const req = mockRequest({}, { id: 1 }, {});
    // Mock response
    const res = mockResponse();

    // Mock Tasks.findByPk to throw an error
    Tasks.findByPk = jest.fn().mockRejectedValue(new Error("Mock error"));

    // Call deleteTask
    await exports.deleteTask(req, res, jest.fn());

    // Check if response status is 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if response has success property set to false
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );

    // Check if response has Error property set to the error message
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Error: "Mock error",
      })
    );
  });
});