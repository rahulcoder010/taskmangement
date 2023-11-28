exports.allTasksTest = () => {
  // Test if req.user.token is empty
  // Expected: res.status(400) with success as false and Error as "Please login again!"
  
  // Test if tasks are returned successfully from the database
  // Expected: res.status(200) with success as true, count as tasks.length, and data as tasks

  // Test if an error occurs in fetching tasks from the database
  // Expected: res.status(404) with success as false and Error as error.message
};

exports.addTaskTest = () => {
  // Test if title and description are not provided in the request body
  // Expected: res.status(400) with success as false and Error as "title & description are required!"
  
  // Test if title or description length exceeds the maximum limit
  // Expected: res.status(400) with success as false and Error as "Title or description length too long!"

  // Test if task is created successfully
  // Expected: req.mainData.success as true, req.mainData.data as task, and req.mainData.method as "addTask"

  // Test if an error occurs in creating the task
  // Expected: res.status(404) with success as false and Error as error.message
};

exports.updateTaskTest = () => {
  // Test if task with the given id is not found
  // Expected: res.status(404) with status as false and message as "Task not found!"
  
  // Test if status is not provided in the request body
  // Expected: res.status(404) with status as false and message as "Please add status in body!"

  // Test if task is updated successfully
  // Expected: req.mainData.success as true, req.mainData.data as task, and req.mainData.method as "updateTask"

  // Test if an error occurs in updating the task
  // Expected: res.status(404) with success as false and Error as error.message
};

exports.deleteTaskTest = () => {
  // Test if task with the given id is not found
  // Expected: res.status(404) with status as false and Error as "Task not found!"

  // Test if task is deleted successfully
  // Expected: req.mainData.success as true, req.mainData.data as task, and req.mainData.method as "deleteTask"

  // Test if an error occurs in deleting the task
  // Expected: res.status(404) with success as false and Error as error.message
};