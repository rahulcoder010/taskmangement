<button
  style={{ marginRight: "10px" }}
  type="button"
  className="btn btn-primary btn-success ms-1"
  data-bs-toggle="modal"
  data-bs-target={**#exampleModal${i}**}
>
  <FaEdit />
  Update Task
</button>

<button
  type="submit"
  className="btn btn-danger"
  onClick={() => handleDeleteTask(task.id)}
>
  <FaTrash />
  Delete Task
</button>

<button
  type="button"
  className="btn btn-warning"
  data-bs-toggle="modal"
  data-bs-target="#exampleModal"
>
  <FaEdit />
  Add Task
</button>