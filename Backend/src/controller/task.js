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

// Unit test cases for above file Backend/src/controller/task.js

const request = require('supertest')
const app = require('../app')

describe('Task Controller', () => {
  it('Get all tasks', async () => {
    const res = await request(app).get('/tasks')
    expect(res.statusCode).toEqual(200)
    expect(res.body.success).toBe(true)
    expect(res.body.count).toEqual(expect.any(Number))
    expect(res.body.data).toEqual(expect.any(Array))
  })

  it('Add a task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Task 1',
        description: 'This is task 1'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.title).toEqual('Task 1')
    expect(res.body.data.description).toEqual('This is task 1')
  })

  it('Update a task', async () => {
    const id = 1
    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({
        status: 'completed'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.id).toEqual(id)
    expect(res.body.data.status).toEqual('completed')
  })

  it('Update a task with invalid ID', async () => {
    const id = 100
    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({
        status: 'completed'
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toEqual('Task not found!')
  })

  it('Update a task without status', async () => {
    const id = 1
    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({})
    expect(res.statusCode).toEqual(404)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toEqual('Please add status in body!')
  })

  it('Delete a task', async () => {
    const id = 1
    const res = await request(app).delete(`/tasks/${id}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.id).toEqual(id)
  })

  it('Delete a task with invalid ID', async () => {
    const id = 100
    const res = await request(app).delete(`/tasks/${id}`)
    expect(res.statusCode).toEqual(404)
    expect(res.body.success).toBe(false)
    expect(res.body.Error).toEqual('Task not found!')
  })
})