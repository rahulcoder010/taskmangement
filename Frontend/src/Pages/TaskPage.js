```
<button
  style={{ marginRight: "10px" }}
  type="button"
  className="btn btn-primary btn-success ms-1"
  data-bs-toggle="modal"
  data-bs-target={`#exampleModal${i}`}
>
  <FaEdit />
</button>

<button
  type="submit"
  className="btn btn-danger"
  onClick={() => handleDeleteTask(task.id)}
>
  <FaTrash />
</button>
```