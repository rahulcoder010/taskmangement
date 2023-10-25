In `TaskPage.js`, update the following lines:

1. Update the update button icon:
   - Change `Update` button text to an empty string.

   ```jsx
   <button
     style={{ marginRight: "10px" }}
     type="button"
     className="btn btn-primary btn-success ms-1"
     data-bs-toggle="modal"
     data-bs-target="#exampleModal"
   >
   </button>
   ```

2. Update the delete button icon:
   - Change `Delete` button text to an empty string.

   ```jsx
   <button
     type="submit"
     className="btn btn-danger"
     onClick={() => handleDeleteTask(task.id)}
   >
   </button>
   ```