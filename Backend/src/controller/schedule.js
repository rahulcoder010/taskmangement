const express = require('express');
const router = express.Router();

// Endpoint for task reminder and setting alarm
router.post('/schedule/task', (req, res) => {
  const { task, time } = req.body;
  
  // Your code here

});

module.exports = router;