Find and replace the following lines of code in the `TaskPage.js` file:

1. Change the style of the "Add task" button:
   - Find: `<button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal">Add task</button>`
   - Replace: `<button type="button" className="btn btn-warning btn-lg" data-bs-toggle="modal" data-bs-target="#exampleModal"><FaEdit /> Add task</button>`

2. Change the style of the "Update task" button:
   - Find: `<button style={{ marginRight: "10px" }} type="button" className="btn btn-primary btn-success ms-1" data-bs-toggle="modal" data-bs-target={`#exampleModal${i}`}> <FaEdit /></button>`
   - Replace: `<button style={{ marginRight: "10px" }} type="button" className="btn btn-primary btn-lg btn-success ms-1" data-bs-toggle="modal" data-bs-target={`#exampleModal${i}`}> <FaEdit /> Update task</button>`

3. Change the style of the "Delete task" button:
   - Find: `<button type="submit" className="btn btn-danger" onClick={() => handleDeleteTask(task.id)}><FaTrash /></button>`
   - Replace: `<button type="submit" className="btn btn-lg btn-danger" onClick={() => handleDeleteTask(task.id)}><FaTrash /> Delete task</button>`