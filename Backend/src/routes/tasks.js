const express = require("express");
const router = express.Router();
const taskController = require("../controller/task.js");
const protectMiddleware = require("../middleware/protect.js");

router.get("/", protectMiddleware, taskController.allTasks);
router.post("/", protectMiddleware, taskController.addTask);
router.put("/:id", protectMiddleware, taskController.updateTask);
router.delete("/:id", protectMiddleware, taskController.deleteTask);

module.exports = router;