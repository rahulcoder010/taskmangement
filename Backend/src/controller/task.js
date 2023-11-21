```javascript
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
        .status(400)
        .json({ success: false, Error: "Please add status in body!" });
    }
    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
      method: "updateTask",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};
```