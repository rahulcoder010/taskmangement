const express = require('express');
const router = express.Router();

const Task = require('../models/task');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET a task by id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST a new task
router.post('/', async (req, res) => {
  const { description } = req.body;

  try {
    const newTask = await Task.create({
      description
    });

    res.json(newTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT update a task
router.put('/:id', async (req, res) => {
  const { description } = req.body;

  try {
    let task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task = await task.update({
      description
    });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE remove a task
router.delete('/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    await task.destroy();

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
