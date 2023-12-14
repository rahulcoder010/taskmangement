// Unit test cases for task.js

const db = require('../models/index.js');
const Tasks = db.Task;

// Test case for allTasks function
describe('allTasks', () => {
  it('should return all tasks and status code 200', async () => {
    // Mock request and response objects
    const req = {
      user: {
        token: 'dummyToken',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findAll method
    Tasks.findAll = jest.fn().mockResolvedValue([
      { id: 1, title: 'Task 1', description: 'Description 1' },
      { id: 2, title: 'Task 2', description: 'Description 2' },
    ]);

    // Call the function
    await exports.allTasks(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 2,
      data: [
        { id: 1, title: 'Task 1', description: 'Description 1' },
        { id: 2, title: 'Task 2', description: 'Description 2' },
      ],
    });
  });

  it('should return error message and status code 400 if user token is missing', async () => {
    // Mock request and response objects
    const req = {
      user: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function
    await exports.allTasks(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: 'Please login again!',
    });
  });

  it('should return error message and status code 404 if an error occurs', async () => {
    // Mock request and response objects
    const req = {
      user: {
        token: 'dummyToken',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findAll method to throw an error
    Tasks.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

    // Call the function
    await exports.allTasks(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: 'Database error',
    });
  });
});

// Test case for addTask function
describe('addTask', () => {
  it('should create a new task and return success message and status code 200', async () => {
    // Mock request and response objects
    const req = {
      body: {
        title: 'New Task',
        description: 'New Task Description',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.create method
    Tasks.create = jest.fn().mockResolvedValue({
      id: 1,
      title: 'New Task',
      description: 'New Task Description',
    });

    // Mock next function
    const next = jest.fn();

    // Call the function
    await exports.addTask(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 1,
        title: 'New Task',
        description: 'New Task Description',
      },
      method: 'addTask',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return error message and status code 400 if title or description is missing', async () => {
    // Mock request and response objects
    const req = {
      body: {
        title: '',
        description: 'New Task Description',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function
    await exports.addTask(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: 'title & description are required!',
    });
  });

  it('should return error message and status code 400 if title or description length exceeds the limit', async () => {
    // Mock request and response objects
    const req = {
      body: {
        title: 'Very long title................................................',
        description: 'Very long description..........................................................................',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function
    await exports.addTask(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: 'Title or description length too long!',
    });
  });

  it('should return error message and status code 404 if an error occurs', async () => {
    // Mock request and response objects
    const req = {
      body: {
        title: 'New Task',
        description: 'New Task Description',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.create method to throw an error
    Tasks.create = jest.fn().mockRejectedValue(new Error('Database error'));

    // Call the function
    await exports.addTask(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: 'Database error',
    });
  });
});

// Test case for updateTask function
describe('updateTask', () => {
  it('should update the status of a task and return success message and status code 200', async () => {
    // Mock request and response objects
    const req = {
      params: {
        id: 1,
      },
      body: {
        status: 'completed',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk method
    Tasks.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      status: 'in progress',
      save: jest.fn(),
    });

    // Mock next function
    const next = jest.fn();

    // Call the function
    await exports.updateTask(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'completed',
      },
      method: 'updateTask',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return error message and status code 404 if the task is not found', async () => {
    // Mock request and response objects
    const req = {
      params: {
        id: 1,
      },
      body: {
        status: 'completed',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk method to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call the function
    await exports.updateTask(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: 'Task not found!',
    });
  });

  it('should return error message and status code 404 if status is missing in the request body', async () => {
    // Mock request and response objects
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

    // Call the function
    await exports.updateTask(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: 'Please add status in body!',
    });
  });

  it('should return error message and status code 404 if an error occurs', async () => {
    // Mock request and response objects
    const req = {
      params: {
        id: 1,
      },
      body: {
        status: 'completed',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk method to throw an error
    Tasks.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

    // Call the function
    await exports.updateTask(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: 'Database error',
    });
  });
});

// Test case for deleteTask function
describe('deleteTask', () => {
  it('should delete a task and return success message and status code 200', async () => {
    // Mock request and response objects
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk method
    Tasks.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      destroy: jest.fn(),
    });

    // Mock next function
    const next = jest.fn();

    // Call the function
    await exports.deleteTask(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
      },
      method: 'deleteTask',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return error message and status code 404 if the task is not found', async () => {
    // Mock request and response objects
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk method to return null
    Tasks.findByPk = jest.fn().mockResolvedValue(null);

    // Call the function
    await exports.deleteTask(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      Error: 'Task not found!',
    });
  });

  it('should return error message and status code 404 if an error occurs', async () => {
    // Mock request and response objects
    const req = {
      params: {
        id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Tasks.findByPk method to throw an error
    Tasks.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

    // Call the function
    await exports.deleteTask(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      Error: 'Database error',
    });
  });
});