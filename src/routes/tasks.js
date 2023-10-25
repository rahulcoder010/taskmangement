const { Router } = require("express");
const {
  allTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controller/task.js");
const router = Router();

const { protect } = require("../middleware/protect.js");

router.route("/").get(protect, allTasks).post(addTask);
router.route("/:id").put(protect, updateTask).delete(deleteTask);

module.exports = router;
