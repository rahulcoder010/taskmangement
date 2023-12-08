router.get('/schedule/tasks/:taskId/reminder', async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const reminderTime = task.reminderTime;
    const currentTime = Date.now();

    if (reminderTime <= currentTime) {
      return res.status(400).json({ error: 'Invalid reminder time' });
    }

    // Code to set an alarm for the reminder time goes here

    res.status(200).json({ message: 'Reminder set successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});