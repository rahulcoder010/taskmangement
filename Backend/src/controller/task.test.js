const express = require('express');
const router = express.Router();

// Get all tasks
router.get('/', (req, res) => {
  // Logic to get all tasks
});

// Get a single task
router.get('/:id', (req, res) => {
  // Logic to get a single task
});

// Create a new task
router.post('/', (req, res) => {
  // Logic to create a new task
});

// Update a task
router.put('/:id', (req, res) => {
  // Logic to update a task
});

// Delete a task
router.delete('/:id', (req, res) => {
  // Logic to delete a task
});

module.exports = router;