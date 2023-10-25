const db = require("../models/index.js");
const Tasks = db.Task;

exports.allTasks = async (req, res) => {
  try {
    if (!req.user.token) {
      return res.status(400).json({
        success: false,
        Error: "Please login again!",
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
        Error: "title & description are required!",
      });
    }
    if (title.length >= 50 || description.length >= 200) {
      return res.status(400).json({
        success: false,
        Error: "Title or description length too long!",
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
        .json({ success: false, message: "Task not found!" });
    }
    if (!status) {
      return res
        .status(404)
        .json({ success: false, message: "Please add status in body!" });
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
        success: false,
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