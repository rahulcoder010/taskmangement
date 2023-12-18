# Task Management Application

## Overview

This Task Management application allows users to create, update, and delete tasks. It also provides a list view to display all tasks.

## Technologies Used

- HTML
- CSS
- JavaScript

## Features

- Create a new task
- Update an existing task
- Delete a task
- View all tasks

## Getting Started

To run the application, follow these steps:

1. Clone the repository.
2. Open `index.html` in your preferred browser.

## Code Example

Here is an example of how to create a new task:

```javascript
function createTask(taskName) {
  // Generate a new task id
  const taskId = generateTaskId();

  // Create a new task object
  const newTask = {
    id: taskId,
    name: taskName,
    status: 'incomplete'
  };

  // Add the new task to the list of tasks
  tasks.push(newTask);

  // Display the updated task list
  displayTaskList();
}
```

## API Reference

This application does not make use of any external APIs.

## Contributors

- John Doe
- Jane Smith

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.