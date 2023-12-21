const express = require('express');
const router = express.Router();

const user = require('../routes/users.js');
const task = require('../routes/tasks.js');

router.use('/user', user);
router.use('/task', task);

module.exports = router;