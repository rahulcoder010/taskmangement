const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Create a new task
router.post('/', async (req, res) => {
   try {
      const task = await Task.create(req.body);
      res.status(201).json(task);
   } catch (err) {
      res.status(400).json({ message: err.message });
   }
});

// Get all tasks
router.get('/', async (req, res) => {
   try {
      const tasks = await Task.findAll();
      res.json(tasks);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

module.exports = router;